import {
  Component, input, signal, ElementRef, viewChild,
  effect, ChangeDetectionStrategy, Injector, inject, afterNextRender
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-chemical-structure-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-chemical-block">
      @if (error()) {
        <div class="sp-chemical-error">
          <span class="sp-chemical-error-label">SMILES Error</span>
          <pre class="sp-chemical-error-text">{{ error() }}</pre>
        </div>
      } @else {
        <div class="sp-chemical-container">
          <canvas #canvas data-testid="canvas-chemical-structure"></canvas>
          @if (node().meta?.['name']) {
            <div class="sp-chemical-name" data-testid="text-chemical-name">
              {{ node().meta?.['name'] }}
            </div>
          }
        </div>
      }
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

    canvas {
      max-width: 100%;
      height: auto;
    }

    .sp-chemical-name {
      font-size: 0.875rem;
      color: var(--sp-muted-fg, #64748b);
      text-align: center;
    }

    .sp-chemical-error {
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.15);
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .sp-chemical-error-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #ef4444;
    }

    .sp-chemical-error-text {
      font-size: 0.75rem;
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
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private injector = inject(Injector);

  constructor() {
    afterNextRender(() => {
      effect(() => {
        const smiles = this.node().content;
        const theme = (this.node().meta?.['theme'] as 'light' | 'dark') || 'light';
        const canvasEl = this.canvas().nativeElement;
        if (smiles) {
          this.renderStructure(smiles, canvasEl, theme);
        }
      }, { injector: this.injector });
    });
  }

  private async renderStructure(smiles: string, canvasEl: HTMLCanvasElement, theme: 'light' | 'dark'): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const SmilesDrawer = (await import('smiles-drawer')).default;
      const options = {
        width: 300,
        height: 200,
        bondThickness: 1.5,
        bondLength: 20,
        fontSizeLarge: 10,
        fontSizeSmall: 7,
      };
      
      const drawer = new SmilesDrawer.SmiDrawer(options);
      
      SmilesDrawer.parse(smiles, (tree: any) => {
        drawer.draw(tree, canvasEl, theme, false);
        this.error.set(null);
      }, (err: any) => {
        this.error.set(String(err));
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Chemical structure render error';
      this.error.set(msg);
    }
  }
}
