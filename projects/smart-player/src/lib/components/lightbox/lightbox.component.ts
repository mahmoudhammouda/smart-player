import {
  Component, signal, ChangeDetectionStrategy, HostListener, OnDestroy, ViewEncapsulation
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
  encapsulation: ViewEncapsulation.None,
  template: ``,
  styles: [`
    .sp-lightbox-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.88);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      cursor: zoom-out;
      animation: sp-lb-fade-in 0.2s ease;
    }

    @keyframes sp-lb-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sp-lightbox-close {
      position: fixed;
      top: 16px;
      right: 20px;
      z-index: 10001;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      font-size: 1.8rem;
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
      background: rgba(255, 255, 255, 0.25);
    }

    .sp-lightbox-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      max-width: 94vw;
      max-height: 90vh;
      cursor: default;
    }

    .sp-lightbox-body img {
      max-width: 94vw;
      max-height: 84vh;
      object-fit: contain;
      border-radius: 6px;
      display: block;
    }

    .sp-lightbox-diagram {
      max-width: 94vw;
      max-height: 84vh;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 10px;
      padding: 32px;
    }

    .sp-lightbox-diagram svg {
      width: auto !important;
      height: auto !important;
      max-width: 88vw;
      max-height: 78vh;
      display: block;
    }

    .sp-lightbox-caption {
      color: rgba(255, 255, 255, 0.78);
      font-size: 0.88rem;
      text-align: center;
      max-width: 600px;
      line-height: 1.5;
      font-family: system-ui, sans-serif;
    }
  `]
})
export class LightboxComponent implements OnDestroy {
  visible = signal(false);

  private overlayEl: HTMLElement | null = null;

  open(data: LightboxContent): void {
    this.close();

    const overlay = document.createElement('div');
    overlay.className = 'sp-lightbox-overlay';
    overlay.addEventListener('click', () => this.close());

    const closeBtn = document.createElement('button');
    closeBtn.className = 'sp-lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.close(); });
    overlay.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'sp-lightbox-body';
    body.addEventListener('click', (e) => e.stopPropagation());

    if (data.type === 'image' && data.src) {
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.alt ?? '';
      body.appendChild(img);
    } else if (data.type === 'html' && data.htmlElement) {
      const container = document.createElement('div');
      container.className = 'sp-lightbox-diagram';
      const clone = data.htmlElement.cloneNode(true) as Element;
      if (clone instanceof SVGElement) {
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        clone.removeAttribute('style');
      }
      const innerSvgs = clone.querySelectorAll('svg');
      innerSvgs.forEach(svg => {
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.removeAttribute('style');
      });
      container.appendChild(clone);
      body.appendChild(container);
    }

    if (data.caption) {
      const cap = document.createElement('div');
      cap.className = 'sp-lightbox-caption';
      cap.textContent = data.caption;
      body.appendChild(cap);
    }

    overlay.appendChild(body);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    this.overlayEl = overlay;
    this.visible.set(true);
  }

  close(): void {
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
      document.body.style.overflow = '';
      this.visible.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) {
      this.close();
    }
  }

  ngOnDestroy(): void {
    this.close();
  }
}
