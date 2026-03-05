import {
  Component, input, signal, ElementRef, viewChild,
  ChangeDetectionStrategy, afterNextRender
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateChemicalStructure } from '../../validation/node-validators';

@Component({
  selector: 'sp-chemical-structure-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-chemical-block">
      @if (error()) {
        <div class="sp-chemical-error">
          <span class="sp-chemical-error-label">⚠ Render error</span>
          <pre class="sp-chemical-error-text">{{ error() }}</pre>
        </div>
      }
      <div class="sp-chemical-container" [class.hidden]="!!error()">
        <canvas #canvas data-testid="canvas-chemical-structure"></canvas>
        @if (node().meta?.['name']) {
          <div class="sp-chemical-name" data-testid="text-chemical-name">
            {{ node().meta?.['name'] }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-chemical-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--sp-muted, #f1f5f9) 50%, transparent);
      border: 1px solid var(--sp-border, #e2e8f0);
    }

    .sp-chemical-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .sp-chemical-container.hidden {
      display: none;
    }

    canvas {
      max-width: 100%;
      height: auto;
    }

    .sp-chemical-name {
      font-size: 0.875rem;
      color: var(--sp-muted-fg, #64748b);
      text-align: center;
      font-style: italic;
    }

    .sp-chemical-error {
      padding: 10px 14px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      margin-bottom: 8px;
    }

    .sp-chemical-error-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #ef4444;
    }

    .sp-chemical-error-text {
      font-size: 0.72rem;
      color: #94a3b8;
      white-space: pre-wrap;
      font-family: var(--sp-font-mono, monospace);
      margin: 0;
    }
  `]
})
export class ChemicalStructureNodeComponent {
  node = input.required<SlideNode>();
  error = signal<string | null>(null);
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    afterNextRender(() => {
      this.render();
    });
  }

  private async render(): Promise<void> {
    const smiles = String(this.node().content || '');
    const theme = (this.node().meta?.['theme'] as 'light' | 'dark') || 'light';
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl || !smiles) return;

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const SD = await import('smiles-drawer');
      const SmilesDrawer = SD.default ?? SD;

      const options = { width: 300, height: 220 };

      if (SmilesDrawer.SmiDrawer) {
        const drawer = new SmilesDrawer.SmiDrawer(options);
        SmilesDrawer.parse(
          smiles,
          (tree: unknown) => { drawer.draw(tree, canvasEl, theme, false); this.error.set(null); },
          (err: unknown) => { this.error.set(String(err)); }
        );
      } else if (typeof SmilesDrawer === 'function') {
        const drawer = new SmilesDrawer(options);
        drawer.draw(smiles, canvasEl);
        this.error.set(null);
      } else {
        this.error.set('SmilesDrawer API not recognised.');
      }
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'Render failed');
    }
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateChemicalStructure(node);
  }
}
