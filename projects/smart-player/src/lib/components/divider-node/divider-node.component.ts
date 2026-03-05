import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateDivider } from '../../validation/node-validators';

@Component({
  selector: 'sp-divider-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-divider">
      @switch (dividerStyle()) {
        @case ('dots') {
          <span class="sp-divider-symbol">&middot; &middot; &middot;</span>
        }
        @case ('stars') {
          <span class="sp-divider-symbol">&#10022; &#10022; &#10022;</span>
        }
        @default {
          <hr class="sp-divider-line" />
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-divider {
      margin: 48px 0;
      text-align: center;
    }

    .sp-divider-line {
      border: none;
      border-top: 1px solid var(--sp-border, #e2e8f0);
      margin: 0;
    }

    .sp-divider-symbol {
      color: var(--sp-muted-fg, #64748b);
      font-size: 1.2rem;
      letter-spacing: 0.5em;
    }
  `]
})
export class DividerNodeComponent {
  node = input.required<SlideNode>();

  dividerStyle = computed(() => {
    const style = this.node().meta?.['style'];
    return typeof style === 'string' ? style : 'line';
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateDivider(node);
  }
}
