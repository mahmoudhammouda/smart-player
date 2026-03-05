import {
  Component, input, computed, ChangeDetectionStrategy
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateImageCaption } from '../../validation/node-validators';

@Component({
  selector: 'sp-image-caption-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="sp-image-caption" data-testid="image-caption-figure">
      <img
        class="sp-image"
        [src]="node().content"
        [alt]="altText()"
        data-testid="image-caption-img"
      />
      @if (caption()) {
        <figcaption class="sp-caption" data-testid="image-caption-text">{{ caption() }}</figcaption>
      }
    </figure>
  `,
  styles: [`
    :host { display: block; }

    .sp-image-caption {
      margin: 0;
      text-align: center;
    }

    .sp-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      display: inline-block;
    }

    .sp-caption {
      margin-top: 8px;
      font-size: 0.85rem;
      font-style: italic;
      color: var(--sp-muted-fg, #64748b);
      line-height: 1.4;
    }
  `]
})
export class ImageCaptionNodeComponent {
  node = input.required<SlideNode>();

  altText = computed<string>(() => {
    const meta = this.node().meta;
    return (meta?.['alt'] as string) ?? '';
  });

  caption = computed<string>(() => {
    const meta = this.node().meta;
    return (meta?.['caption'] as string) ?? '';
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateImageCaption(node);
  }
}
