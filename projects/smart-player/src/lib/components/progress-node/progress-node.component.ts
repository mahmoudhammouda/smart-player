import { Component, input, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateProgress } from '../../validation/node-validators';

@Component({
  selector: 'sp-progress-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="progress-wrap"
      [class.completed]="completed()"
      (click)="toggle()"
      data-testid="button-toggle-progress"
    >
      <span class="progress-icon">
        @if (completed()) {
          <span class="icon-check">&check;</span>
        } @else {
          <span class="icon-pending">&#9675;</span>
        }
      </span>
      <span class="progress-text" [class.done]="completed()" data-testid="text-progress">
        {{ node().content }}
      </span>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .progress-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 8px 0;
      user-select: none;
      transition: opacity 0.15s ease;
    }

    .progress-wrap:hover {
      opacity: 0.8;
    }

    .progress-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      font-size: 1.1rem;
      transition: color 0.2s ease, transform 0.2s ease;
    }

    .icon-check {
      color: #22c55e;
      font-weight: 700;
    }

    .icon-pending {
      color: var(--sp-muted-fg, #64748b);
    }

    .progress-text {
      font-size: 1rem;
      color: var(--sp-foreground, #1e293b);
      line-height: 1.5;
      transition: color 0.2s ease, text-decoration 0.2s ease;
    }

    .progress-text.done {
      text-decoration: line-through;
      color: var(--sp-muted-fg, #64748b);
    }
  `]
})
export class ProgressNodeComponent implements OnInit {
  node = input.required<SlideNode>();
  completed = signal(false);

  ngOnInit() {
    const meta = this.node().meta;
    if (meta?.['completed']) {
      this.completed.set(true);
    }
  }

  toggle() {
    this.completed.update(v => !v);
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateProgress(node);
  }
}
