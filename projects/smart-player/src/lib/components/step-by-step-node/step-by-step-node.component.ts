import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateStepByStep } from '../../validation/node-validators';

interface Step {
  title: string;
  description: string;
}

@Component({
  selector: 'sp-step-by-step-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="timeline">
      @for (step of steps(); track $index; let last = $last) {
        <div class="step">
          <div class="step-indicator">
            <div class="step-circle">{{ $index + 1 }}</div>
            @if (!last) {
              <div class="step-line"></div>
            }
          </div>
          <div class="step-content">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description">{{ step.description }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .timeline {
      display: flex;
      flex-direction: column;
    }

    .step {
      display: flex;
      gap: 16px;
      min-height: 60px;
    }

    .step-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .step-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--sp-primary, #3b82f6);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-line {
      width: 2px;
      flex: 1;
      background: var(--sp-border, #e2e8f0);
      margin: 4px 0;
    }

    .step-content {
      padding-bottom: 24px;
      padding-top: 2px;
    }

    .step-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--sp-foreground, #1e293b);
      margin-bottom: 4px;
    }

    .step-description {
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--sp-muted-fg, #64748b);
    }
  `]
})
export class StepByStepNodeComponent {
  node = input.required<SlideNode>();

  steps = computed<Step[]>(() => {
    const content = this.node().content;
    if (Array.isArray(content)) return content;
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateStepByStep(node);
  }
}
