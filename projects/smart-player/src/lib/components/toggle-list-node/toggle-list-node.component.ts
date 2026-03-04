import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

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
        <div class="toggle-item" [class.open]="openItems().has($index)">
          <div 
            class="toggle-header" 
            (click)="toggleItem($index)"
            data-testid="button-toggle-item"
          >
            <span class="chevron">{{ openItems().has($index) ? '▼' : '▶' }}</span>
            <span class="title">{{ item.title }}</span>
          </div>
          <div class="toggle-body-wrapper">
            <div class="toggle-body">
              {{ item.body }}
            </div>
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
      gap: 8px;
      padding: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
      font-weight: 500;
    }
    .toggle-header:hover {
      background-color: var(--sp-muted, #f1f5f9);
    }
    .chevron {
      font-size: 0.8em;
      width: 1.2em;
      display: inline-flex;
      justify-content: center;
      color: var(--sp-muted-fg, #64748b);
    }
    .toggle-body-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.3s ease-out;
      overflow: hidden;
    }
    .open > .toggle-body-wrapper {
      grid-template-rows: 1fr;
    }
    .toggle-body {
      min-height: 0;
      padding: 12px 0 12px 32px;
      color: var(--sp-foreground, #1e293b);
      line-height: 1.6;
    }
  `]
})
export class ToggleListNodeComponent {
  node = input.required<SlideNode>();
  openItems = signal<Set<number>>(new Set());

  items = signal<ToggleItem[]>([]);

  constructor() {
    const content = this.node().content;
    if (Array.isArray(content)) {
      this.items.set(content);
    }
  }

  toggleItem(index: number) {
    const newSet = new Set(this.openItems());
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    this.openItems.set(newSet);
  }
}
