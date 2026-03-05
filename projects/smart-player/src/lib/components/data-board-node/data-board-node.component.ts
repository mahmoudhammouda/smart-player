import {
  Component, input, computed, ChangeDetectionStrategy
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';

interface Card {
  title: string;
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}

interface Column {
  title: string;
  color?: string;
  cards: Card[];
}

interface DataBoardContent {
  columns: Column[];
}

@Component({
  selector: 'sp-data-board-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-data-board">
      <div class="sp-board-container">
        @for (col of boardContent().columns; track col.title) {
          <div class="sp-board-column">
            <div class="sp-column-header">
              <span class="sp-column-dot" [style.background-color]="col.color || 'var(--sp-muted)'"></span>
              <h3 class="sp-column-title">{{ col.title }}</h3>
              <span class="sp-column-count">{{ col.cards.length }}</span>
            </div>
            <div class="sp-column-cards">
              @for (card of col.cards; track card.title) {
                <div class="sp-card">
                  <div class="sp-card-header">
                    <h4 class="sp-card-title">{{ card.title }}</h4>
                    @if (card.priority) {
                      <span class="sp-priority-badge" [class]="'priority-' + card.priority"></span>
                    }
                  </div>
                  @if (card.description) {
                    <p class="sp-card-desc">{{ card.description }}</p>
                  }
                  @if (card.tags && card.tags.length > 0) {
                    <div class="sp-card-tags">
                      @for (tag of card.tags; track tag) {
                        <span class="sp-tag">{{ tag }}</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-data-board {
      width: 100%;
      overflow-x: auto;
      padding: 16px 0;
      scrollbar-width: thin;
    }

    .sp-board-container {
      display: flex;
      gap: 20px;
      padding: 0 4px;
      min-width: max-content;
    }

    .sp-board-column {
      width: 260px;
      min-width: 260px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sp-column-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 4px 12px;
      border-bottom: 2px solid var(--sp-muted);
    }

    .sp-column-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .sp-column-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--sp-foreground);
      margin: 0;
      flex: 1;
    }

    .sp-column-count {
      font-size: 0.75rem;
      color: var(--sp-muted-fg);
      background: var(--sp-muted);
      padding: 2px 6px;
      border-radius: 10px;
    }

    .sp-column-cards {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sp-card {
      background: var(--sp-bg, white);
      border: 1px solid var(--sp-border);
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    :host-context(.dark) .sp-card {
      background: #1e293b;
    }

    .sp-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }

    .sp-card-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--sp-foreground);
      margin: 0;
      line-height: 1.4;
    }

    .sp-priority-badge {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .priority-low { background-color: #22c55e; }
    .priority-medium { background-color: #f59e0b; }
    .priority-high { background-color: #ef4444; }

    .sp-card-desc {
      font-size: 0.8125rem;
      color: var(--sp-muted-fg);
      margin: 0;
      line-height: 1.5;
    }

    .sp-card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .sp-tag {
      font-size: 0.6875rem;
      background: var(--sp-muted);
      color: var(--sp-muted-fg);
      padding: 2px 6px;
      border-radius: 4px;
    }
  `]
})
export class DataBoardNodeComponent {
  node = input.required<SlideNode>();

  boardContent = computed<DataBoardContent>(() => {
    const c = this.node().content;
    return (c && typeof c === 'object' && Array.isArray(c.columns)) ? c : { columns: [] };
  });
}
