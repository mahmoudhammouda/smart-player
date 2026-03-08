import {
  Component, input, computed, viewChild, ChangeDetectionStrategy
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateImageCaption } from '../../validation/node-validators';
import { LightboxComponent } from '../lightbox/lightbox.component';

@Component({
  selector: 'sp-image-caption-node',
  standalone: true,
  imports: [LightboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="sp-image-caption" data-testid="image-caption-figure">
      <div class="sp-image-wrapper" (click)="openLightbox()" data-testid="image-zoom-trigger">
        <div class="sp-image-zoom-hint">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
        </div>
        <img
          class="sp-image"
          [src]="node().content"
          [alt]="altText()"
          data-testid="image-caption-img"
        />
      </div>
      @if (caption()) {
        <figcaption class="sp-caption" data-testid="image-caption-text">{{ caption() }}</figcaption>
      }
    </figure>
    <sp-lightbox #lightbox />
  `,
  styles: [`
    :host { display: block; }

    .sp-image-caption {
      margin: 0;
      text-align: center;
    }

    .sp-image-wrapper {
      position: relative;
      display: inline-block;
      cursor: zoom-in;
    }

    .sp-image-zoom-hint {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 2;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .sp-image-wrapper:hover .sp-image-zoom-hint {
      opacity: 1;
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
  lightbox = viewChild<LightboxComponent>('lightbox');

  altText = computed<string>(() => {
    const meta = this.node().meta;
    return (meta?.['alt'] as string) ?? '';
  });

  caption = computed<string>(() => {
    const meta = this.node().meta;
    return (meta?.['caption'] as string) ?? '';
  });

  openLightbox(): void {
    this.lightbox()?.open({
      type: 'image',
      src: this.node().content,
      alt: this.altText(),
      caption: this.caption(),
    });
  }

  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateImageCaption(node);
  }
}
