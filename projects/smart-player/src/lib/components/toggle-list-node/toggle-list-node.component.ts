import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateToggleList } from '../../validation/node-validators';

interface ToggleItem {
  title: string;
  body: string;
}

@Component({
  selector: 'sp-toggle-list-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toggle-list">
      @for (item of items(); track $index) {
        <div class="toggle-item" [class.open]="isOpen($index)">
          <button
            class="toggle-header"
            (click)="toggleItem($index)"
            [attr.aria-expanded]="openSet().has($index)"
            data-testid="button-toggle-item"
          >
            <span class="chevron" aria-hidden="true">{{ openSet().has($index) ? '▼' : '▶' }}</span>
            <span class="title">{{ item.title }}</span>
          </button>
          <div class="toggle-body-wrapper" [class.open]="openSet().has($index)">
            <div class="toggle-body">{{ item.body }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .toggle-list {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--sp-border, #e2e8f0);
      border-radius: 8px;
      overflow: hidden;
    }
    .toggle-item {
      border-bottom: 1px solid var(--sp-border, #e2e8f0);
    }
    .toggle-item:last-child {
      border-bottom: none;
    }
    .toggle-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      cursor: pointer;
      font-weight: 500;
      font-size: 1rem;
      color: var(--sp-foreground, #1e293b);
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
      transition: background 0.15s;
    }
    .toggle-header:hover {
      background: var(--sp-muted, #f1f5f9);
    }
    .chevron {
      font-size: 0.72em;
      width: 1.1em;
      flex-shrink: 0;
      color: var(--sp-muted-fg, #64748b);
      transition: transform 0.2s;
    }
    .toggle-body-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .toggle-body-wrapper.open {
      max-height: 600px;
    }
    .toggle-body {
      padding: 12px 14px 14px 38px;
      color: var(--sp-foreground, #1e293b);
      line-height: 1.65;
      font-size: 0.95rem;
    }
  `]
})
export class ToggleListNodeComponent {
  node = input.required<SlideNode>();

  items = computed<ToggleItem[]>(() => {
    const content = this.node().content;
    return Array.isArray(content) ? content : [];
  });

  openSet = signal<Set<number>>(new Set());

  isOpen(index: number): boolean {
    return this.openSet().has(index);
  }

  toggleItem(index: number) {
    const next = new Set(this.openSet());
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    this.openSet.set(next);
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateToggleList(node);
  }
}
