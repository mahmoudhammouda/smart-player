import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateList } from '../../validation/node-validators';

interface ListItem {
  text: string;
  children?: ListItem[];
}

@Component({
  selector: 'sp-list-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ordered()) {
      <ol class="sp-list" [innerHTML]="renderedItems()"></ol>
    } @else {
      <ul class="sp-list" [innerHTML]="renderedItems()"></ul>
    }
  `,
  styles: [`
    :host { display: block; }

    :host ::ng-deep .sp-list {
      padding-left: 22px;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--sp-foreground, #1e293b);
    }

    :host ::ng-deep .sp-list li {
      line-height: 1.7;
      font-size: 1rem;
    }

    :host ::ng-deep .sp-list ul,
    :host ::ng-deep .sp-list ol {
      padding-left: 22px;
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  `]
})
export class ListNodeComponent {
  node = input.required<SlideNode>();

  ordered = computed(() => !!this.node().meta?.['ordered']);

  renderedItems = computed(() => {
    const content = this.node().content;
    const items: (string | ListItem)[] = Array.isArray(content) ? content : [];
    return this.renderItems(items, this.ordered());
  });

  private renderItems(items: (string | ListItem)[], ordered: boolean): string {
    return items.map(item => {
      if (typeof item === 'string') {
        return `<li>${item}</li>`;
      }
      const children = item.children && item.children.length > 0
        ? (ordered
          ? `<ol>${this.renderItems(item.children, ordered)}</ol>`
          : `<ul>${this.renderItems(item.children, ordered)}</ul>`)
        : '';
      return `<li>${item.text}${children}</li>`;
    }).join('');
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateList(node);
  }
}
