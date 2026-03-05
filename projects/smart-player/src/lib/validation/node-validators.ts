import { ValidationIssue, NodeValidator } from './types';

type N = Record<string, unknown>;
type M = Record<string, unknown>;

function meta(node: N): M {
  return (node['meta'] as M) ?? {};
}

function t(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'tableau';
  return typeof v;
}

export function validateText(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== undefined && typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne, reçu ${t(node['content'])}.` });
  }
  return issues;
}

export function validateHeading(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (le texte du titre), reçu ${t(node['content'])}.` });
  }
  const lvl = meta(node)['level'];
  if (lvl !== undefined && ![1, 2, 3].includes(lvl as number)) {
    issues.push({ severity: 'warning', path: 'meta.level', message: `Valeur "${lvl}" invalide. Attendu : 1, 2 ou 3.` });
  }
  return issues;
}

export function validateCode(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (le code source), reçu ${t(node['content'])}.` });
  }
  if (!node['language']) {
    issues.push({ severity: 'info', path: 'language', message: 'Recommandé : ajoutez "language": "python" pour la coloration syntaxique.' });
  }
  return issues;
}

export function validateMath(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== undefined && typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne LaTeX, reçu ${t(node['content'])}.` });
  }
  return issues;
}

export function validateDiagram(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== undefined && typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (syntaxe Mermaid), reçu ${t(node['content'])}.` });
  }
  return issues;
}

export function validateCallout(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (le texte du callout), reçu ${t(node['content'])}.` });
  }
  const variant = meta(node)['variant'];
  if (variant !== undefined) {
    const valid = ['info', 'warning', 'error', 'success', 'tip'];
    if (!valid.includes(variant as string)) {
      issues.push({ severity: 'warning', path: 'meta.variant', message: `"${variant}" invalide. Valeurs acceptées : ${valid.join(', ')}.` });
    }
  }
  return issues;
}

export function validateQuote(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (le texte de la citation), reçu ${t(node['content'])}.` });
  }
  return issues;
}

export function validateKeyConcept(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (la définition), reçu ${t(node['content'])}.` });
  }
  if (!meta(node)['term']) {
    issues.push({ severity: 'warning', path: 'meta.term', message: 'Champ recommandé manquant.', hint: '"meta": { "term": "Nom du concept" }' });
  }
  return issues;
}

export function validateFootnote(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== undefined && typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne, reçu ${t(node['content'])}.` });
  }
  return issues;
}

export function validateDivider(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== null && node['content'] !== undefined) {
    issues.push({ severity: 'info', path: 'content', message: 'Pour "divider", le contenu est ignoré. Utilisez null.' });
  }
  const style = meta(node)['style'];
  if (style !== undefined && !['line', 'dots', 'stars'].includes(style as string)) {
    issues.push({ severity: 'warning', path: 'meta.style', message: `"${style}" invalide. Valeurs : line, dots, stars.` });
  }
  return issues;
}

export function validateList(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau d'items (string[]), reçu ${t(node['content'])}.`, hint: '["Item 1", "Item 2"]' });
  } else {
    const items = node['content'] as unknown[];
    if (items.length === 0) {
      issues.push({ severity: 'warning', path: 'content', message: 'Le tableau est vide. La liste ne montrera rien.' });
    }
    items.forEach((item, i) => {
      if (typeof item !== 'string') {
        issues.push({ severity: 'warning', path: `content[${i}]`, message: `Devrait être une chaîne, reçu ${t(item)}.` });
      }
    });
  }
  return issues;
}

export function validateStepByStep(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau d'étapes, reçu ${t(node['content'])}.`, hint: '[{"title": "Étape 1", "description": "..."}]' });
    return issues;
  }
  const steps = node['content'] as unknown[];
  if (steps.length === 0) {
    issues.push({ severity: 'warning', path: 'content', message: 'Aucune étape définie.' });
  }
  steps.forEach((step, i) => {
    if (typeof step !== 'object' || step === null || Array.isArray(step)) {
      issues.push({ severity: 'error', path: `content[${i}]`, message: 'Chaque étape doit être un objet { title, description }.' });
    } else {
      const s = step as N;
      if (!s['title']) issues.push({ severity: 'error', path: `content[${i}].title`, message: '"title" est requis.' });
      if (!s['description']) issues.push({ severity: 'warning', path: `content[${i}].description`, message: '"description" est recommandé.' });
    }
  });
  return issues;
}

