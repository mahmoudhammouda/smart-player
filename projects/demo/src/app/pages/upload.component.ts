import { Component, signal, computed, inject } from '@angular/core';
import { SmartPlayerComponent, Slide, BUILT_IN_NODE_TYPES } from 'smart-player';

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  path: string;
  message: string;
  hint?: string;
}

const BUILT_IN_SET = new Set<string>(BUILT_IN_NODE_TYPES as readonly string[]);

function validateSlide(raw: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    issues.push({ severity: 'error', path: '(root)', message: 'La slide doit être un objet JSON (pas un tableau ni une valeur primitive).' });
    return issues;
  }

  const obj = raw as Record<string, unknown>;

  if (!obj['id']) {
    issues.push({ severity: 'error', path: 'id', message: 'Champ requis manquant.', hint: 'Ajoutez "id": "mon-slide-001"' });
  } else if (typeof obj['id'] !== 'string') {
    issues.push({ severity: 'error', path: 'id', message: `Doit être une chaîne, reçu ${typeof obj['id']}.` });
  }

  if (!obj['title']) {
    issues.push({ severity: 'error', path: 'title', message: 'Champ requis manquant.', hint: 'Ajoutez "title": "Titre de la slide"' });
  } else if (typeof obj['title'] !== 'string') {
    issues.push({ severity: 'error', path: 'title', message: `Doit être une chaîne, reçu ${typeof obj['title']}.` });
  }

  if (obj['description'] !== undefined && typeof obj['description'] !== 'string') {
    issues.push({ severity: 'warning', path: 'description', message: 'Devrait être une chaîne ou omis.' });
  }

  if (obj['tags'] !== undefined) {
    if (!Array.isArray(obj['tags'])) {
      issues.push({ severity: 'warning', path: 'tags', message: 'Devrait être un tableau de chaînes.', hint: '["science", "intro"]' });
    } else {
      (obj['tags'] as unknown[]).forEach((t, i) => {
        if (typeof t !== 'string') {
          issues.push({ severity: 'warning', path: `tags[${i}]`, message: `Tag doit être une chaîne, reçu ${typeof t}.` });
        }
      });
    }
  }

  if (!obj['nodes']) {
    issues.push({ severity: 'error', path: 'nodes', message: 'Champ requis manquant.', hint: 'Ajoutez "nodes": []' });
    return issues;
  }

  if (!Array.isArray(obj['nodes'])) {
    issues.push({ severity: 'error', path: 'nodes', message: `Doit être un tableau, reçu ${typeof obj['nodes']}.` });
    return issues;
  }

  const nodes = obj['nodes'] as unknown[];
  if (nodes.length === 0) {
    issues.push({ severity: 'warning', path: 'nodes', message: 'Le tableau nodes est vide. La slide ne montrera rien.' });
  }

  const seenIds = new Set<string>();
  nodes.forEach((node, i) => {
    const prefix = `nodes[${i}]`;
    const nodeIssues = validateNode(node, prefix, seenIds, false);
    issues.push(...nodeIssues);
  });

  return issues;
}

function validateNode(raw: unknown, prefix: string, seenIds: Set<string>, isNested: boolean): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    issues.push({ severity: 'error', path: prefix, message: 'Chaque nœud doit être un objet JSON.' });
    return issues;
  }

  const n = raw as Record<string, unknown>;

  if (!n['id']) {
    issues.push({ severity: 'error', path: `${prefix}.id`, message: 'Champ requis manquant.', hint: `Ajoutez "id": "n${Math.floor(Math.random()*100)}"` });
  } else if (typeof n['id'] !== 'string') {
    issues.push({ severity: 'error', path: `${prefix}.id`, message: `Doit être une chaîne, reçu ${typeof n['id']}.` });
  } else {
    if (seenIds.has(n['id'] as string)) {
      issues.push({ severity: 'error', path: `${prefix}.id`, message: `ID "${n['id']}" est dupliqué dans la slide. Tous les IDs doivent être uniques.` });
    } else {
      seenIds.add(n['id'] as string);
    }
  }

  if (!n['type']) {
    issues.push({ severity: 'error', path: `${prefix}.type`, message: 'Champ requis manquant.', hint: 'Ajoutez "type": "text" (ou un des 30 types disponibles)' });
  } else if (typeof n['type'] !== 'string') {
    issues.push({ severity: 'error', path: `${prefix}.type`, message: `Doit être une chaîne, reçu ${typeof n['type']}.` });
  } else {
    const type = n['type'] as string;
    if (!BUILT_IN_SET.has(type)) {
      issues.push({ severity: 'warning', path: `${prefix}.type`, message: `"${type}" n'est pas un type intégré. Il sera rendu comme nœud inconnu.`, hint: `Types valides : ${[...BUILT_IN_SET].join(', ')}` });
    } else {
      const typeIssues = validateNodeContent(type, n, prefix);
      issues.push(...typeIssues);
    }
  }

  if (!('content' in n)) {
    const type = typeof n['type'] === 'string' ? n['type'] : '';
    if (type !== 'divider') {
      issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Champ requis manquant. Même null est accepté pour "divider".' });
    }
  }

  if (n['language'] !== undefined && typeof n['language'] !== 'string') {
    issues.push({ severity: 'warning', path: `${prefix}.language`, message: 'Devrait être une chaîne (ex: "python", "javascript").' });
  }

  if (n['label'] !== undefined && typeof n['label'] !== 'string') {
    issues.push({ severity: 'warning', path: `${prefix}.label`, message: 'Devrait être une chaîne ou omis.' });
  }

  if (n['meta'] !== undefined) {
    if (typeof n['meta'] !== 'object' || Array.isArray(n['meta']) || n['meta'] === null) {
      issues.push({ severity: 'error', path: `${prefix}.meta`, message: 'Doit être un objet JSON (clé/valeur).', hint: '{ "variant": "info", "title": "Note" }' });
    }
  }

  return issues;
}

