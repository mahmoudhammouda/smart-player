import { Component, signal, computed } from '@angular/core';
import { SP_NODE_DICTIONARY } from 'smart-player';

type NodeDef = {
  description: string;
  category: string;
  content: { type: string; description: string; example?: unknown; [k: string]: unknown };
  meta: Record<string, { type: string; description: string; valid_values?: unknown[]; default?: unknown; optional?: boolean }> | null;
  full_example: unknown;
  [k: string]: unknown;
};

type CategoryDef = { label: string; description: string; types: string[] };

const DICT = SP_NODE_DICTIONARY as {
  description: string;
  total_node_types: number;
  categories: Record<string, CategoryDef>;
  node_types: Record<string, NodeDef>;
};

const CATEGORY_ICONS: Record<string, string> = {
  typography_and_layout: 'T',
  callouts_and_highlights: '!',
  scientific_and_technical: '⚗',
  media: '▶',
  interactive_pedagogical: '✎',
  navigation_and_reference: '#',
};

@Component({
  selector: 'app-schema',
  standalone: true,
  template: `
    <div class="schema-page">
      <div class="schema-hero">
        <h1 class="schema-title">Node Dictionary</h1>
        <p class="schema-subtitle">
          Référence complète des {{ totalTypes }} types de nœuds disponibles pour générer
          des slides SmartPlayer. Fournissez ce dictionnaire à votre LLM pour qu'il produise
          du JSON valide.
        </p>
        <div class="schema-actions">
          <button class="action-btn primary" (click)="copyFullDict()" data-testid="button-copy-dict">
            @if (copied()) {
              ✓ Copié dans le presse-papier !
            } @else {
              Copier le dictionnaire JSON complet
            }
          </button>
          <button class="action-btn" (click)="copyPrompt()" data-testid="button-copy-prompt">
            @if (promptCopied()) {
              ✓ Prompt copié !
            } @else {
              Copier le system prompt LLM
            }
          </button>
        </div>
      </div>

      <div class="schema-filters">
        <input
          class="search-input"
          type="text"
          placeholder="Rechercher un type de nœud…"
          [value]="search()"
          (input)="search.set($any($event.target).value)"
          data-testid="input-search-schema"
        />
        <div class="category-tabs">
          <button
            class="cat-tab"
            [class.active]="activeCategory() === ''"
            (click)="activeCategory.set('')"
            data-testid="button-cat-all"
          >Tous ({{ totalTypes }})</button>
          @for (cat of categoryEntries(); track cat.key) {
            <button
              class="cat-tab"
              [class.active]="activeCategory() === cat.key"
              (click)="activeCategory.set(cat.key)"
              [attr.data-testid]="'button-cat-' + cat.key"
            >
              <span class="cat-icon">{{ catIcon(cat.key) }}</span>
              {{ cat.value.label }}
              <span class="cat-count">{{ cat.value.types.length }}</span>
            </button>
          }
        </div>
      </div>

      <div class="schema-grid">
        @for (entry of filteredNodes(); track entry.type) {
          <div class="node-card" [attr.data-testid]="'card-node-' + entry.type">
            <div class="node-card-header">
              <code class="node-type-badge">{{ entry.type }}</code>
              <span class="node-category-pill">{{ categoryLabel(entry.def.category) }}</span>
            </div>
            <p class="node-description">{{ entry.def.description }}</p>

            <div class="node-section">
              <div class="section-label">content</div>
              <div class="content-type">
                <code class="type-pill">{{ entry.def.content?.type ?? 'varies' }}</code>
                <span class="type-desc">{{ entry.def.content?.description }}</span>
              </div>
            </div>

            @if (entry.def.meta) {
              <div class="node-section">
                <div class="section-label">meta fields</div>
                @for (mf of metaEntries(entry.def.meta); track mf.key) {
                  <div class="meta-row">
                    <code class="meta-key">{{ mf.key }}</code>
                    @if (!mf.value.optional) {
                      <span class="meta-required">required</span>
                    }
                    <span class="meta-type">{{ mf.value.type }}</span>
                    @if (mf.value.valid_values) {
                      <span class="meta-values">{{ join(mf.value.valid_values) }}</span>
                    }
                    @if (mf.value.default !== undefined) {
                      <span class="meta-default">default: {{ mf.value.default }}</span>
                    }
                  </div>
                  <div class="meta-desc">{{ mf.value.description }}</div>
                }
              </div>
            }

            <details class="node-example">
              <summary class="example-summary" [attr.data-testid]="'toggle-example-' + entry.type">
                Voir l'exemple JSON
              </summary>
              <div class="example-copy-row">
                <button class="small-copy-btn" (click)="copyNodeExample(entry)" [attr.data-testid]="'button-copy-' + entry.type">
                  Copier
                </button>
              </div>
              <pre class="example-pre"><code>{{ formatJson(entry.def.full_example) }}</code></pre>
            </details>
          </div>
        }

        @if (filteredNodes().length === 0) {
          <div class="no-results" data-testid="text-no-results">
            Aucun type trouvé pour "{{ search() }}"
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .schema-page {
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 24px 80px;
    }

    .schema-hero {
      margin-bottom: 36px;
    }

    .schema-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--foreground, #0f172a);
      margin: 0 0 10px;
      letter-spacing: -0.03em;
    }

    .schema-subtitle {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--muted-fg, #64748b);
      margin: 0 0 20px;
      max-width: 680px;
    }

    .schema-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 7px;
      background: var(--card, #fff);
      color: var(--foreground, #0f172a);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .action-btn:hover { background: var(--muted, #f1f5f9); }

    .action-btn.primary {
      background: var(--foreground, #0f172a);
      color: var(--bg, #fff);
      border-color: transparent;
    }

    .action-btn.primary:hover { opacity: 0.88; }

    .schema-filters {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 28px;
    }

    .search-input {
      width: 100%;
      padding: 9px 14px;
      font-size: 0.875rem;
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 8px;
      background: var(--card, #fff);
      color: var(--foreground, #0f172a);
      outline: none;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: var(--primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
    }

    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .cat-tab {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 11px;
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--muted-fg, #64748b);
      background: var(--card, #fff);
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.12s, color 0.12s, border-color 0.12s;
    }

    .cat-tab:hover { background: var(--muted, #f1f5f9); color: var(--foreground, #0f172a); }

    .cat-tab.active {
      background: var(--foreground, #0f172a);
      color: var(--bg, #fff);
      border-color: transparent;
    }

    .cat-icon { font-size: 0.9em; }

    .cat-count {
      background: rgba(255,255,255,0.25);
      border-radius: 8px;
      padding: 0 5px;
      font-size: 0.68rem;
    }

    .cat-tab:not(.active) .cat-count {
      background: var(--muted, #f1f5f9);
    }

    .schema-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 16px;
    }

    @media (max-width: 500px) {
      .schema-grid { grid-template-columns: 1fr; }
    }

    .node-card {
      background: var(--card, #fff);
      border: 1px solid var(--card-border, #f0f2f5);
      border-radius: 10px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.15s;
    }

    .node-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }

    .node-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .node-type-badge {
      font-size: 0.85rem;
      font-weight: 700;
      font-family: var(--font-mono, ui-monospace, monospace);
      color: var(--foreground, #0f172a);
      background: var(--muted, #f1f5f9);
      padding: 3px 8px;
      border-radius: 5px;
    }

    .node-category-pill {
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--muted-fg, #64748b);
      background: transparent;
      border: 1px solid var(--border, #e2e8f0);
      padding: 2px 7px;
      border-radius: 10px;
      margin-left: auto;
    }

    .node-description {
      font-size: 0.85rem;
      line-height: 1.6;
      color: var(--muted-fg, #64748b);
      margin: 0;
    }

    .node-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .section-label {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted-fg, #64748b);
    }

    .content-type {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;
    }

    .type-pill {
      font-size: 0.76rem;
      font-weight: 600;
      font-family: var(--font-mono, ui-monospace, monospace);
      color: #3b82f6;
      background: rgba(59,130,246,0.08);
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .type-desc {
      font-size: 0.78rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.5;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .meta-key {
      font-size: 0.78rem;
      font-weight: 600;
      font-family: var(--font-mono, ui-monospace, monospace);
      color: #8b5cf6;
      background: rgba(139,92,246,0.08);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .meta-required {
      font-size: 0.65rem;
      font-weight: 700;
      color: #ef4444;
      background: rgba(239,68,68,0.1);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .meta-type {
      font-size: 0.7rem;
      color: #64748b;
      font-family: var(--font-mono, ui-monospace, monospace);
    }

    .meta-values {
      font-size: 0.68rem;
      color: #22c55e;
      background: rgba(34,197,94,0.08);
      padding: 1px 5px;
      border-radius: 3px;
      font-family: var(--font-mono, ui-monospace, monospace);
    }

    .meta-default {
      font-size: 0.68rem;
      color: var(--muted-fg, #94a3b8);
      font-style: italic;
    }

    .meta-desc {
      font-size: 0.75rem;
      color: var(--muted-fg, #64748b);
      padding-left: 4px;
      margin-top: -2px;
    }

    .node-example {
      border-top: 1px solid var(--border, #f0f2f5);
      padding-top: 10px;
    }

    .example-summary {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--muted-fg, #64748b);
      cursor: pointer;
      user-select: none;
      list-style: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .example-summary::before {
      content: '▶';
      font-size: 0.6em;
      transition: transform 0.2s;
    }

    details[open] .example-summary::before {
      transform: rotate(90deg);
    }

    .example-copy-row {
      display: flex;
      justify-content: flex-end;
      margin: 6px 0 4px;
    }

    .small-copy-btn {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 3px 8px;
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 4px;
      background: none;
      color: var(--muted-fg, #64748b);
      cursor: pointer;
    }

    .small-copy-btn:hover { background: var(--muted, #f1f5f9); }

    .example-pre {
      margin: 0;
      padding: 12px 14px;
      background: #0f172a;
      border-radius: 6px;
      overflow-x: auto;
      font-family: 'Fira Code', ui-monospace, monospace;
      font-size: 0.72rem;
      line-height: 1.65;
      color: #e2e8f0;
      white-space: pre;
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 48px 0;
      color: var(--muted-fg, #64748b);
      font-size: 0.9rem;
    }
  `]
})
export class SchemaComponent {
  readonly dict = DICT;
  readonly totalTypes = DICT.total_node_types;

