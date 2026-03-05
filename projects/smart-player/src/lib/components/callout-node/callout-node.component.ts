import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateCallout } from '../../validation/node-validators';

const VARIANT_CONFIG: Record<string, { color: string; icon: string }> = {
  info:    { color: '#3b82f6', icon: '\u2139' },
  warning: { color: '#f59e0b', icon: '\u26A0' },
  error:   { color: '#ef4444', icon: '\u2715' },
  tip:     { color: '#22c55e', icon: '\u2731' },
  note:    { color: '#6b7280', icon: '\u2710' },
};

@Component({
  selector: 'sp-callout-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="callout" [style.border-left-color]="config().color" [style.background]="bgColor()">
      <div class="callout-header">
        <span class="callout-icon" [style.color]="config().color">{{ config().icon }}</span>
        @if (title()) {
          <span class="callout-title" [style.color]="config().color">{{ title() }}</span>
        }
      </div>
      <div class="callout-body">{{ node().content }}</div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .callout {
      border-left: 3px solid;
      border-radius: 8px;
      padding: 16px;
    }

    .callout-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .callout-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .callout-title {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .callout-body {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--sp-foreground, #1e293b);
    }
  `]
})
export class CalloutNodeComponent {
  node = input.required<SlideNode>();

  config = computed(() => {
    const variant = (this.node().meta?.['variant'] as string) || 'info';
    return VARIANT_CONFIG[variant] || VARIANT_CONFIG['info'];
  });

  title = computed(() => (this.node().meta?.['title'] as string) || '');

  bgColor = computed(() => {
    const hex = this.config().color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.06)`;
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateCallout(node);
  }
}
