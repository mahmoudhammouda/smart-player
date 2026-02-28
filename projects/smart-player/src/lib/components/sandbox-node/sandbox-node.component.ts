import {
  Component, input, computed, ChangeDetectionStrategy, inject
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-sandbox-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-sandbox-wrapper">
      <div class="sp-sandbox-indicator">
        <span class="sp-sandbox-badge" data-testid="sandbox-badge">Interactive Sandbox</span>
      </div>
      <iframe
        class="sp-sandbox-frame"
        [title]="'sandbox-' + node().id"
        [srcdoc]="trustedHtml()"
        sandbox="allow-scripts"
        data-testid="sandbox-iframe"
      ></iframe>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-sandbox-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .sp-sandbox-indicator {
      display: flex;
      align-items: center;
    }

    .sp-sandbox-badge {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #db2777;
      background: rgba(219, 39, 119, 0.1);
      border: 1px solid rgba(219, 39, 119, 0.2);
      padding: 2px 8px;
      border-radius: 999px;
    }

    .sp-sandbox-frame {
      width: 100%;
      min-height: 280px;
      border: none;
      border-radius: 8px;
      background: #fff;
      display: block;
    }
  `]
})
export class SandboxNodeComponent {
  node = input.required<SlideNode>();
  private sanitizer = inject(DomSanitizer);

  trustedHtml = computed<SafeHtml>(() => {
    const content = this.node().content;
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: system-ui, -apple-system, sans-serif; overflow: auto; }</style>
</head>
<body>${content}</body>
</html>`;
    return this.sanitizer.bypassSecurityTrustHtml(fullHtml);
  });
}