export function validateTable(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const content = node['content'];
  if (typeof content !== 'object' || content === null || Array.isArray(content)) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un objet { headers, rows }, reçu ${t(content)}.`, hint: '{"headers": ["Col A", "Col B"], "rows": [["a", "b"]]}' });
    return issues;
  }
  const c = content as N;
  if (!Array.isArray(c['headers'])) {
    issues.push({ severity: 'error', path: 'content.headers', message: 'Champ requis. Doit être un tableau de chaînes.' });
  }
  if (!Array.isArray(c['rows'])) {
    issues.push({ severity: 'error', path: 'content.rows', message: 'Champ requis. Doit être un tableau de tableaux.' });
  } else if (Array.isArray(c['headers'])) {
    const nCols = (c['headers'] as unknown[]).length;
    (c['rows'] as unknown[]).forEach((row, i) => {
      if (!Array.isArray(row)) {
        issues.push({ severity: 'error', path: `content.rows[${i}]`, message: 'Chaque ligne doit être un tableau.' });
      } else if ((row as unknown[]).length !== nCols) {
        issues.push({ severity: 'warning', path: `content.rows[${i}]`, message: `La ligne a ${(row as unknown[]).length} cellule(s) mais ${nCols} colonne(s) sont définies.` });
      }
    });
  }
  return issues;
}

export function validateImageCaption(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string' || !node['content']) {
    issues.push({ severity: 'error', path: 'content', message: 'Doit être une URL d\'image non vide.', hint: '"https://example.com/image.jpg"' });
  } else if (!node['content'].startsWith('http')) {
    issues.push({ severity: 'warning', path: 'content', message: 'L\'URL devrait commencer par "https://".' });
  }
  return issues;
}

export function validateVideoEmbed(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string' || !node['content']) {
    issues.push({ severity: 'error', path: 'content', message: 'Doit être une URL de vidéo non vide.', hint: '"https://youtube.com/watch?v=..."' });
  } else if (!node['content'].startsWith('http')) {
    issues.push({ severity: 'warning', path: 'content', message: 'L\'URL devrait commencer par "https://".' });
  }
  const provider = meta(node)['provider'];
  if (provider !== undefined && !['youtube', 'mp4'].includes(provider as string)) {
    issues.push({ severity: 'warning', path: 'meta.provider', message: `"${provider}" invalide. Valeurs : "youtube", "mp4".` });
  }
  return issues;
}

export function validateAudioPlayer(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string' || !node['content']) {
    issues.push({ severity: 'error', path: 'content', message: 'Doit être une URL audio non vide.', hint: '"https://example.com/audio.mp3"' });
  } else if (!node['content'].startsWith('http')) {
    issues.push({ severity: 'warning', path: 'content', message: 'L\'URL devrait commencer par "https://".' });
  }
  return issues;
}

export function validateGallery(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau d'objets { url, caption? }, reçu ${t(node['content'])}.` });
    return issues;
  }
  const items = node['content'] as unknown[];
  if (items.length === 0) {
    issues.push({ severity: 'warning', path: 'content', message: 'La galerie est vide.' });
  }
  items.forEach((item, i) => {
    if (typeof item !== 'object' || item === null) {
      issues.push({ severity: 'error', path: `content[${i}]`, message: 'Chaque item doit être un objet { url, caption? }.' });
    } else {
      const g = item as N;
      if (!g['url'] || typeof g['url'] !== 'string') {
        issues.push({ severity: 'error', path: `content[${i}].url`, message: '"url" est requis et doit être une chaîne.' });
      }
    }
  });
  return issues;
}