function validateNodeContent(type: string, n: Record<string, unknown>, prefix: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const content = n['content'];
  const meta = n['meta'] as Record<string, unknown> | undefined;

  switch (type) {
    case 'text':
    case 'math':
    case 'diagram':
    case 'footnote':
    case 'interactive-sandbox':
    case 'chemical-structure':
    case 'file-pdf':
    case 'progress':
    case 'mention':
      if (content !== undefined && typeof content !== 'string') {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: `Le type "${type}" attend une chaîne, reçu ${typeOf(content)}.` });
      }
      break;

    case 'heading':
      if (typeof content !== 'string') {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être une chaîne (le texte du titre).', hint: '"Mon titre de section"' });
      }
      if (meta?.['level'] !== undefined) {
        const lvl = meta['level'];
        if (![1, 2, 3].includes(lvl as number)) {
          issues.push({ severity: 'warning', path: `${prefix}.meta.level`, message: `Valeur invalide "${lvl}". Attendu : 1, 2 ou 3.` });
        }
      }
      break;

    case 'code':
      if (typeof content !== 'string') {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être une chaîne (le code source).', hint: '"console.log(\\"hello\\")"' });
      }
      if (!n['language']) {
        issues.push({ severity: 'info', path: `${prefix}.language`, message: 'Recommandé : ajoutez "language": "python" pour la coloration syntaxique.' });
      }
      break;

    case 'callout':
      if (typeof content !== 'string') {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être une chaîne (le texte du callout).' });
      }
      if (meta?.['variant'] !== undefined) {
        const valid = ['info', 'warning', 'error', 'success', 'tip'];
        if (!valid.includes(meta['variant'] as string)) {
          issues.push({ severity: 'warning', path: `${prefix}.meta.variant`, message: `"${meta['variant']}" invalide. Valeurs : ${valid.join(', ')}.` });
        }
      }
      break;

    case 'quote':
      if (typeof content !== 'string') {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être une chaîne (le texte de la citation).' });
      }
      break;

    case 'key-concept':
      if (typeof content !== 'string') {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être une chaîne (la définition du concept).' });
      }
      if (!meta?.['term']) {
        issues.push({ severity: 'warning', path: `${prefix}.meta.term`, message: 'Champ recommandé manquant.', hint: 'Ajoutez "meta": { "term": "Nom du concept" }' });
      }
      break;

    case 'divider':
      if (content !== null && content !== undefined) {
        issues.push({ severity: 'info', path: `${prefix}.content`, message: 'Pour "divider", le contenu est ignoré. Utilisez null.' });
      }
      if (meta?.['style'] !== undefined) {
        const valid = ['line', 'dots', 'stars'];
        if (!valid.includes(meta['style'] as string)) {
          issues.push({ severity: 'warning', path: `${prefix}.meta.style`, message: `"${meta['style']}" invalide. Valeurs : ${valid.join(', ')}.` });
        }
      }
      break;

    case 'list':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau d\'items.', hint: '["Premier item", "Deuxième item"]' });
      }
      break;

    case 'step-by-step':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau d\'étapes.', hint: '[{"title": "Étape 1", "description": "..."}]' });
      } else {
        (content as unknown[]).forEach((step, i) => {
          if (typeof step !== 'object' || step === null) {
            issues.push({ severity: 'error', path: `${prefix}.content[${i}]`, message: 'Chaque étape doit être un objet.' });
          } else {
            const s = step as Record<string, unknown>;
            if (!s['title']) issues.push({ severity: 'error', path: `${prefix}.content[${i}].title`, message: 'Champ requis manquant.' });
            if (!s['description']) issues.push({ severity: 'warning', path: `${prefix}.content[${i}].description`, message: 'Champ recommandé manquant.' });
          }
        });
      }
      break;

    case 'table':
      if (typeof content !== 'object' || content === null || Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un objet { headers: string[], rows: string[][] }.', hint: '{"headers": ["Col A", "Col B"], "rows": [["a", "b"]]}' });
      } else {
        const t = content as Record<string, unknown>;
        if (!Array.isArray(t['headers'])) {
          issues.push({ severity: 'error', path: `${prefix}.content.headers`, message: 'Champ requis. Doit être un tableau de chaînes.' });
        }
        if (!Array.isArray(t['rows'])) {
          issues.push({ severity: 'error', path: `${prefix}.content.rows`, message: 'Champ requis. Doit être un tableau de tableaux de chaînes.' });
        } else if (Array.isArray(t['headers'])) {
          const nCols = (t['headers'] as unknown[]).length;
          (t['rows'] as unknown[]).forEach((row, i) => {
            if (!Array.isArray(row)) {
              issues.push({ severity: 'error', path: `${prefix}.content.rows[${i}]`, message: 'Chaque ligne doit être un tableau.' });
            } else if ((row as unknown[]).length !== nCols) {
              issues.push({ severity: 'warning', path: `${prefix}.content.rows[${i}]`, message: `La ligne a ${(row as unknown[]).length} cellules mais ${nCols} colonnes sont définies.` });
            }
          });
        }
      }
      break;

    case 'image-caption':
    case 'video-embed':
    case 'audio-player':
      if (typeof content !== 'string' || !content) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être une URL valide (chaîne non vide).', hint: '"https://..."' });
      } else if (!content.startsWith('http')) {
        issues.push({ severity: 'warning', path: `${prefix}.content`, message: 'L\'URL devrait commencer par "https://".' });
      }
      if (type === 'video-embed' && meta?.['provider'] !== undefined) {
        if (!['youtube', 'mp4'].includes(meta['provider'] as string)) {
          issues.push({ severity: 'warning', path: `${prefix}.meta.provider`, message: `"${meta['provider']}" invalide. Valeurs : "youtube", "mp4".` });
        }
      }
      break;

    case 'gallery':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau d\'objets { url, caption? }.', hint: '[{"url": "https://...", "caption": "..."}]' });
      } else {
        (content as unknown[]).forEach((item, i) => {
          if (typeof item !== 'object' || item === null) {
            issues.push({ severity: 'error', path: `${prefix}.content[${i}]`, message: 'Chaque item doit être un objet { url, caption? }.' });
          } else {
            const g = item as Record<string, unknown>;
            if (!g['url'] || typeof g['url'] !== 'string') {
              issues.push({ severity: 'error', path: `${prefix}.content[${i}].url`, message: 'Champ requis. Doit être une URL.' });
            }
          }
        });
      }
      break;

    case 'fill-blanks':
      if (typeof content !== 'string') {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être une chaîne avec des blancs ___réponse___.', hint: '"La capitale de la France est ___Paris___."' });
      } else if (!content.includes('___')) {
        issues.push({ severity: 'warning', path: `${prefix}.content`, message: 'Aucun blanc trouvé. Utilisez ___réponse___ pour marquer les trous.' });
      }
      break;

    case 'flash-card':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau de { front, back }.', hint: '[{"front": "Question", "back": "Réponse"}]' });
      } else {
        (content as unknown[]).forEach((card, i) => {
          if (typeof card !== 'object' || card === null) {
            issues.push({ severity: 'error', path: `${prefix}.content[${i}]`, message: 'Chaque carte doit être un objet.' });
          } else {
            const c = card as Record<string, unknown>;
            if (!c['front']) issues.push({ severity: 'error', path: `${prefix}.content[${i}].front`, message: 'Champ requis manquant.' });
            if (!c['back']) issues.push({ severity: 'error', path: `${prefix}.content[${i}].back`, message: 'Champ requis manquant.' });
          }
        });
      }
      break;

    case 'toggle-list':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau de { title, body }.', hint: '[{"title": "Question", "body": "Réponse détaillée"}]' });
      } else {
        (content as unknown[]).forEach((item, i) => {
          if (typeof item !== 'object' || item === null) {
            issues.push({ severity: 'error', path: `${prefix}.content[${i}]`, message: 'Chaque item doit être un objet.' });
          } else {
            const ti = item as Record<string, unknown>;
            if (!ti['title']) issues.push({ severity: 'error', path: `${prefix}.content[${i}].title`, message: 'Champ requis manquant.' });
            if (!ti['body']) issues.push({ severity: 'warning', path: `${prefix}.content[${i}].body`, message: 'Champ body manquant (contenu vide à l\'ouverture).' });
          }
        });
      }
      break;

    case 'checklist':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau de { text, checked }.', hint: '[{"text": "Tâche 1", "checked": false}]' });
      } else {
        (content as unknown[]).forEach((item, i) => {
          if (typeof item !== 'object' || item === null) {
            issues.push({ severity: 'error', path: `${prefix}.content[${i}]`, message: 'Chaque item doit être un objet.' });
          } else {
            const ci = item as Record<string, unknown>;
            if (!ci['text']) issues.push({ severity: 'error', path: `${prefix}.content[${i}].text`, message: 'Champ requis manquant.' });
            if (ci['checked'] !== undefined && typeof ci['checked'] !== 'boolean') {
              issues.push({ severity: 'warning', path: `${prefix}.content[${i}].checked`, message: 'Devrait être true ou false.' });
            }
          }
        });
      }
      break;

    case 'toc':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau de { title, level }.', hint: '[{"title": "Section 1", "level": 1}]' });
      } else {
        (content as unknown[]).forEach((item, i) => {
          if (typeof item !== 'object' || item === null) {
            issues.push({ severity: 'error', path: `${prefix}.content[${i}]`, message: 'Chaque item doit être un objet.' });
          } else {
            const ti = item as Record<string, unknown>;
            if (!ti['title']) issues.push({ severity: 'error', path: `${prefix}.content[${i}].title`, message: 'Champ requis manquant.' });
            if (ti['level'] !== undefined && ![1, 2, 3].includes(ti['level'] as number)) {
              issues.push({ severity: 'warning', path: `${prefix}.content[${i}].level`, message: `Niveau "${ti['level']}" invalide. Attendu : 1, 2 ou 3.` });
            }
          }
        });
      }
      break;

    case 'data-board':
      if (typeof content !== 'object' || content === null || Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être { columns: [...] }.', hint: '{"columns": [{"title": "À faire", "cards": [{"title": "Tâche"}]}]}' });
      } else {
        const db = content as Record<string, unknown>;
        if (!Array.isArray(db['columns'])) {
          issues.push({ severity: 'error', path: `${prefix}.content.columns`, message: 'Champ requis. Doit être un tableau de colonnes.' });
        } else {
          (db['columns'] as unknown[]).forEach((col, ci) => {
            if (typeof col !== 'object' || col === null) {
              issues.push({ severity: 'error', path: `${prefix}.content.columns[${ci}]`, message: 'Chaque colonne doit être un objet.' });
            } else {
              const c = col as Record<string, unknown>;
              if (!c['title']) issues.push({ severity: 'error', path: `${prefix}.content.columns[${ci}].title`, message: 'Champ requis manquant.' });
              if (!Array.isArray(c['cards'])) {
                issues.push({ severity: 'error', path: `${prefix}.content.columns[${ci}].cards`, message: 'Champ requis. Doit être un tableau.' });
              } else {
                (c['cards'] as unknown[]).forEach((card, ki) => {
                  const k = card as Record<string, unknown>;
                  if (!k?.['title']) issues.push({ severity: 'error', path: `${prefix}.content.columns[${ci}].cards[${ki}].title`, message: 'Champ requis manquant.' });
                  if (k?.['priority'] && !['low', 'medium', 'high'].includes(k['priority'] as string)) {
                    issues.push({ severity: 'warning', path: `${prefix}.content.columns[${ci}].cards[${ki}].priority`, message: `"${k['priority']}" invalide. Valeurs : low, medium, high.` });
                  }
                });
              }
            }
          });
        }
      }
      break;

    case 'web-bookmark':
      if (typeof content !== 'object' || content === null || Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un objet { url, title, ... }.', hint: '{"url": "https://...", "title": "Titre de la page"}' });
      } else {
        const bm = content as Record<string, unknown>;
        if (!bm['url'] || typeof bm['url'] !== 'string') {
          issues.push({ severity: 'error', path: `${prefix}.content.url`, message: 'Champ requis manquant. Doit être une URL.' });
        }
        if (!bm['title'] || typeof bm['title'] !== 'string') {
          issues.push({ severity: 'error', path: `${prefix}.content.title`, message: 'Champ requis manquant.' });
        }
      }
      break;

    case 'columns-layout':
      if (!Array.isArray(content)) {
        issues.push({ severity: 'error', path: `${prefix}.content`, message: 'Doit être un tableau de tableaux de nœuds (SlideNode[][]). Chaque sous-tableau est une colonne.', hint: '[[{"id":"c1","type":"text","content":"Col 1"}], [{"id":"c2","type":"math","content":"E=mc^2"}]]' });
      } else {
        if (content.length < 2) {
          issues.push({ severity: 'warning', path: `${prefix}.content`, message: `columns-layout a ${content.length} colonne(s). Minimum recommandé : 2.` });
        }
        if (content.length > 3) {
          issues.push({ severity: 'warning', path: `${prefix}.content`, message: `${content.length} colonnes détectées. Maximum recommandé : 3.` });
        }
        const globalSeenIds = new Set<string>();
        (content as unknown[]).forEach((col, ci) => {
          if (!Array.isArray(col)) {
            issues.push({ severity: 'error', path: `${prefix}.content[${ci}]`, message: 'Chaque colonne doit être un tableau de nœuds.' });
          } else {
            (col as unknown[]).forEach((childNode, ni) => {
              const childIssues = validateNode(childNode, `${prefix}.content[${ci}][${ni}]`, globalSeenIds, true);
              issues.push(...childIssues);
            });
          }
        });
      }
      break;
  }

  return issues;
}

