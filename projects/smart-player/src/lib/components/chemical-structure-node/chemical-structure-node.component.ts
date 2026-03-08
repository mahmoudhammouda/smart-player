import {
  Component, input, signal, ElementRef, viewChild,
  ChangeDetectionStrategy, afterNextRender
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateChemicalStructure } from '../../validation/node-validators';
import { LightboxComponent } from '../lightbox/lightbox.component';

@Component({
  selector: 'sp-chemical-structure-node',
  standalone: true,
  imports: [LightboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-chemical-block">
      @if (error()) {
        <div class="sp-chemical-error">
          <span class="sp-chemical-error-label">\u26A0 Render error</span>
          <pre class="sp-chemical-error-text">{{ error() }}</pre>
        </div>
      }
      <div class="sp-chemical-container" [class.hidden]="!!error()">
        <div class="sp-chemical-wrapper" (click)="openLightbox()" data-testid="chemical-zoom-trigger">
          <div class="sp-chemical-zoom-hint">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
          </div>
          <div #svgContainer class="sp-svg-host" data-testid="canvas-chemical-structure"></div>
        </div>
        @if (node().meta?.['name']) {
          <div class="sp-chemical-name" data-testid="text-chemical-name">
            {{ node().meta?.['name'] }}
          </div>
        }
      </div>
    </div>
    <sp-lightbox #lightbox />
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

    .sp-chemical-wrapper {
      position: relative;
      cursor: zoom-in;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .sp-chemical-zoom-hint {
      position: absolute;
      top: 4px;
      right: 4px;
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

    .sp-chemical-wrapper:hover .sp-chemical-zoom-hint {
      opacity: 1;
    }

    .sp-svg-host {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .sp-svg-host svg {
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
  svgContainer = viewChild<ElementRef<HTMLDivElement>>('svgContainer');
  lightbox = viewChild<LightboxComponent>('lightbox');

  constructor() {
    afterNextRender(() => {
      this.render();
    });
  }

  openLightbox(): void {
    const container = this.svgContainer()?.nativeElement;
    const svg = container?.querySelector('svg');
    if (svg) {
      this.lightbox()?.open({
        type: 'html',
        htmlElement: svg,
        caption: (this.node().meta?.['name'] as string) ?? undefined,
      });
    }
  }

  private async render(): Promise<void> {
    const smiles = String(this.node().content || '');
    const theme = (this.node().meta?.['theme'] as 'light' | 'dark') || 'light';
    const container = this.svgContainer()?.nativeElement;
    if (!container || !smiles) return;

    try {
      // @ts-ignore
      const SD = await import('smiles-drawer');
      const SmilesDrawer = SD.default ?? SD;
      const options = { width: 300, height: 220 };

      if (SmilesDrawer.SmiDrawer) {
        const drawer = new SmilesDrawer.SmiDrawer(options);
        drawer.draw(
          smiles,
          'svg',
          theme,
          (svgEl: SVGElement) => {
            this.error.set(null);
            container.innerHTML = '';
            container.appendChild(svgEl);
          },
          (err: unknown) => { this.error.set(String(err)); }
        );
      } else if (SmilesDrawer.Drawer) {
        const drawer = new SmilesDrawer.Drawer(options);
        SmilesDrawer.parse(
          smiles,
          (tree: unknown) => {
            const svg = drawer.draw(tree, null, theme, false);
            if (svg instanceof SVGElement) {
              this.error.set(null);
              container.innerHTML = '';
              container.appendChild(svg);
            }
          },
          (err: unknown) => { this.error.set(String(err)); }
        );
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
