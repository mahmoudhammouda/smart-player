import {
  Component, input, signal, computed, viewChild, ChangeDetectionStrategy
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateGallery } from '../../validation/node-validators';
import { LightboxComponent } from '../lightbox/lightbox.component';

interface GalleryItem {
  url: string;
  caption?: string;
}

@Component({
  selector: 'sp-gallery-node',
  standalone: true,
  imports: [LightboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-gallery-grid" data-testid="gallery-grid">
      @for (item of items(); track item.url) {
        <figure class="sp-gallery-item" data-testid="gallery-item">
          <div class="sp-gallery-image-wrapper" (click)="openLightbox(item)">
            <div class="sp-gallery-zoom-hint">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
            </div>
            <img
              class="sp-gallery-image"
              [src]="item.url"
              [alt]="item.caption ?? ''"
              data-testid="gallery-image"
            />
          </div>
          @if (item.caption) {
            <figcaption class="sp-gallery-caption" data-testid="gallery-caption">{{ item.caption }}</figcaption>
          }
        </figure>
      }
    </div>
    <sp-lightbox #lightbox />
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

    .sp-gallery-image-wrapper {
      position: relative;
      cursor: zoom-in;
      overflow: hidden;
      border-radius: 8px;
    }

    .sp-gallery-zoom-hint {
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 2;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .sp-gallery-image-wrapper:hover .sp-gallery-zoom-hint {
      opacity: 1;
    }

    .sp-gallery-image {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.2s;
    }

    .sp-gallery-image-wrapper:hover .sp-gallery-image {
      transform: scale(1.03);
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
  lightbox = viewChild<LightboxComponent>('lightbox');

  items = computed<GalleryItem[]>(() => {
    const content = this.node().content;
    if (Array.isArray(content)) return content;
    return [];
  });

  openLightbox(item: GalleryItem): void {
    this.lightbox()?.open({
      type: 'image',
      src: item.url,
      alt: item.caption ?? '',
      caption: item.caption,
    });
  }

  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateGallery(node);
  }
}
