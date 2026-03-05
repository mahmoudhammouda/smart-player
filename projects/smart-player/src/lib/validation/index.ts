import { z } from 'zod';
import { ValidationIssue, ValidationResult } from './types';
import { SlideBaseSchema } from './slide-schema';
import { NODE_VALIDATORS } from './node-validators';

function zodPathToString(path: (string | number)[]): string {
  return path.map((p, i) => typeof p === 'number' ? `[${p}]` : (i === 0 ? p : `.${p}`)).join('');
}

export function validateSlide(raw: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  const structResult = SlideBaseSchema.safeParse(raw);

  if (!structResult.success) {
    for (const zodIssue of structResult.error.issues) {
      const path = zodPathToString(zodIssue.path as (string | number)[]) || '(racine)';

      let hint: string | undefined;
      if (zodIssue.code === 'invalid_type' && zodIssue.expected === 'string') {
        hint = `Attendu une chaîne, reçu "${zodIssue.received}".`;
      }
      if (zodIssue.code === 'invalid_type' && zodIssue.expected === 'array') {
        hint = `Attendu un tableau (ex: []), reçu "${zodIssue.received}".`;
      }

      issues.push({
        severity: 'error',
        path,
        message: zodIssue.message,
        hint,
      });
    }

    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    return { valid: false, issues, errorCount, warningCount, infoCount };
  }

  const slide = structResult.data;
  const seenIds = new Set<string>();

  slide.nodes.forEach((node, idx) => {
    const prefix = `nodes[${idx}]`;

    if (seenIds.has(node.id)) {
      issues.push({
        severity: 'error',
        path: `${prefix}.id`,
        message: `L'ID "${node.id}" est dupliqué. Tous les IDs de nœuds doivent être uniques.`,
      });
    } else {
      seenIds.add(node.id);
    }

    const validator = NODE_VALIDATORS[node.type];
    if (!validator) {
      issues.push({
        severity: 'warning',
        path: `${prefix}.type`,
        message: `"${node.type}" n'est pas un type intégré connu. Le nœud sera rendu comme type inconnu.`,
        hint: `Types disponibles : ${Object.keys(NODE_VALIDATORS).join(', ')}`,
      });
      return;
    }

    const nodeRaw = node as unknown as Record<string, unknown>;
    const nodeIssues = validator(nodeRaw);
    for (const ni of nodeIssues) {
      issues.push({
        ...ni,
        path: `${prefix}.${ni.path}`,
      });
    }
  });

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return {
    valid: errorCount === 0,
    issues,
    errorCount,
    warningCount,
    infoCount,
  };
}

export type { ValidationIssue, ValidationResult, ValidationSeverity, NodeValidator } from './types';
export { NODE_VALIDATORS } from './node-validators';
export { SlideBaseSchema, SlideNodeBaseSchema } from './slide-schema';
