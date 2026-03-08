import {
  Component, input, inject, computed, ChangeDetectionStrategy, Type
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { SlideNode } from '../../models/slide.model';
import { RegistryService } from '../../services/registry.service';
import { ValidationIssue } from '../../validation/types';
import { validateColumnsLayout } from '../../validation/node-validators';

@Component({
  selector: 'sp-columns-layout-node',
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-columns-grid" [style.grid-template-columns]="gridTemplate()">
      @for (column of columns(); track $index) {
        <div class="sp-col">
          @for (childNode of column; track childNode.id) {
            @if (getComponent(childNode.type); as component) {
              <ng-container *ngComponentOutlet="component; inputs: { node: childNode }" />
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .sp-columns-grid {
      display: grid;
      gap: 24px;
      width: 100%;
    }
    .sp-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    @media (max-width: 600px) {
      .sp-columns-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class ColumnsLayoutNodeComponent {
  node = input.required<SlideNode>();
  private registry = inject(RegistryService);

  columns = computed<SlideNode[][]>(() => (this.node().content as SlideNode[][]) || []);

  gridTemplate = computed(() => {
    const count = (this.node().meta?.['columns'] as number) || this.columns().length || 1;
    return `repeat(${count}, 1fr)`;
  });

  getComponent(type: string): Type<unknown> | undefined {
    return this.registry.get(type);
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateColumnsLayout(node);
  }
}