  search = signal('');
  activeCategory = signal('');
  copied = signal(false);
  promptCopied = signal(false);

  categoryEntries = computed(() =>
    Object.entries(DICT.categories).map(([key, value]) => ({ key, value }))
  );

  filteredNodes = computed(() => {
    const q = this.search().toLowerCase().trim();
    const cat = this.activeCategory();

    return Object.entries(DICT.node_types)
      .filter(([type, def]) => {
        const matchesCat = !cat || def.category === cat;
        const matchesSearch = !q || type.includes(q) || def.description.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      })
      .map(([type, def]) => ({ type, def }));
  });

  metaEntries(meta: NodeDef['meta']) {
    if (!meta) return [];
    return Object.entries(meta).map(([key, value]) => ({ key, value }));
  }

  categoryLabel(catKey: string): string {
    return DICT.categories[catKey]?.label ?? catKey;
  }

  catIcon(key: string): string {
    return CATEGORY_ICONS[key] ?? '○';
  }

  join(values: unknown[]): string {
    return values.map(v => JSON.stringify(v)).join(' | ');
  }

  formatJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }

  async copyFullDict(): Promise<void> {
    await navigator.clipboard.writeText(JSON.stringify(DICT, null, 2));
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 3000);
  }

  async copyPrompt(): Promise<void> {
    const { buildLlmSystemPrompt } = await import('smart-player');
    await navigator.clipboard.writeText(buildLlmSystemPrompt({ includeExamples: true }));
    this.promptCopied.set(true);
    setTimeout(() => this.promptCopied.set(false), 3000);
  }

  async copyNodeExample(entry: { type: string; def: NodeDef }): Promise<void> {
    await navigator.clipboard.writeText(JSON.stringify(entry.def.full_example, null, 2));
  }
}
