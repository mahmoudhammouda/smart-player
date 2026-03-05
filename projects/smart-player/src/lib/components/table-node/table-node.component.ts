import {
  Component, input, computed, ChangeDetectionStrategy
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateTable } from '../../validation/node-validators';

@Component({
  selector: 'sp-table-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-table-wrapper" data-testid="table-wrapper">
      <table class="sp-table" data-testid="table-content">
        @if (headers().length) {
          <thead>
            <tr>
              @for (header of headers(); track header) {
                <th data-testid="table-header">{{ header }}</th>
              }
            </tr>
          </thead>
        }
        <tbody>
          @for (row of rows(); track $index) {
            <tr>
              @for (cell of row; track $index) {
                <td data-testid="table-cell">{{ cell }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
      @if (caption()) {
        <p class="sp-table-caption" data-testid="table-caption">{{ caption() }}</p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-table-wrapper {
      overflow-x: auto;
    }

    .sp-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--sp-border, #e2e8f0);
    }

    .sp-table th,
    .sp-table td {
      padding: 10px 14px;
      border: 1px solid var(--sp-border, #e2e8f0);
      text-align: left;
      color: var(--sp-foreground, #1a202c);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .sp-table th {
      background: var(--sp-muted, #f1f5f9);
      font-weight: 600;
    }

    .sp-table tbody tr:nth-child(even) {
      background: color-mix(in srgb, var(--sp-muted, #f1f5f9) 50%, transparent);
    }

    .sp-table-caption {
      margin-top: 8px;
      font-size: 0.85rem;
      color: var(--sp-muted-fg, #64748b);
      text-align: center;
      font-style: italic;
    }
  `]
})
export class TableNodeComponent {
  node = input.required<SlideNode>();

  headers = computed<string[]>(() => {
    const content = this.node().content;
    return content?.headers ?? [];
  });

  rows = computed<string[][]>(() => {
    const content = this.node().content;
    return content?.rows ?? [];
  });

  caption = computed<string>(() => {
    const meta = this.node().meta;
    return (meta?.['caption'] as string) ?? '';
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateTable(node);
  }
}
