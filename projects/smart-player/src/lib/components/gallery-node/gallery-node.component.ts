import {
  Component, input, computed, ChangeDetectionStrategy
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateGallery } from '../../validation/node-validators';

interface GalleryItem {
  url: string;
  caption?: string;
}

@Component({
  selector: 'sp-gallery-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-gallery-grid" data-testid="gallery-grid">
      @for (item of items(); track item.url) {
        <figure class="sp-gallery-item" data-testid="gallery-item">
          <img
            class="sp-gallery-image"
            [src]="item.url"
            [alt]="item.caption ?? ''"
            data-testid="gallery-image"
          />
          @if (item.caption) {
            <figcaption class="sp-gallery-caption" data-testid="gallery-caption">{{ item.caption }}</figcaption>
          }
        </figure>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .sp-gallery-item {
      margin: 0;
    }

    .sp-gallery-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
    }

    .sp-gallery-caption {
      margin-top: 4px;
      font-size: 0.75rem;
      color: var(--sp-muted-fg, #64748b);
      line-height: 1.3;
    }
  `]
})
export class GalleryNodeComponent {
  node = input.required<SlideNode>();

  items = computed<GalleryItem[]>(() => {
    const content = this.node().content;
    if (Array.isArray(content)) return content;
    return [];
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateGallery(node);
  }
}
