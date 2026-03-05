import dictionary from './node-dictionary.json';

export const SP_NODE_DICTIONARY = dictionary;

export type SpNodeDictionary = typeof dictionary;

export function getNodeDefinition(type: string): unknown {
  const types = dictionary.node_types as Record<string, unknown>;
  return types[type] ?? null;
}

export function buildLlmSystemPrompt(options?: {
  includeExamples?: boolean;
  categories?: string[];
}): string {
  const { includeExamples = true, categories } = options ?? {};
  const all = dictionary.node_types as Record<string, { description: string; full_example?: unknown; category?: string }>;

  const filtered = categories
    ? Object.fromEntries(Object.entries(all).filter(([, def]) => categories.includes(def.category ?? '')))
    : all;

  const nodeList = Object.entries(filtered)
    .map(([type, def]) => {
      let entry = `### ${type}\n${def.description}`;
      if (includeExamples && def.full_example) {
        entry += `\nExample:\n${JSON.stringify(def.full_example, null, 2)}`;
      }
      return entry;
    })
    .join('\n\n');

  return `You are a SmartPlayer slide generator. Generate slides as a valid JSON object matching this schema:

## Slide Structure
${JSON.stringify(dictionary.slide_structure.schema, null, 2)}

## Node Base Schema
${JSON.stringify(dictionary.node_base_schema.fields, null, 2)}

## Available Node Types (${Object.keys(filtered).length} of ${dictionary.total_node_types})

${nodeList}

## Rules
${dictionary.llm_generation_rules.rules.join('\n')}

Respond with valid JSON only. No markdown code fences, no explanation text — raw JSON.`;
}