export function validateFillBlanks(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne avec des blancs ___réponse___, reçu ${t(node['content'])}.`, hint: '"La capitale est ___Paris___."' });
  } else if (!node['content'].includes('___')) {
    issues.push({ severity: 'warning', path: 'content', message: 'Aucun blanc trouvé. Utilisez la syntaxe ___réponse___ pour marquer les trous.' });
  }
  return issues;
}

export function validateFlashCard(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau de { front, back }, reçu ${t(node['content'])}.`, hint: '[{"front": "Question", "back": "Réponse"}]' });
    return issues;
  }
  const cards = node['content'] as unknown[];
  if (cards.length === 0) {
    issues.push({ severity: 'warning', path: 'content', message: 'Aucune carte définie.' });
  }
  cards.forEach((card, i) => {
    if (typeof card !== 'object' || card === null) {
      issues.push({ severity: 'error', path: `content[${i}]`, message: 'Chaque carte doit être un objet { front, back }.' });
    } else {
      const c = card as N;
      if (!c['front']) issues.push({ severity: 'error', path: `content[${i}].front`, message: '"front" est requis.' });
      if (!c['back']) issues.push({ severity: 'error', path: `content[${i}].back`, message: '"back" est requis.' });
    }
  });
  return issues;
}

export function validateToc(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau de { title, level }, reçu ${t(node['content'])}.`, hint: '[{"title": "Section 1", "level": 1}]' });
    return issues;
  }
  const items = node['content'] as unknown[];
  items.forEach((item, i) => {
    if (typeof item !== 'object' || item === null) {
      issues.push({ severity: 'error', path: `content[${i}]`, message: 'Chaque item doit être un objet { title, level }.' });
    } else {
      const ti = item as N;
      if (!ti['title']) issues.push({ severity: 'error', path: `content[${i}].title`, message: '"title" est requis.' });
      if (ti['level'] !== undefined && ![1, 2, 3].includes(ti['level'] as number)) {
        issues.push({ severity: 'warning', path: `content[${i}].level`, message: `Niveau "${ti['level']}" invalide. Attendu : 1, 2 ou 3.` });
      }
    }
  });
  return issues;
}

export function validateProgress(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const content = node['content'];
  if (content !== undefined) {
    const num = Number(content);
    if (isNaN(num)) {
      issues.push({ severity: 'error', path: 'content', message: `Doit être un nombre entre 0 et 100, reçu "${content}".` });
    } else if (num < 0 || num > 100) {
      issues.push({ severity: 'warning', path: 'content', message: `Valeur ${num} hors de la plage [0, 100].` });
    }
  }
  return issues;
}

export function validateToggleList(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau de { title, body }, reçu ${t(node['content'])}.`, hint: '[{"title": "Question", "body": "Réponse détaillée"}]' });
    return issues;
  }
  const items = node['content'] as unknown[];
  if (items.length === 0) {
    issues.push({ severity: 'warning', path: 'content', message: 'Aucun item défini.' });
  }
  items.forEach((item, i) => {
    if (typeof item !== 'object' || item === null) {
      issues.push({ severity: 'error', path: `content[${i}]`, message: 'Chaque item doit être un objet { title, body }.' });
    } else {
      const ti = item as N;
      if (!ti['title']) issues.push({ severity: 'error', path: `content[${i}].title`, message: '"title" est requis.' });
      if (!ti['body']) issues.push({ severity: 'warning', path: `content[${i}].body`, message: '"body" est recommandé (vide à l\'ouverture sinon).' });
    }
  });
  return issues;
}

export function validateChecklist(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau de { text, checked }, reçu ${t(node['content'])}.`, hint: '[{"text": "Tâche 1", "checked": false}]' });
    return issues;
  }
  const items = node['content'] as unknown[];
  if (items.length === 0) {
    issues.push({ severity: 'warning', path: 'content', message: 'Aucune tâche définie.' });
  }
  items.forEach((item, i) => {
    if (typeof item !== 'object' || item === null) {
      issues.push({ severity: 'error', path: `content[${i}]`, message: 'Chaque item doit être un objet { text, checked }.' });
    } else {
      const ci = item as N;
      if (!ci['text']) issues.push({ severity: 'error', path: `content[${i}].text`, message: '"text" est requis.' });
      if (ci['checked'] !== undefined && typeof ci['checked'] !== 'boolean') {
        issues.push({ severity: 'warning', path: `content[${i}].checked`, message: `"checked" doit être true ou false, reçu ${t(ci['checked'])}.` });
      }
    }
  });
  return issues;
}

export function validateMention(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== undefined && typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (le texte de la mention), reçu ${t(node['content'])}.` });
  }
  const variant = meta(node)['variant'];
  if (variant !== undefined && !['concept', 'chapter', 'person', 'tag'].includes(variant as string)) {
    issues.push({ severity: 'warning', path: 'meta.variant', message: `"${variant}" invalide. Valeurs : concept, chapter, person, tag.` });
  }
  return issues;
}