function typeOf(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

function getSyntaxErrorPosition(jsonText: string, error: SyntaxError): { line: number; col: number } | null {
  const match = error.message.match(/position (\d+)/i) ?? error.message.match(/at (\d+)/);
  if (!match) return null;
  const pos = parseInt(match[1], 10);
  const before = jsonText.slice(0, pos);
  const line = (before.match(/\n/g) ?? []).length + 1;
  const col = pos - before.lastIndexOf('\n');
  return { line, col };
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [SmartPlayerComponent],
  template: `
    @if (slide()) {
      <div class="upload-result">
        <div class="upload-result-header">
          <div>
            <h2 class="upload-result-title">{{ slide()!.title }}</h2>
            <p class="upload-result-meta">
              {{ slide()!.nodes.length }} nœud{{ slide()!.nodes.length !== 1 ? 's' : '' }}
              @if (warningCount() > 0) {
                &nbsp;·&nbsp;
                <span class="warn-badge">{{ warningCount() }} avert.</span>
              }
            </p>
          </div>
          <button class="nav-btn" (click)="reset()" data-testid="button-load-another">
            Charger un autre
          </button>
        </div>

        @if (issues().length > 0) {
          <div class="issues-banner">
            <div class="issues-banner-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              {{ warningCount() }} avertissement{{ warningCount() !== 1 ? 's' : '' }} (la slide s'affiche quand même)
            </div>
            @for (issue of issues(); track $index) {
              <div class="issue-row" [class]="'issue-' + issue.severity">
                <span class="issue-badge" [class]="'badge-' + issue.severity">{{ severityLabel(issue.severity) }}</span>
                <code class="issue-path">{{ issue.path }}</code>
                <span class="issue-msg">{{ issue.message }}</span>
                @if (issue.hint) {
                  <span class="issue-hint">→ {{ issue.hint }}</span>
                }
              </div>
            }
          </div>
        }

        <sp-smart-player [slide]="slide()!" [enableRefine]="false" />
      </div>
    } @else {
      <div class="upload-page">
        <div class="upload-header">
          <h1 class="upload-title">Charger un JSON</h1>
          <p class="upload-subtitle">
            Glissez un fichier .json, parcourez vos fichiers, ou collez directement du JSON.
            La validation s'effectue en temps réel.
          </p>
        </div>

        <div
          class="upload-dropzone"
          [class.dropzone-active]="dragging()"
          (dragover)="onDragOver($event)"
          (dragleave)="dragging.set(false)"
          (drop)="onDrop($event)"
          data-testid="dropzone-upload"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="color:var(--muted-fg,#64748b)"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12h4"/><path d="M10 18h4"/><path d="M10 6h4"/></svg>
          <p class="dropzone-text">Glisser un fichier JSON ici</p>
          <p class="dropzone-sub">ou</p>
          <label class="nav-btn" for="file-input" data-testid="label-browse-files">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Parcourir
          </label>
          <input id="file-input" type="file" accept=".json" style="display:none" (change)="onFileInput($event)" data-testid="input-file" />
        </div>

        <div class="divider"><span>ou coller du JSON</span></div>

        <div class="editor-area">
          <div class="editor-toolbar">
            <span class="editor-label">JSON</span>
            <div class="editor-tools">
              <button class="tool-btn" (click)="formatJSON()" [disabled]="!jsonText().trim()" title="Formater" data-testid="button-format-json">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10H3"/><path d="M21 6H3"/><path d="M21 14H3"/><path d="M21 18H3"/></svg>
                Formater
              </button>
              <button class="tool-btn" (click)="clearJSON()" [disabled]="!jsonText().trim()" title="Vider" data-testid="button-clear-json">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Vider
              </button>
              <button class="tool-btn" (click)="loadExample()" title="Charger l'exemple" data-testid="button-load-example">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                Exemple
              </button>
            </div>
          </div>

          <div class="editor-wrapper" [class.has-errors]="liveErrorCount() > 0" [class.has-warnings]="liveErrorCount() === 0 && liveWarningCount() > 0" [class.is-valid]="jsonText().trim() && liveIssues().length === 0">
            <textarea
              class="paste-textarea"
              placeholder='{"id": "slide-001", "title": "Ma slide", "nodes": [...]}'
              [value]="jsonText()"
              (input)="onTextInput($event)"
              rows="14"
              spellcheck="false"
              data-testid="textarea-json"
            ></textarea>
            <div class="editor-status-bar">
              @if (!jsonText().trim()) {
                <span class="status-empty">En attente de JSON…</span>
              } @else if (parseError()) {
                <span class="status-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  JSON invalide
                </span>
              } @else if (liveErrorCount() > 0) {
                <span class="status-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ liveErrorCount() }} erreur{{ liveErrorCount() !== 1 ? 's' : '' }}
                </span>
                @if (liveWarningCount() > 0) {
                  <span class="status-warn">
                    {{ liveWarningCount() }} avert.
                  </span>
                }
              } @else if (liveWarningCount() > 0) {
                <span class="status-warn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  {{ liveWarningCount() }} avertissement{{ liveWarningCount() !== 1 ? 's' : '' }}
                </span>
              } @else {
                <span class="status-ok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  JSON valide
                </span>
              }
              <span class="status-chars">{{ jsonText().length }} car.</span>
            </div>
          </div>

          @if (liveIssues().length > 0) {
            <div class="issues-panel" data-testid="panel-validation-issues">
              <div class="issues-panel-header">
                <span class="issues-panel-title">Problèmes de validation</span>
                <div class="issues-counts">
                  @if (liveErrorCount() > 0) {
                    <span class="count-badge error-count">{{ liveErrorCount() }} erreur{{ liveErrorCount() !== 1 ? 's' : '' }}</span>
                  }
                  @if (liveWarningCount() > 0) {
                    <span class="count-badge warn-count">{{ liveWarningCount() }} avert.</span>
                  }
                  @if (liveInfoCount() > 0) {
                    <span class="count-badge info-count">{{ liveInfoCount() }} info</span>
                  }
                </div>
              </div>

              <div class="issues-list">
                @for (issue of liveIssues(); track $index) {
                  <div class="issue-item" [class]="'issue-' + issue.severity" [attr.data-testid]="'issue-' + issue.severity">
                    <span class="issue-severity-dot" [class]="'dot-' + issue.severity"></span>
                    <div class="issue-body">
                      <div class="issue-header-row">
                        <code class="issue-path-inline">{{ issue.path }}</code>
                        <span class="issue-sev-label" [class]="'sev-' + issue.severity">{{ severityLabel(issue.severity) }}</span>
                      </div>
                      <p class="issue-message">{{ issue.message }}</p>
                      @if (issue.hint) {
                        <p class="issue-hint-text">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                          {{ issue.hint }}
                        </p>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (parseError()) {
            <div class="parse-error-block" data-testid="panel-parse-error">
              <div class="parse-error-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Erreur de syntaxe JSON
              </div>
              <code class="parse-error-msg">{{ parseError() }}</code>
              <p class="parse-error-hint">Vérifiez les virgules manquantes, guillemets non fermés, ou accolades mal appariées.</p>
            </div>
          }

          <div class="editor-actions">
            <button
              class="btn btn-primary"
              [disabled]="!canPreview()"
              (click)="preview()"
              data-testid="button-preview"
            >
              @if (liveErrorCount() > 0) {
                Prévisualiser quand même ({{ liveErrorCount() }} erreur{{ liveErrorCount() !== 1 ? 's' : '' }})
              } @else {
                Prévisualiser la slide
              }
            </button>
            @if (liveErrorCount() > 0) {
              <span class="preview-warning-note">Des nœuds invalides pourraient ne pas s'afficher correctement.</span>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .upload-page, .upload-result {
      max-width: 720px;
      margin: 0 auto;
      padding: 36px 24px 80px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .upload-result { max-width: 860px; padding-top: 24px; }

    .upload-result-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .upload-result-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
    .upload-result-meta {
      font-size: 0.8rem;
      color: var(--muted-fg, #64748b);
      margin: 4px 0 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .warn-badge {
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(245,158,11,0.12);
      color: #d97706;
      padding: 1px 6px;
      border-radius: 8px;
    }

    .upload-header { display: flex; flex-direction: column; gap: 6px; }
    .upload-title { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.025em; margin: 0; }
    .upload-subtitle { font-size: 0.875rem; color: var(--muted-fg, #64748b); line-height: 1.6; margin: 0; }

    .upload-dropzone {
      border: 2px dashed var(--border, #e2e8f0);
      border-radius: 14px;
      padding: 36px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: border-color 0.15s, background 0.15s;
      background: color-mix(in srgb, var(--muted, #f1f5f9) 30%, transparent);
      cursor: pointer;
    }

    .upload-dropzone:hover, .upload-dropzone.dropzone-active {
      border-color: color-mix(in srgb, var(--primary, #3b82f6) 60%, transparent);
      background: color-mix(in srgb, var(--primary, #3b82f6) 5%, transparent);
    }

    .dropzone-text { font-size: 0.88rem; font-weight: 600; margin: 0; }
    .dropzone-sub { font-size: 0.75rem; color: var(--muted-fg, #64748b); margin: 0; }

    .nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--fg, #1e293b);
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 6px;
      cursor: pointer;
      background: var(--card, #fff);
      transition: background 0.15s;
      text-decoration: none;
    }
    .nav-btn:hover { background: var(--muted, #f1f5f9); }

    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      &::before, &::after { content: ''; flex: 1; height: 1px; background: var(--border, #e2e8f0); }
      span { font-size: 0.72rem; color: var(--muted-fg, #64748b); white-space: nowrap; }
    }

    .editor-area {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      background: var(--muted, #f1f5f9);
      border: 1px solid var(--border, #e2e8f0);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
    }

    .editor-label {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--muted-fg, #64748b);
    }

    .editor-tools {
      display: flex;
      gap: 4px;
    }

    .tool-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--muted-fg, #64748b);
      background: none;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.12s, color 0.12s;
    }
    .tool-btn:hover:not(:disabled) { background: var(--card, #fff); color: var(--foreground, #0f172a); border-color: var(--border, #e2e8f0); }
    .tool-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .editor-wrapper {
      position: relative;
      border: 1px solid var(--border, #e2e8f0);
      transition: border-color 0.15s;
    }

    .editor-wrapper.has-errors { border-color: rgba(239,68,68,0.5); }
    .editor-wrapper.has-warnings { border-color: rgba(245,158,11,0.5); }
    .editor-wrapper.is-valid { border-color: rgba(34,197,94,0.5); }

    .paste-textarea {
      width: 100%;
      border: none;
      padding: 14px;
      font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
      font-size: 0.76rem;
      line-height: 1.7;
      background: #0f172a;
      color: #e2e8f0;
      resize: vertical;
      outline: none;
      box-sizing: border-box;
      display: block;
      min-height: 200px;
    }

    .paste-textarea::placeholder { color: #475569; }

    .editor-status-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 12px;
      background: #1e293b;
      font-size: 0.7rem;
      font-family: ui-monospace, monospace;
    }

    .status-empty { color: #475569; }
    .status-ok { color: #22c55e; display: flex; align-items: center; gap: 4px; }
    .status-error { color: #ef4444; display: flex; align-items: center; gap: 4px; }
    .status-warn { color: #f59e0b; display: flex; align-items: center; gap: 4px; }
    .status-chars { color: #475569; margin-left: auto; }

    .issues-panel {
      border: 1px solid var(--border, #e2e8f0);
      border-top: none;
      border-radius: 0;
      background: var(--card, #fff);
      max-height: 320px;
      overflow-y: auto;
    }

    .issues-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border, #f0f2f5);
      background: var(--muted, #f8fafc);
      position: sticky;
      top: 0;
    }

    .issues-panel-title {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted-fg, #64748b);
    }

    .issues-counts { display: flex; gap: 6px; }

    .count-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 8px;
    }

    .error-count { background: rgba(239,68,68,0.1); color: #ef4444; }
    .warn-count { background: rgba(245,158,11,0.1); color: #d97706; }
    .info-count { background: rgba(59,130,246,0.1); color: #3b82f6; }

    .issues-list { display: flex; flex-direction: column; }

    .issue-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border, #f0f2f5);
      transition: background 0.1s;
    }

    .issue-item:last-child { border-bottom: none; }
    .issue-item:hover { background: var(--muted, #f8fafc); }

    .issue-severity-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 5px;
    }

    .dot-error { background: #ef4444; }
    .dot-warning { background: #f59e0b; }
    .dot-info { background: #3b82f6; }

    .issue-body { flex: 1; display: flex; flex-direction: column; gap: 3px; }

    .issue-header-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .issue-path-inline {
      font-size: 0.72rem;
      font-family: ui-monospace, monospace;
      color: var(--foreground, #0f172a);
      background: var(--muted, #f1f5f9);
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 600;
    }

    .issue-sev-label {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .sev-error { background: rgba(239,68,68,0.1); color: #ef4444; }
    .sev-warning { background: rgba(245,158,11,0.1); color: #d97706; }
    .sev-info { background: rgba(59,130,246,0.1); color: #3b82f6; }

    .issue-message {
      font-size: 0.78rem;
      color: var(--foreground, #1e293b);
      margin: 0;
      line-height: 1.5;
    }

    .issue-hint-text {
      font-size: 0.72rem;
      color: var(--muted-fg, #64748b);
      margin: 0;
      display: flex;
      align-items: baseline;
      gap: 4px;
      line-height: 1.4;
    }

    .parse-error-block {
      border: 1px solid rgba(239,68,68,0.25);
      border-top: none;
      background: rgba(239,68,68,0.04);
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .parse-error-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #ef4444;
    }

    .parse-error-msg {
      font-size: 0.75rem;
      font-family: ui-monospace, monospace;
      color: #ef4444;
    }

    .parse-error-hint {
      font-size: 0.72rem;
      color: var(--muted-fg, #64748b);
      margin: 0;
    }

    .editor-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
    }

    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: var(--primary, #3b82f6); color: white; }

    .preview-warning-note {
      font-size: 0.72rem;
      color: var(--muted-fg, #64748b);
    }

    .issues-banner {
      border: 1px solid rgba(245,158,11,0.25);
      background: rgba(245,158,11,0.04);
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .issues-banner-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #d97706;
      margin-bottom: 4px;
    }

    .issue-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 0.75rem;
      flex-wrap: wrap;
    }

    .issue-badge {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 1px 5px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    .badge-error { background: rgba(239,68,68,0.12); color: #ef4444; }
    .badge-warning { background: rgba(245,158,11,0.12); color: #d97706; }
    .badge-info { background: rgba(59,130,246,0.12); color: #3b82f6; }

    .issue-path { font-size: 0.7rem; font-family: ui-monospace, monospace; color: var(--muted-fg, #64748b); }
    .issue-msg { color: var(--foreground, #1e293b); }
    .issue-hint { color: var(--muted-fg, #64748b); font-style: italic; }
  `]
})
export class UploadComponent {
  slide = signal<Slide | null>(null);
  issues = signal<ValidationIssue[]>([]);
  dragging = signal(false);
  jsonText = signal('');
  parseError = signal<string | null>(null);

