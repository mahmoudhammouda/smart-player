import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';

@Component({
  selector: 'sp-mention-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (href()) {
      <a [href]="href()" class="mention" [class]="variant()" data-testid="link-mention">
        <span class="prefix">&#64;</span>{{ content() }}
      </a>
    } @else {
      <span class="mention" [class]="variant()" data-testid="text-mention">
        <span class="prefix">&#64;</span>{{ content() }}
      </span>
    }
  `,
  styles: [`
    :host { display: inline-block; }
    .mention {
      display: inline-flex;
      align-items: center;
      padding: 1px 8px;
      border-radius: 9999px;
      font-size: 0.9em;
      font-weight: 500;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    a.mention:hover {
      opacity: 0.8;
    }
    .prefix {
      margin-right: 1px;
      opacity: 0.7;
    }
    
    .concept { background: rgba(59, 130, 246, 0.15); color: #2563eb; }
    .chapter { background: rgba(168, 85, 247, 0.15); color: #9333ea; }
    .person { background: rgba(34, 197, 94, 0.15); color: #16a34a; }
    .tag { background: rgba(100, 116, 139, 0.15); color: #475569; }

    :host-context(.dark) .mention.concept { background: rgba(59, 130, 246, 0.25); color: #60a5fa; }
    :host-context(.dark) .mention.chapter { background: rgba(168, 85, 247, 0.25); color: #c084fc; }
    :host-context(.dark) .mention.person { background: rgba(34, 197, 94, 0.25); color: #4ade80; }
    :host-context(.dark) .mention.tag { background: rgba(100, 116, 139, 0.25); color: #94a3b8; }
  `]
})
export class MentionNodeComponent {
  node = input.required<SlideNode>();

  content = computed(() => String(this.node().content || ''));
  href = computed(() => (this.node().meta?.['href'] as string) || null);
  variant = computed(() => (this.node().meta?.['variant'] as string) || 'concept');
}
