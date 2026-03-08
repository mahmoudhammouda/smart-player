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
    .sp-lb-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      cursor: zoom-out;
      animation: sp-lb-fadein 0.18s ease;
    }

    @keyframes sp-lb-fadein {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sp-lb-close {
      position: fixed;
      top: 12px;
      right: 16px;
      z-index: 10001;
      background: rgba(255, 255, 255, 0.12);
      border: none;
      color: #fff;
      font-size: 1.6rem;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.15s;
      line-height: 1;
    }

    .sp-lb-close:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .sp-lb-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      cursor: default;
      max-width: 94vw;
      max-height: 90vh;
    }

    .sp-lb-body > img {
      max-width: 92vw;
      max-height: 85vh;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 6px;
      display: block;
    }

    .sp-lb-svg-wrap {
      background: #fff;
      border-radius: 10px;
      padding: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
      max-width: 92vw;
      max-height: 85vh;
    }

    .sp-lb-caption {
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
    overlay.className = 'sp-lb-overlay';
    overlay.addEventListener('click', () => this.close());

    const closeBtn = document.createElement('button');
    closeBtn.className = 'sp-lb-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.close(); });
    overlay.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'sp-lb-body';
    body.addEventListener('click', (e) => e.stopPropagation());

    if (data.type === 'image' && data.src) {
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.alt ?? '';
      body.appendChild(img);
    } else if (data.type === 'html' && data.htmlElement) {
      const wrap = document.createElement('div');
      wrap.className = 'sp-lb-svg-wrap';

      const original = data.htmlElement;
      const clone = original.cloneNode(true) as Element;

      if (clone instanceof SVGElement) {
        this.scaleSvg(clone, original as SVGElement);
      }
      clone.querySelectorAll('svg').forEach(innerSvg => {
        this.scaleSvg(innerSvg, innerSvg);
      });

      wrap.appendChild(clone);
      body.appendChild(wrap);
    }

    if (data.caption) {
      const cap = document.createElement('div');
      cap.className = 'sp-lb-caption';
      cap.textContent = data.caption;
      body.appendChild(cap);
    }

    overlay.appendChild(body);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    this.overlayEl = overlay;
    this.visible.set(true);
  }

  private scaleSvg(clone: SVGElement, original: SVGElement): void {
    const bbox = original.getBoundingClientRect();
    const origW = bbox.width || parseFloat(original.getAttribute('width') || '0');
    const origH = bbox.height || parseFloat(original.getAttribute('height') || '0');

    let vb = clone.getAttribute('viewBox');
    if (!vb && origW > 0 && origH > 0) {
      clone.setAttribute('viewBox', `0 0 ${origW} ${origH}`);
    }

    const maxW = window.innerWidth * 0.85;
    const maxH = window.innerHeight * 0.78;

    let finalW = origW || 600;
    let finalH = origH || 400;

    if (finalW > maxW || finalH > maxH) {
      const ratio = Math.min(maxW / finalW, maxH / finalH);
      finalW = finalW * ratio;
      finalH = finalH * ratio;
    } else {
      const scaleUp = Math.min(maxW / finalW, maxH / finalH, 2.5);
      finalW = finalW * scaleUp;
      finalH = finalH * scaleUp;
    }

    clone.setAttribute('width', String(Math.round(finalW)));
    clone.setAttribute('height', String(Math.round(finalH)));
    clone.removeAttribute('style');
    clone.style.display = 'block';
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
