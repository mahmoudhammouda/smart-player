import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-quote-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <blockquote class="quote-text">{{ node().content }}</blockquote>
    @if (author() || source()) {
      <div class="quote-attribution">
        @if (author()) {
          <span class="quote-author">{{ author() }}</span>
        }
        @if (source()) {
          <span class="quote-source">{{ source() }}</span>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .quote-text {
      border-left: 4px solid var(--sp-primary, #3b82f6);
      margin: 0;
      padding: 12px 20px;
      font-style: italic;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--sp-foreground, #1e293b);
    }

    .quote-attribution {
      text-align: right;
      margin-top: 8px;
      padding-right: 4px;
    }

    .quote-author {
      font-variant: small-caps;
      font-size: 0.9rem;
      color: var(--sp-foreground, #1e293b);
    }

    .quote-source {
      font-size: 0.85rem;
      color: var(--sp-muted-fg, #64748b);
      margin-left: 6px;
    }

    .quote-source::before {
      content: '\u2014 ';
    }
  `]
})
export class QuoteNodeComponent {
  node = input.required<SlideNode>();

  author = computed(() => (this.node().meta?.['author'] as string) || '');
  source = computed(() => (this.node().meta?.['source'] as string) || '');
}
