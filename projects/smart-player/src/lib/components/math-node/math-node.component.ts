import {
  Component, input, ElementRef, viewChild,
  effect, ChangeDetectionStrategy, Injector, inject, afterNextRender
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-math-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="sp-math-wrapper"><div #mathContainer class="sp-math-display"></div></div>`,
  styles: [`
    :host { display: block; }

    .sp-math-wrapper {
      display: flex;
      justify-content: center;
      padding: 8px 0;
    }

    .sp-math-display {
      overflow-x: auto;
      max-width: 100%;
    }

    :host ::ng-deep .katex-display {
      margin: 0 !important;
      overflow-x: auto;
      overflow-y: hidden;
    }

    :host ::ng-deep .katex {
      font-size: 1.15em;
    }
  `]
})
export class MathNodeComponent {
  node = input.required<SlideNode>();
  container = viewChild.required<ElementRef>('mathContainer');
  private injector = inject(Injector);

  constructor() {
    afterNextRender(() => {
      effect(() => {
        const content = this.node().content;
        const el = this.container().nativeElement;
        this.renderMath(el, content);
      }, { injector: this.injector });
    });
  }

  private async renderMath(el: HTMLElement, content: string): Promise<void> {
    if (!el) return;
    try {
      const katex = await import('katex');
      katex.default.render(content, el, {
        displayMode: true,
        throwOnError: false,
        strict: false,
        trust: true,
        macros: {
          '\\R': '\\mathbb{R}',
          '\\N': '\\mathbb{N}',
          '\\Z': '\\mathbb{Z}',
        },
      });
    } catch {
      el.textContent = content;
    }
  }
}