export function validateWebBookmark(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const content = node['content'];
  if (typeof content !== 'object' || content === null || Array.isArray(content)) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un objet { url, title, ... }, reçu ${t(content)}.`, hint: '{"url": "https://...", "title": "Titre"}' });
    return issues;
  }
  const bm = content as N;
  if (!bm['url'] || typeof bm['url'] !== 'string') {
    issues.push({ severity: 'error', path: 'content.url', message: '"url" est requis et doit être une URL valide.' });
  } else if (!(bm['url'] as string).startsWith('http')) {
    issues.push({ severity: 'warning', path: 'content.url', message: 'L\'URL devrait commencer par "https://".' });
  }
  if (!bm['title'] || typeof bm['title'] !== 'string') {
    issues.push({ severity: 'error', path: 'content.title', message: '"title" est requis.' });
  }
  return issues;
}

export function validateColumnsLayout(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Array.isArray(node['content'])) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un tableau de tableaux de nœuds (SlideNode[][]), reçu ${t(node['content'])}.`, hint: '[[{"id":"c1","type":"text","content":"Col 1"}], [{"id":"c2","type":"math","content":"E=mc^2"}]]' });
    return issues;
  }
  const cols = node['content'] as unknown[];
  if (cols.length < 2) {
    issues.push({ severity: 'warning', path: 'content', message: `${cols.length} colonne(s) seulement. Minimum recommandé : 2.` });
  }
  if (cols.length > 3) {
    issues.push({ severity: 'warning', path: 'content', message: `${cols.length} colonnes. Maximum recommandé : 3 pour la lisibilité.` });
  }
  cols.forEach((col, ci) => {
    if (!Array.isArray(col)) {
      issues.push({ severity: 'error', path: `content[${ci}]`, message: 'Chaque colonne doit être un tableau de nœuds.' });
    } else if ((col as unknown[]).length === 0) {
      issues.push({ severity: 'info', path: `content[${ci}]`, message: `La colonne ${ci + 1} est vide.` });
    } else {
      (col as unknown[]).forEach((childNode, ni) => {
        if (typeof childNode !== 'object' || childNode === null) {
          issues.push({ severity: 'error', path: `content[${ci}][${ni}]`, message: 'Chaque nœud enfant doit être un objet.' });
        } else {
          const cn = childNode as N;
          if (!cn['id']) issues.push({ severity: 'error', path: `content[${ci}][${ni}].id`, message: '"id" est requis.' });
          if (!cn['type']) issues.push({ severity: 'error', path: `content[${ci}][${ni}].type`, message: '"type" est requis.' });
        }
      });
    }
  });
  return issues;
}

