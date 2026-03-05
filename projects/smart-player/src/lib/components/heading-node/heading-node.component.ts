import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateHeading } from '../../validation/node-validators';

@Component({
  selector: 'sp-heading-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (level()) {
      @case (1) { <h1 class="sp-heading sp-heading-1">{{ node().content }}</h1> }
      @case (3) { <h3 class="sp-heading sp-heading-3">{{ node().content }}</h3> }
      @default { <h2 class="sp-heading sp-heading-2">{{ node().content }}</h2> }
    }
  `,
  styles: [`
    :host { display: block; }

    .sp-heading {
      color: var(--sp-foreground, #1e293b);
      letter-spacing: -0.02em;
      margin: 0;
    }

    .sp-heading-1 {
      font-size: 2rem;
      font-weight: 800;
    }

    .sp-heading-2 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .sp-heading-3 {
      font-size: 1.2rem;
      font-weight: 600;
    }
  `]
})
export class HeadingNodeComponent {
  node = input.required<SlideNode>();

  level = computed(() => {
    const meta = this.node().meta;
    const l = meta?.['level'];
    return typeof l === 'number' ? l : 2;
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateHeading(node);
  }
}
