import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateToc } from '../../validation/node-validators';

interface TocItem {
  title: string;
  level: number;
}

@Component({
  selector: 'sp-toc-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toc-wrap">
      @for (item of items(); track $index) {
        <div
          class="toc-item"
          [style.padding-left.px]="(item.level - 1) * 20"
          [attr.data-testid]="'text-toc-item-' + $index"
        >
          <span class="toc-dot"></span>
          <span class="toc-title">{{ item.title }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .toc-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px 0;
    }

    .toc-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: var(--sp-muted-fg, #64748b);
      line-height: 1.5;
    }

    .toc-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--sp-muted-fg, #64748b);
      flex-shrink: 0;
    }

    .toc-title {
      cursor: default;
    }
  `]
})
export class TocNodeComponent {
  node = input.required<SlideNode>();

  items = computed<TocItem[]>(() => {
    const content = this.node().content;
    return Array.isArray(content) ? content : [];
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateToc(node);
  }
}