export function validateDataBoard(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const content = node['content'];
  if (typeof content !== 'object' || content === null || Array.isArray(content)) {
    issues.push({ severity: 'error', path: 'content', message: `Doit être un objet { columns: [...] }, reçu ${t(content)}.`, hint: '{"columns": [{"title": "À faire", "cards": [{"title": "Tâche"}]}]}' });
    return issues;
  }
  const db = content as N;
  if (!Array.isArray(db['columns'])) {
    issues.push({ severity: 'error', path: 'content.columns', message: '"columns" est requis et doit être un tableau.' });
    return issues;
  }
  const cols = db['columns'] as unknown[];
  if (cols.length === 0) {
    issues.push({ severity: 'warning', path: 'content.columns', message: 'Aucune colonne définie.' });
  }
  cols.forEach((col, ci) => {
    if (typeof col !== 'object' || col === null) {
      issues.push({ severity: 'error', path: `content.columns[${ci}]`, message: 'Chaque colonne doit être un objet { title, cards }.' });
    } else {
      const c = col as N;
      if (!c['title']) issues.push({ severity: 'error', path: `content.columns[${ci}].title`, message: '"title" est requis.' });
      if (!Array.isArray(c['cards'])) {
        issues.push({ severity: 'error', path: `content.columns[${ci}].cards`, message: '"cards" est requis et doit être un tableau.' });
      } else {
        (c['cards'] as unknown[]).forEach((card, ki) => {
          const k = card as N;
          if (!k?.['title']) {
            issues.push({ severity: 'error', path: `content.columns[${ci}].cards[${ki}].title`, message: '"title" est requis.' });
          }
          const prio = k?.['priority'];
          if (prio && !['low', 'medium', 'high'].includes(prio as string)) {
            issues.push({ severity: 'warning', path: `content.columns[${ci}].cards[${ki}].priority`, message: `"${prio}" invalide. Valeurs : low, medium, high.` });
          }
        });
      }
    }
  });
  return issues;
}

export function validateChemicalStructure(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== undefined && typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne SMILES, reçu ${t(node['content'])}.`, hint: '"c1ccccc1" (benzène), "CC(=O)O" (acide acétique)' });
  } else if (!node['content']) {
    issues.push({ severity: 'warning', path: 'content', message: 'Chaîne SMILES vide. Aucune molécule ne sera affichée.' });
  }
  const theme = meta(node)['theme'];
  if (theme !== undefined && !['light', 'dark'].includes(theme as string)) {
    issues.push({ severity: 'warning', path: 'meta.theme', message: `"${theme}" invalide. Valeurs : "light", "dark".` });
  }
  return issues;
}

export function validateFilePdf(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (typeof node['content'] !== 'string' || !node['content']) {
    issues.push({ severity: 'error', path: 'content', message: 'Doit être une URL de fichier PDF non vide.', hint: '"https://example.com/document.pdf"' });
  } else if (!node['content'].startsWith('http')) {
    issues.push({ severity: 'warning', path: 'content', message: 'L\'URL devrait commencer par "https://".' });
  }
  const height = meta(node)['height'];
  if (height !== undefined && (typeof height !== 'number' || (height as number) < 100)) {
    issues.push({ severity: 'warning', path: 'meta.height', message: `Hauteur "${height}" suspecte. Doit être un nombre ≥ 100 (px). Valeur par défaut : 600.` });
  }
  return issues;
}

export function validateSandbox(node: N): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (node['content'] !== undefined && typeof node['content'] !== 'string') {
    issues.push({ severity: 'error', path: 'content', message: `Doit être une chaîne (code HTML/JS), reçu ${t(node['content'])}.` });
  }
  return issues;
}

export const NODE_VALIDATORS: Record<string, NodeValidator> = {
  'text': validateText,
  'heading': validateHeading,
  'code': validateCode,
  'math': validateMath,
  'diagram': validateDiagram,
  'callout': validateCallout,
  'quote': validateQuote,
  'key-concept': validateKeyConcept,
  'footnote': validateFootnote,
  'divider': validateDivider,
  'list': validateList,
  'step-by-step': validateStepByStep,
  'table': validateTable,
  'image-caption': validateImageCaption,
  'video-embed': validateVideoEmbed,
  'audio-player': validateAudioPlayer,
  'gallery': validateGallery,
  'fill-blanks': validateFillBlanks,
  'flash-card': validateFlashCard,
  'toc': validateToc,
  'progress': validateProgress,
  'toggle-list': validateToggleList,
  'checklist': validateChecklist,
  'mention': validateMention,
  'web-bookmark': validateWebBookmark,
  'columns-layout': validateColumnsLayout,
  'data-board': validateDataBoard,
  'chemical-structure': validateChemicalStructure,
  'file-pdf': validateFilePdf,
  'interactive-sandbox': validateSandbox,
};