  liveIssues = signal<ValidationIssue[]>([]);
  liveErrorCount = computed(() => this.liveIssues().filter(i => i.severity === 'error').length);
  liveWarningCount = computed(() => this.liveIssues().filter(i => i.severity === 'warning').length);
  liveInfoCount = computed(() => this.liveIssues().filter(i => i.severity === 'info').length);
  warningCount = computed(() => this.issues().filter(i => i.severity !== 'error').length);

  canPreview = computed(() => {
    const text = this.jsonText().trim();
    if (!text) return false;
    if (this.parseError()) return false;
    return true;
  });

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(true);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.readFile(file);
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.readFile(file);
  }

  onTextInput(e: Event): void {
    const text = (e.target as HTMLTextAreaElement).value;
    this.jsonText.set(text);
    this.scheduleValidation(text);
  }

  formatJSON(): void {
    const text = this.jsonText().trim();
    if (!text) return;
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      this.jsonText.set(formatted);
      this.validateLive(formatted);
    } catch {
      // Keep as-is if invalid
    }
  }

  clearJSON(): void {
    this.jsonText.set('');
    this.liveIssues.set([]);
    this.parseError.set(null);
  }

  loadExample(): void {
    const example = JSON.stringify({
      id: 'example-lesson-001',
      title: 'Exemple de slide SmartPlayer',
      description: 'Une slide de démonstration avec plusieurs types de nœuds',
      tags: ['exemple', 'demo'],
      nodes: [
        { id: 'n1', type: 'heading', content: 'Introduction', meta: { level: 1 } },
        { id: 'n2', type: 'text', label: 'Présentation', content: 'Ceci est un exemple de slide. Le contenu supporte le **gras**, *l\'italique* et le `code inline`.' },
        { id: 'n3', type: 'math', label: 'Formule d\'Euler', content: 'e^{i\\pi} + 1 = 0' },
        { id: 'n4', type: 'code', language: 'python', label: 'Hello World', content: 'def hello(name):\n    return f"Bonjour, {name}!"\n\nprint(hello("monde"))' },
        { id: 'n5', type: 'callout', content: 'Les nœuds sont rendus de haut en bas dans l\'ordre du tableau "nodes".', meta: { variant: 'tip', title: 'Bon à savoir' } },
        { id: 'n6', type: 'checklist', content: [{ text: 'Lire la documentation', checked: true }, { text: 'Tester le JSON loader', checked: false }] },
      ],
    }, null, 2);
    this.jsonText.set(example);
    this.validateLive(example);
  }

  preview(): void {
    const text = this.jsonText().trim();
    if (!text || this.parseError()) return;
    try {
      const raw = JSON.parse(text);
      const allIssues = validateSlide(raw);
      this.issues.set(allIssues);
      this.slide.set(raw as Slide);
    } catch (e: unknown) {
      this.parseError.set(e instanceof Error ? e.message : 'JSON invalide');
    }
  }

  reset(): void {
    this.slide.set(null);
    this.issues.set([]);
    this.parseError.set(null);
    this.jsonText.set('');
    this.liveIssues.set([]);
  }

  severityLabel(s: ValidationIssue['severity']): string {
    return s === 'error' ? 'Erreur' : s === 'warning' ? 'Attention' : 'Info';
  }

  private scheduleValidation(text: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.validateLive(text), 300);
  }

  private validateLive(text: string): void {
    if (!text.trim()) {
      this.parseError.set(null);
      this.liveIssues.set([]);
      return;
    }
    try {
      const raw = JSON.parse(text);
      this.parseError.set(null);
      this.liveIssues.set(validateSlide(raw));
    } catch (e: unknown) {
      this.parseError.set(e instanceof Error ? e.message : 'JSON invalide');
      this.liveIssues.set([]);
    }
  }

  private readFile(file: File): void {
    if (!file.name.endsWith('.json')) {
      this.parseError.set('Veuillez charger un fichier .json');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.jsonText.set(text);
      this.validateLive(text);
    };
    reader.readAsText(file);
  }
}
