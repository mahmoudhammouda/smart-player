import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

interface BookmarkContent {
  url: string;
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

@Component({
  selector: 'sp-web-bookmark-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a 
      [href]="bookmark().url" 
      target="_blank" 
      rel="noopener" 
      class="bookmark-card"
      data-testid="link-bookmark"
    >
      <div class="content">
        <div class="title" data-testid="text-bookmark-title">{{ bookmark().title }}</div>
        @if (bookmark().description) {
          <div class="description">{{ bookmark().description }}</div>
        }
        <div class="footer">
          @if (bookmark().favicon) {
            <img [src]="bookmark().favicon" class="favicon" alt="">
          }
          <span class="domain">{{ domain() }}</span>
        </div>
      </div>
      @if (bookmark().image) {
        <div class="thumbnail">
          <img [src]="bookmark().image" [alt]="bookmark().title">
        </div>
      }
    </a>
  `,
  styles: [`
    :host { display: block; }
    .bookmark-card {
      display: flex;
      border: 1px solid var(--sp-border, #e2e8f0);
      border-radius: 8px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.2s;
      background: var(--sp-bg, #ffffff);
    }
    .bookmark-card:hover {
      border-color: var(--sp-primary, #3b82f6);
    }
    .content {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .title {
      font-weight: 600;
      font-size: 0.95rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--sp-foreground, #1e293b);
    }
    .description {
      font-size: 0.85rem;
      color: var(--sp-muted-fg, #64748b);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.4;
    }
    .footer {
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
    }
    .favicon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    .domain {
      font-size: 0.75rem;
      color: var(--sp-muted-fg, #64748b);
    }
    .thumbnail {
      width: 120px;
      flex-shrink: 0;
      border-left: 1px solid var(--sp-border, #e2e8f0);
    }
    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    @media (max-width: 480px) {
      .thumbnail {
        width: 80px;
      }
    }
  `]
})
export class WebBookmarkNodeComponent {
  node = input.required<SlideNode>();

  bookmark = computed<BookmarkContent>(() => this.node().content as BookmarkContent);
  
  domain = computed(() => {
    try {
      return new URL(this.bookmark().url).hostname;
    } catch {
      return this.bookmark().url;
    }
  });
}
