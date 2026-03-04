import {
  Component, input, computed, ChangeDetectionStrategy, inject, signal
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-file-pdf-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-pdf-block">
      @if (node().meta?.['title']) {
        <div class="sp-pdf-header" data-testid="text-pdf-title">
          {{ node().meta?.['title'] }}
        </div>
      }
      <div class="sp-pdf-container" [style.height.px]="height()">
        @if (loading()) {
          <div class="sp-pdf-loading" data-testid="status-pdf-loading">
            Loading PDF...
          </div>
        }
        <iframe
          class="sp-pdf-iframe"
          [src]="safeSrc()"
          [title]="node().meta?.['title'] || 'PDF Viewer'"
          (load)="onLoad()"
          data-testid="iframe-pdf-viewer"
        ></iframe>
      </div>
      <div class="sp-pdf-footer">
        <a [href]="node().content" target="_blank" rel="noopener" class="sp-pdf-link" data-testid="link-pdf-external">
          Open PDF in new tab
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-pdf-block {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--sp-border, #e2e8f0);
      background: var(--sp-bg, #ffffff);
    }

    .sp-pdf-header {
      padding: 12px 16px;
      font-weight: 600;
      border-bottom: 1px solid var(--sp-border, #e2e8f0);
      color: var(--sp-foreground, #0f172a);
    }

    .sp-pdf-container {
      position: relative;
      width: 100%;
      background: #f1f5f9;
    }

    .sp-pdf-loading {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--sp-bg, #ffffff);
      color: var(--sp-muted-fg, #64748b);
      z-index: 10;
    }

    .sp-pdf-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    .sp-pdf-footer {
      padding: 8px 16px;
      border-top: 1px solid var(--sp-border, #e2e8f0);
      background: color-mix(in srgb, var(--sp-muted, #f1f5f9) 30%, transparent);
    }

    .sp-pdf-link {
      font-size: 0.875rem;
      color: var(--sp-primary, #3b82f6);
      text-decoration: none;
      font-weight: 500;
    }

    .sp-pdf-link:hover {
      text-decoration: underline;
    }
  `]
})
export class FilePdfNodeComponent {
  node = input.required<SlideNode>();
  loading = signal(true);
  private sanitizer = inject(DomSanitizer);

  height = computed(() => Number(this.node().meta?.['height']) || 600);

  safeSrc = computed<SafeResourceUrl>(() => {
    const url = this.node().content;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  onLoad() {
    this.loading.set(false);
  }
}
