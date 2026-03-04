import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-footnote-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="sp-footnote">{{ node().content }}</div>`,
  styles: [`
    :host { display: block; }

    .sp-footnote {
      font-size: 0.8rem;
      color: var(--sp-muted-fg, #64748b);
      border-left: 3px solid var(--sp-primary, #3b82f6);
      padding-left: 12px;
      font-style: italic;
      line-height: 1.6;
    }
  `]
})
export class FootnoteNodeComponent {
  node = input.required<SlideNode>();
}
