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
    <div class="sp-player">
      <div class="sp-player-header">
        <div class="sp-player-title-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sp-icon-book"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          <h1 class="sp-player-title">{{ slide().title }}</h1>
        </div>
        @if (slide().description) {
          <p class="sp-player-description">{{ slide().description }}</p>
        }
        @if (slide().tags && slide().tags!.length > 0) {
          <div class="sp-player-tags">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sp-tag-icon"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>
            @for (tag of slide().tags; track tag) {
              <span class="sp-tag">{{ tag }}</span>
            }
          </div>
        }
      </div>

      <div class="sp-player-nodes">
        @for (node of slide().nodes; track node.id; let i = $index) {
          <div class="sp-node-block" [style.animation-delay]="(i * 80) + 'ms'">
            <div class="sp-node-header">
              <div class="sp-node-meta">
                <span [class]="'sp-type-badge sp-badge-' + node.type">{{ getLabel(node.type) }}</span>
                @if (node.label) {
                  <span class="sp-node-label">{{ node.label }}</span>
                }
              </div>
              @if (enableRefine()) {
                <button
                  class="sp-refine-btn"
                  [disabled]="refiningId() === node.id"
                  (click)="refineNode(node)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.sp-spin]="refiningId() === node.id"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8 19 13"></path><path d="M15 9h.01"></path><path d="M17.8 6.2 19 5"></path><path d="m3 21 9-9"></path><path d="M12.2 6.2 11 5"></path></svg>
                  <span>{{ refiningId() === node.id ? 'Refining...' : 'Refine' }}</span>
                </button>
              }
            </div>
            <div class="sp-node-body">
              <ng-container *ngComponentOutlet="getComponent(node.type); inputs: { node: node }" />
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      --sp-primary: #3b82f6;
      --sp-foreground: #1e293b;
      --sp-muted-fg: #64748b;
      --sp-muted: #f1f5f9;
      --sp-border: #e2e8f0;
      --sp-card: #f8fafc;
      --sp-card-border: #f0f2f5;
      --sp-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    }

    :host-context(.dark), :host-context([data-theme="dark"]) {
      --sp-primary: #60a5fa;
      --sp-foreground: #f8fafc;
      --sp-muted-fg: #94a3b8;
      --sp-muted: #1e293b;
      --sp-border: #1e293b;
      --sp-card: #0f172a;
      --sp-card-border: #1e293b;
    }

    @keyframes sp-node-enter {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sp-player {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 860px;
      margin: 0 auto;
    }

    .sp-player-header {
      padding: 24px 28px;
      border-radius: 14px;
      background: var(--sp-card);
      border: 1px solid var(--sp-card-border);
      display: flex;
      flex-direction: column;
      gap: 10px;
      animation: sp-node-enter 0.3s ease both;
    }

    .sp-player-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sp-icon-book {
      color: var(--sp-primary);
      flex-shrink: 0;
    }

    .sp-player-title {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: var(--sp-foreground);
      line-height: 1.2;
      margin: 0;
    }

    .sp-player-description {
      font-size: 0.875rem;
      color: var(--sp-muted-fg);
      line-height: 1.6;
      margin: 0;
    }

    .sp-player-tags {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .sp-tag-icon {
      color: var(--sp-muted-fg);
      flex-shrink: 0;
    }

    .sp-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--sp-muted);
      color: var(--sp-muted-fg);
      border: 1px solid var(--sp-border);
    }

    .sp-player-nodes {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .sp-node-block {
      border-radius: 12px;
      background: var(--sp-card);
      border: 1px solid var(--sp-card-border);
      overflow: hidden;
      animation: sp-node-enter 0.35s ease both;
      transition: border-color 0.15s ease;
    }

    .sp-node-block:hover {
      border-color: color-mix(in srgb, var(--sp-primary) 30%, transparent);
    }

    .sp-node-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--sp-border);
      background: color-mix(in srgb, var(--sp-muted) 50%, transparent);
    }

    .sp-node-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      min-width: 0;
    }

    .sp-type-badge {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 999px;
      flex-shrink: 0;
    }

    .sp-badge-text            { background: #e2e8f0; color: #334155; }
    .sp-badge-math            { background: #ede9fe; color: #6d28d9; }
    .sp-badge-code            { background: #d1fae5; color: #065f46; }
    .sp-badge-diagram         { background: #fed7aa; color: #9a3412; }
    .sp-badge-interactive-sandbox { background: #fce7f3; color: #9d174d; }

    :host-context(.dark) .sp-badge-text,
    :host-context([data-theme="dark"]) .sp-badge-text            { background: #1e293b; color: #94a3b8; }
    :host-context(.dark) .sp-badge-math,
    :host-context([data-theme="dark"]) .sp-badge-math            { background: #2e1065; color: #a78bfa; }
    :host-context(.dark) .sp-badge-code,
    :host-context([data-theme="dark"]) .sp-badge-code            { background: #064e3b; color: #6ee7b7; }
    :host-context(.dark) .sp-badge-diagram,
    :host-context([data-theme="dark"]) .sp-badge-diagram         { background: #431407; color: #fdba74; }
    :host-context(.dark) .sp-badge-interactive-sandbox,
    :host-context([data-theme="dark"]) .sp-badge-interactive-sandbox { background: #500724; color: #f9a8d4; }

    .sp-node-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--sp-foreground);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 280px;
    }

    .sp-refine-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.75rem;
      height: 28px;
      padding: 0 10px;
      color: var(--sp-muted-fg);
      background: transparent;
      border: 1px solid var(--sp-border);
      border-radius: 6px;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s;
      font-family: inherit;
    }

    .sp-refine-btn:hover:not(:disabled) {
      background: var(--sp-muted);
      border-color: var(--sp-muted-fg);
    }

    .sp-refine-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @keyframes sp-spin {
      from { transform: rotate(0); }
      to { transform: rotate(360deg); }
    }

    .sp-spin {
      animation: sp-spin 1s linear infinite;
    }

    .sp-node-body {
      padding: 18px 20px;
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
