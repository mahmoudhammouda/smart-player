import {
  Component, input, signal, ElementRef, viewChild,
  effect, ChangeDetectionStrategy, Injector, inject, afterNextRender
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-code-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-code-block">
      <div class="sp-code-bar">
        <div class="sp-code-dots">
          <span class="dot dot-r"></span>
          <span class="dot dot-y"></span>
          <span class="dot dot-g"></span>
        </div>
        <span class="sp-code-lang">{{ node().language || 'text' }}</span>
        <button class="sp-code-copy" (click)="copyCode()" [attr.title]="copied() ? 'Copied!' : 'Copy code'">
          @if (copied()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          }
        </button>
      </div>
      <div class="sp-code-scroll">
        <pre class="sp-code-pre"><code #codeBlock [class]="'language-' + (node().language || 'plaintext')">{{ node().content }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-code-block {
      border-radius: 10px;
      overflow: hidden;
      background: #1a1b26;
    }

    .sp-code-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: #13141c;
      border-bottom: 1px solid #232436;
    }

    .sp-code-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .dot-r { background: #ff5f57; }
    .dot-y { background: #febc2e; }
    .dot-g { background: #28c840; }

    .sp-code-lang {
      flex: 1;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #6b7294;
      text-align: center;
    }

    .sp-code-copy {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: #6b7294;
      cursor: pointer;
      transition: background 0.15s;
    }

    .sp-code-copy:hover {
      background: rgba(255,255,255,0.06);
    }

    .sp-code-scroll {
      overflow-x: auto;
    }

    .sp-code-pre {
      margin: 0;
      padding: 16px 18px;
      font-family: var(--sp-font-mono, 'JetBrains Mono', monospace);
      font-size: 0.82rem;
      line-height: 1.65;
      background: transparent;
      color: #eeffff;
    }

    .sp-code-pre code {
      font-family: inherit;
      background: none !important;
      padding: 0 !important;
    }

    :host ::ng-deep .hljs-keyword  { color: #c792ea; }
    :host ::ng-deep .hljs-built_in { color: #82aaff; }
    :host ::ng-deep .hljs-type     { color: #ffcb6b; }
    :host ::ng-deep .hljs-literal  { color: #ff5370; }
    :host ::ng-deep .hljs-number   { color: #f78c6c; }
    :host ::ng-deep .hljs-string   { color: #c3e88d; }
    :host ::ng-deep .hljs-comment  { color: #546e7a; font-style: italic; }
    :host ::ng-deep .hljs-function { color: #82aaff; }
    :host ::ng-deep .hljs-title    { color: #82aaff; }
    :host ::ng-deep .hljs-params   { color: #eeffff; }
    :host ::ng-deep .hljs-variable { color: #f07178; }
    :host ::ng-deep .hljs-attr     { color: #ffcb6b; }
    :host ::ng-deep .hljs-property { color: #f07178; }
    :host ::ng-deep .hljs-punctuation { color: #89ddff; }
    :host ::ng-deep .hljs-operator { color: #89ddff; }
    :host ::ng-deep .hljs           { color: #eeffff; }
  `]
})
export class CodeNodeComponent {
  node = input.required<SlideNode>();
  copied = signal(false);
  codeBlock = viewChild.required<ElementRef>('codeBlock');
  private injector = inject(Injector);

  constructor() {
    afterNextRender(() => {
      effect(() => {
        const content = this.node().content;
        const lang = this.node().language || 'plaintext';
        const el = this.codeBlock().nativeElement;
        this.highlight(el, content, lang);
      }, { injector: this.injector });
    });
  }

  private async highlight(el: HTMLElement, content: string, lang: string): Promise<void> {
    if (!el) return;
    try {
      const hljs = await import('highlight.js');
      const result = hljs.default.highlight(content, {
        language: lang,
        ignoreIllegals: true
      });
      el.innerHTML = result.value;
    } catch {
      el.textContent = content;
    }
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.node().content);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {}
  }
}
