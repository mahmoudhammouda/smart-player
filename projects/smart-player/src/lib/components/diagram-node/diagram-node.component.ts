import {
  Component, input, signal, ElementRef, viewChild,
  effect, ChangeDetectionStrategy, Injector, inject, afterNextRender
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateDiagram } from '../../validation/node-validators';
import { LightboxComponent } from '../lightbox/lightbox.component';

let mermaidInitialized = false;

@Component({
  selector: 'sp-diagram-node',
  standalone: true,
  imports: [LightboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-diagram-block">
      @if (error()) {
        <div class="sp-diagram-error">
          <span class="sp-diagram-error-label">Diagram Error</span>
          <pre class="sp-diagram-error-text">{{ error() }}</pre>
        </div>
      } @else {
        <div class="sp-diagram-wrapper" (click)="openLightbox()" data-testid="diagram-zoom-trigger">
          <div class="sp-diagram-zoom-hint">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
          </div>
          <div #diagramContainer class="sp-diagram-render"></div>
        </div>
      }
    </div>
    <sp-lightbox #lightbox />
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

    .sp-diagram-wrapper {
      cursor: zoom-in;
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .sp-diagram-zoom-hint {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 2;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.06);
      color: var(--sp-muted-fg, #94a3b8);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .sp-diagram-wrapper:hover .sp-diagram-zoom-hint {
      opacity: 1;
    }

    .sp-diagram-render {
      width: 100%;
      overflow-x: auto;
    }

    :host ::ng-deep .sp-diagram-render svg {
      display: block;
      margin: 0 auto;
      min-width: 300px;
      max-width: 100%;
      height: auto;
      min-height: 120px;
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
  lightbox = viewChild<LightboxComponent>('lightbox');
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

  openLightbox(): void {
    const containerEl = this.container()?.nativeElement;
    const svg = containerEl?.querySelector('svg');
    if (svg) {
      this.lightbox()?.open({
        type: 'html',
        htmlElement: svg,
        caption: this.node().label,
      });
    }
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
          themeVariables: { fontFamily: 'system-ui, sans-serif', fontSize: '14px' },
          flowchart: { curve: 'basis', htmlLabels: true },
          sequence: { mirrorActors: false, messageMargin: 40 },
        });
        mermaidInitialized = true;
      }

      const { svg } = await mermaid.render(id, content);
      el.innerHTML = svg;
      const svgEl = el.querySelector('svg');
      if (svgEl) {
        svgEl.removeAttribute('height');
        svgEl.style.maxWidth = '100%';
        svgEl.style.minWidth = '300px';
        svgEl.style.height = 'auto';
        svgEl.style.minHeight = '120px';
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
