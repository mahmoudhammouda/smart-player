import {
  Component, input, output, signal, computed, inject,
  ChangeDetectionStrategy, Type, OnInit, Optional, Inject
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { Slide, SlideNode, NodeType, RefineEvent, CustomNodeDefinition } from '../../models/slide.model';
import { RegistryService, SP_CUSTOM_NODES } from '../../services/registry.service';
import { TextNodeComponent } from '../text-node/text-node.component';
import { MathNodeComponent } from '../math-node/math-node.component';
import { CodeNodeComponent } from '../code-node/code-node.component';
import { DiagramNodeComponent } from '../diagram-node/diagram-node.component';
import { SandboxNodeComponent } from '../sandbox-node/sandbox-node.component';

const NODE_TYPE_LABELS: Record<string, string> = {
  'text': 'Text',
  'math': 'Formula',
  'code': 'Code',
  'diagram': 'Diagram',
  'interactive-sandbox': 'Interactive',
};

@Component({
  selector: 'sp-smart-player',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="sp-doc">

      <header class="sp-doc-header">
        <h1 class="sp-doc-title">{{ slide().title }}</h1>
        @if (slide().description) {
          <p class="sp-doc-description">{{ slide().description }}</p>
        }
        @if (slide().tags && slide().tags!.length > 0) {
          <div class="sp-doc-tags">
            @for (tag of slide().tags; track tag) {
              <span class="sp-doc-tag">{{ tag }}</span>
            }
          </div>
        }
      </header>

      <div class="sp-doc-body">
        @for (node of slide().nodes; track node.id; let i = $index) {
          <section
            class="sp-node"
            [class.sp-node-text]="node.type === 'text'"
            [class.sp-node-embed]="node.type !== 'text'"
            [style.--sp-node-delay]="(i * 60) + 'ms'"
          >
            @if (node.label && node.type === 'text') {
              <h2 class="sp-section-heading">{{ node.label }}</h2>
            }
            @if (node.label && node.type !== 'text') {
              <div class="sp-embed-label">
                <span class="sp-embed-type">{{ getLabel(node.type) }}</span>
                <span class="sp-embed-separator">·</span>
                <span class="sp-embed-name">{{ node.label }}</span>
              </div>
            }

            <div class="sp-node-content">
              <ng-container *ngComponentOutlet="getComponent(node.type); inputs: { node: node }" />
            </div>

            @if (enableRefine()) {
              <div class="sp-ghost-actions">
                <button
                  class="sp-ghost-btn"
                  [class.sp-ghost-btn-active]="refiningId() === node.id"
                  [disabled]="refiningId() === node.id"
                  (click)="refineNode(node)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.sp-spin]="refiningId() === node.id"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>
                  {{ refiningId() === node.id ? 'Refining...' : 'Refine' }}
                </button>
              </div>
            }
          </section>
        }
      </div>

    </article>
  `,
  styles: [`
    :host {
      display: block;
      --sp-primary: #3b82f6;
      --sp-foreground: #1e293b;
      --sp-muted-fg: #64748b;
      --sp-muted: #f1f5f9;
      --sp-border: #e2e8f0;
      --sp-bg: #ffffff;
      --sp-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    }

    :host-context(.dark), :host-context([data-theme="dark"]) {
      --sp-primary: #60a5fa;
      --sp-foreground: #f1f5f9;
      --sp-muted-fg: #94a3b8;
      --sp-muted: #1e293b;
      --sp-border: #334155;
      --sp-bg: #0f172a;
    }

    /* ── Document container ── */
    .sp-doc {
      max-width: 760px;
      margin: 0 auto;
      padding: 48px 0;
    }

    /* ── Header ── */
    .sp-doc-header {
      margin-bottom: 40px;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--sp-border);
      animation: sp-fade-in 0.4s ease both;
    }

    .sp-doc-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.035em;
      color: var(--sp-foreground);
      line-height: 1.2;
      margin: 0 0 10px;
    }

    .sp-doc-description {
      font-size: 1.05rem;
      color: var(--sp-muted-fg);
      line-height: 1.7;
      margin: 0;
    }

    .sp-doc-tags {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 14px;
    }

    .sp-doc-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 10px;
      border-radius: 999px;
      background: var(--sp-muted);
      color: var(--sp-muted-fg);
    }

    /* ── Document body ── */
    .sp-doc-body {
      display: flex;
      flex-direction: column;
    }

    /* ── Node base ── */
    .sp-node {
      position: relative;
      animation: sp-slide-in 0.4s ease both;
      animation-delay: var(--sp-node-delay, 0ms);
    }

    /* ── Text nodes: flow like paragraphs ── */
    .sp-node-text {
      margin-bottom: 8px;
    }

    .sp-section-heading {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--sp-foreground);
      margin: 32px 0 12px;
      line-height: 1.35;
    }

    .sp-node-text:first-child .sp-section-heading {
      margin-top: 0;
    }

    /* ── Embed nodes: code, math, diagrams, sandbox ── */
    .sp-node-embed {
      margin: 24px 0;
    }

    .sp-embed-label {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
    }

    .sp-embed-type {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--sp-primary);
    }

    .sp-embed-separator {
      color: var(--sp-border);
      font-size: 0.8rem;
    }

    .sp-embed-name {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--sp-muted-fg);
    }

    .sp-node-content {
      position: relative;
    }

    /* ── Ghost UI for actions ── */
    .sp-ghost-actions {
      position: absolute;
      top: 4px;
      right: -4px;
      transform: translateX(100%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .sp-node:hover .sp-ghost-actions,
    .sp-ghost-actions:focus-within {
      opacity: 1;
      pointer-events: auto;
    }

    .sp-ghost-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 4px 10px;
      color: var(--sp-muted-fg);
      background: var(--sp-bg);
      border: 1px solid var(--sp-border);
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      font-family: inherit;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    .sp-ghost-btn:hover:not(:disabled) {
      color: var(--sp-primary);
      border-color: var(--sp-primary);
      background: color-mix(in srgb, var(--sp-primary) 6%, var(--sp-bg));
    }

    .sp-ghost-btn-active {
      opacity: 1 !important;
      pointer-events: auto !important;
      color: var(--sp-primary);
    }

    .sp-ghost-btn:disabled {
      cursor: not-allowed;
    }

    /* ── Mobile: ghost actions inline ── */
    @media (max-width: 900px) {
      .sp-ghost-actions {
        position: relative;
        top: auto;
        right: auto;
        transform: none;
        opacity: 0;
        margin-top: 6px;
        display: flex;
        justify-content: flex-end;
      }
      .sp-node:hover .sp-ghost-actions,
      .sp-ghost-actions:focus-within {
        opacity: 1;
      }
    }

    /* ── Animations ── */
    @keyframes sp-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes sp-slide-in {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes sp-spin {
      from { transform: rotate(0); }
      to { transform: rotate(360deg); }
    }

    .sp-spin {
      animation: sp-spin 1s linear infinite;
    }
  `]
})
export class SmartPlayerComponent implements OnInit {
  slide = input.required<Slide>();
  enableRefine = input<boolean>(true);
  refine = output<RefineEvent>();

  refiningId = signal<string | null>(null);

  private registry = inject(RegistryService);
  private customNodes: CustomNodeDefinition[] = inject(SP_CUSTOM_NODES, { optional: true }) ?? [];

  ngOnInit(): void {
    this.registerDefaults();
    this.registerCustomNodes();
  }

  private registerDefaults(): void {
    if (!this.registry.has('text')) this.registry.register('text', TextNodeComponent, 'Text');
    if (!this.registry.has('math')) this.registry.register('math', MathNodeComponent, 'Formula');
    if (!this.registry.has('code')) this.registry.register('code', CodeNodeComponent, 'Code');
    if (!this.registry.has('diagram')) this.registry.register('diagram', DiagramNodeComponent, 'Diagram');
    if (!this.registry.has('interactive-sandbox')) this.registry.register('interactive-sandbox', SandboxNodeComponent, 'Interactive');
  }

  private registerCustomNodes(): void {
    for (const def of this.customNodes) {
      if (!this.registry.has(def.type)) {
        this.registry.register(def.type, def.component, def.label);
      }
    }
  }

  getComponent(type: NodeType): Type<unknown> | null {
    return this.registry.get(type) ?? null;
  }

  getLabel(type: NodeType): string {
    return NODE_TYPE_LABELS[type] || this.registry.getLabel(type) || type;
  }

  async refineNode(node: SlideNode): Promise<void> {
    this.refiningId.set(node.id);
    this.refine.emit({ nodeId: node.id, node });
    await new Promise(r => setTimeout(r, 1200));
    this.refiningId.set(null);
  }
}
