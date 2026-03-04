import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-key-concept-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="key-concept">
      @if (term()) {
        <div class="term">{{ term() }}</div>
      }
      <div class="definition">{{ node().content }}</div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .key-concept {
      background: var(--sp-muted, #f1f5f9);
      border: 1px solid var(--sp-border, #e2e8f0);
      border-radius: 8px;
      padding: 12px;
    }

    .term {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--sp-primary, #3b82f6);
      margin-bottom: 6px;
    }

    .definition {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--sp-foreground, #1e293b);
    }
  `]
})
export class KeyConceptNodeComponent {
  node = input.required<SlideNode>();

  term = computed(() => (this.node().meta?.['term'] as string) || '');
}
