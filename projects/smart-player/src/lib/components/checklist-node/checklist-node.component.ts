import { Component, input, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

interface ChecklistItem {
  text: string;
  checked: boolean;
}

@Component({
  selector: 'sp-checklist-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="checklist">
      @for (item of items(); track $index) {
        <div class="checklist-item" [class.checked]="item.checked">
          <div 
            class="checkbox" 
            [class.checked]="item.checked"
            (click)="toggleItem($index)"
            data-testid="button-checkbox"
          >
            @if (item.checked) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            }
          </div>
          <span class="text" (click)="toggleItem($index)">{{ item.text }}</span>
        </div>
      }
      <div class="checklist-stats" data-testid="text-completion-stats">
        {{ completedCount() }} / {{ items().length }} completed
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .checklist {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .checkbox {
      width: 18px;
      height: 18px;
      border: 2px solid var(--sp-border, #e2e8f0);
      border-radius: 4px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      background: var(--sp-bg, #ffffff);
    }
    .checkbox.checked {
      background: var(--sp-primary, #3b82f6);
      border-color: var(--sp-primary, #3b82f6);
    }
    .checkbox svg {
      width: 12px;
      height: 12px;
      color: white;
    }
    .text {
      font-size: 1rem;
      color: var(--sp-foreground, #1e293b);
      transition: all 0.2s;
    }
    .checked .text {
      text-decoration: line-through;
      color: var(--sp-muted-fg, #64748b);
    }
    .checklist-stats {
      margin-top: 4px;
      font-size: 0.8rem;
      color: var(--sp-muted-fg, #64748b);
    }
  `]
})
export class ChecklistNodeComponent {
  node = input.required<SlideNode>();
  items = signal<ChecklistItem[]>([]);

  completedCount = computed(() => this.items().filter(i => i.checked).length);

  constructor() {
    effect(() => {
      const content = this.node().content;
      if (Array.isArray(content)) {
        this.items.set(content.map(i => ({ ...i })));
      }
    }, { allowSignalWrites: true });
  }

  toggleItem(index: number) {
    this.items.update(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], checked: !newItems[index].checked };
      return newItems;
    });
  }
}
