import {
  Component, input, computed, ChangeDetectionStrategy, inject
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateSandbox } from '../../validation/node-validators';

@Component({
  selector: 'sp-sandbox-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-sandbox-block">
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

    .sp-sandbox-block {
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--sp-border, #e2e8f0);
    }

    .sp-sandbox-frame {
      width: 100%;
      min-height: 300px;
      border: none;
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
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateSandbox(node);
  }
}
