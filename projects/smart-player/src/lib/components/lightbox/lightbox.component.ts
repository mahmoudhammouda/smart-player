import {
  Component, signal, ChangeDetectionStrategy, HostListener
} from '@angular/core';

export interface LightboxContent {
  type: 'image' | 'html';
  src?: string;
  alt?: string;
  caption?: string;
  htmlElement?: Element;
}

@Component({
  selector: 'sp-lightbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="sp-lightbox-overlay" (click)="close()" data-testid="lightbox-overlay">
        <button class="sp-lightbox-close" (click)="close()" data-testid="button-lightbox-close">&times;</button>
        <div class="sp-lightbox-content" (click)="$event.stopPropagation()">
          @if (content()?.type === 'image') {
            <img
              class="sp-lightbox-image"
              [src]="content()!.src"
              [alt]="content()!.alt ?? ''"
              data-testid="lightbox-image"
            />
          } @else {
            <div class="sp-lightbox-html" #htmlHost></div>
          }
          @if (content()?.caption) {
            <div class="sp-lightbox-caption" data-testid="lightbox-caption">{{ content()!.caption }}</div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .sp-lightbox-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      cursor: zoom-out;
      animation: sp-lightbox-fade-in 0.2s ease;
    }

    @keyframes sp-lightbox-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sp-lightbox-close {
      position: fixed;
      top: 16px;
      right: 20px;
      z-index: 10001;
      background: none;
      border: none;
      color: #fff;
      font-size: 2rem;
      cursor: pointer;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.15s;
      line-height: 1;
    }

    .sp-lightbox-close:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .sp-lightbox-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      max-width: 95vw;
      max-height: 92vh;
      cursor: default;
    }

    .sp-lightbox-image {
      max-width: 95vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 6px;
    }

    .sp-lightbox-html {
      max-width: 95vw;
      max-height: 85vh;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 8px;
      padding: 24px;
    }

    .sp-lightbox-html svg {
      max-width: 90vw;
      max-height: 80vh;
      width: auto;
      height: auto;
    }

    .sp-lightbox-caption {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      text-align: center;
      max-width: 600px;
      line-height: 1.5;
    }
  `]
})
export class LightboxComponent {
  visible = signal(false);
  content = signal<LightboxContent | null>(null);

  private htmlHost: HTMLElement | null = null;

  open(data: LightboxContent): void {
    this.content.set(data);
    this.visible.set(true);
    document.body.style.overflow = 'hidden';

    if (data.type === 'html' && data.htmlElement) {
      requestAnimationFrame(() => {
        const host = document.querySelector('.sp-lightbox-html');
        if (host) {
          host.innerHTML = '';
          const clone = data.htmlElement!.cloneNode(true) as Element;
          if (clone instanceof SVGElement) {
            clone.removeAttribute('width');
            clone.removeAttribute('height');
            clone.setAttribute('style', 'max-width:90vw;max-height:80vh;width:auto;height:auto;');
          } else if (clone instanceof HTMLElement) {
            clone.style.maxWidth = '90vw';
            clone.style.maxHeight = '80vh';
          }
          const svgs = clone.querySelectorAll('svg');
          svgs.forEach(svg => {
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            svg.setAttribute('style', 'max-width:90vw;max-height:80vh;width:auto;height:auto;');
          });
          host.appendChild(clone);
        }
      });
    }
  }

  close(): void {
    this.visible.set(false);
    this.content.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) {
      this.close();
    }
  }
}
