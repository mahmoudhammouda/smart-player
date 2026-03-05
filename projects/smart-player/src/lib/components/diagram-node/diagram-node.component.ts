import {
  Component, input, signal, ElementRef, viewChild,
  effect, ChangeDetectionStrategy, Injector, inject, afterNextRender
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateDiagram } from '../../validation/node-validators';

let mermaidInitialized = false;

@Component({
  selector: 'sp-diagram-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-diagram-block">
      @if (error()) {
        <div class="sp-diagram-error">
          <span class="sp-diagram-error-label">Diagram Error</span>
          <pre class="sp-diagram-error-text">{{ error() }}</pre>
        </div>
      } @else {
        <div #diagramContainer class="sp-diagram-render"></div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-diagram-block {
      display: flex;
      justify-content: center;
      padding: 16px 0;
      border-radius: 8px;
      background: color-mix(in srgb, var(--sp-muted, #f1f5f9) 50%, transparent);
    }

    .sp-diagram-render {
      max-width: 100%;
      overflow-x: auto;
    }

    :host ::ng-deep .sp-diagram-render svg {
      max-width: 100%;
      height: auto;
    }

    .sp-diagram-error {
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.15);
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .sp-diagram-error-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #ef4444;
    }

    .sp-diagram-error-text {
      font-size: 0.75rem;
      color: #94a3b8;
      white-space: pre-wrap;
      font-family: var(--sp-font-mono, monospace);
      margin: 0;
    }
  `]
})
export class DiagramNodeComponent {
  node = input.required<SlideNode>();
  error = signal<string | null>(null);
  container = viewChild<ElementRef>('diagramContainer');
  private injector = inject(Injector);

  constructor() {
    afterNextRender(() => {
      effect(() => {
        const content = this.node().content;
        const nodeId = this.node().id;
        const containerEl = this.container();
        if (containerEl) {
          this.renderDiagram(containerEl.nativeElement, content, nodeId);
        }
      }, { injector: this.injector });
    });
  }

  private async renderDiagram(el: HTMLElement, content: string, nodeId: string): Promise<void> {
    const id = `mermaid-${nodeId}-${Date.now()}`;
    el.innerHTML = '';

    try {
      const mod = await import('mermaid');
      const mermaid = mod.default;

      if (!mermaidInitialized) {
        const isDark = document.documentElement.classList.contains('dark') ||
                       document.documentElement.getAttribute('data-theme') === 'dark';
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'strict',
          themeVariables: { fontFamily: 'system-ui, sans-serif', fontSize: '13px' },
          flowchart: { curve: 'basis', htmlLabels: true },
        });
        mermaidInitialized = true;
      }

      const { svg } = await mermaid.render(id, content);
      el.innerHTML = svg;
      const svgEl = el.querySelector('svg');
      if (svgEl) {
        svgEl.style.maxWidth = '100%';
        svgEl.style.height = 'auto';
      }
      this.error.set(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Diagram render error';
      this.error.set(msg);
      const errEl = document.getElementById(id);
      if (errEl) errEl.remove();
    }
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateDiagram(node);
  }
}
