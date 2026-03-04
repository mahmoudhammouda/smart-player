import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-text-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="sp-text-content" [innerHTML]="renderContent()"></div>`,
  styles: [`
    :host { display: block; }

    .sp-text-content {
      font-size: 1.05rem;
      line-height: 1.85;
      color: var(--sp-foreground, #1e293b);
      letter-spacing: -0.005em;
    }

    :host ::ng-deep p {
      margin-bottom: 16px;
    }

    :host ::ng-deep p:last-child {
      margin-bottom: 0;
    }

    :host ::ng-deep strong {
      font-weight: 700;
    }

    :host ::ng-deep em {
      font-style: italic;
      opacity: 0.9;
    }

    :host ::ng-deep .sp-inline-code {
      font-family: var(--sp-font-mono, 'JetBrains Mono', monospace);
      font-size: 0.85em;
      padding: 2px 7px;
      border-radius: 4px;
      background: var(--sp-muted, #f1f5f9);
      color: var(--sp-primary, #3b82f6);
      border: 1px solid var(--sp-border, #e2e8f0);
    }

    :host ::ng-deep ol, :host ::ng-deep ul {
      padding-left: 22px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    :host ::ng-deep li {
      font-size: 1rem;
      line-height: 1.7;
    }
  `]
})
export class TextNodeComponent {
  node = input.required<SlideNode>();

  renderContent(): string {
    const content = this.node().content;
    const paragraphs = content.split('\n\n');
    return paragraphs.map(para => {
      const trimmed = para.trim();
      if (trimmed.match(/^\d+\. /m)) {
        const items = trimmed.split('\n').map(line => {
          const match = line.match(/^\d+\. (.+)/);
          return match ? `<li>${this.parseInline(match[1])}</li>` : '';
        }).join('');
        return `<ol>${items}</ol>`;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(line => {
          const match = line.match(/^[-*] (.+)/);
          return match ? `<li>${this.parseInline(match[1])}</li>` : '';
        }).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${this.parseInline(trimmed)}</p>`;
    }).join('');
  }

  private parseInline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<span class="sp-inline-code">$1</span>')
      .replace(/\$(.+?)\$/g, '<span class="sp-inline-math">$1</span>');
  }
}
