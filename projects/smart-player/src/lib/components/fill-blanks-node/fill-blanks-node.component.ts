import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateFillBlanks } from '../../validation/node-validators';

interface Segment {
  type: 'text' | 'blank';
  value: string;
}

@Component({
  selector: 'sp-fill-blanks-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fill-blanks-wrap">
      <div class="fill-blanks-content">
        @for (seg of segments(); track $index) {
          @if (seg.type === 'text') {
            <span class="fill-text">{{ seg.value }}</span>
          } @else {
            <input
              class="fill-input"
              [class.correct]="checked() && results()[$index] === true"
              [class.wrong]="checked() && results()[$index] === false"
              [value]="answers()[$index] ?? ''"
              (input)="onInput($index, $event)"
              [attr.data-testid]="'input-blank-' + $index"
              [disabled]="checked()"
              [placeholder]="'...'"
            />
          }
        }
      </div>
      <div class="fill-actions">
        @if (!checked()) {
          <button class="fill-check-btn" (click)="check()" data-testid="button-check-blanks">Check</button>
        } @else {
          <button class="fill-reset-btn" (click)="reset()" data-testid="button-reset-blanks">Reset</button>
          <span class="fill-score" data-testid="text-score">{{ correctCount() }} / {{ totalBlanks() }} correct</span>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .fill-blanks-wrap {
      padding: 16px 0;
    }

    .fill-blanks-content {
      font-size: 1.05rem;
      line-height: 2.2;
      color: var(--sp-foreground, #1e293b);
      flex-wrap: wrap;
    }

    .fill-text {
      white-space: pre-wrap;
    }

    .fill-input {
      display: inline-block;
      width: 120px;
      border: none;
      border-bottom: 2px solid var(--sp-border, #e2e8f0);
      background: transparent;
      color: var(--sp-foreground, #1e293b);
      font-size: 1rem;
      text-align: center;
      outline: none;
      padding: 2px 4px;
      margin: 0 4px;
      transition: border-color 0.2s ease;
      font-family: inherit;
    }

    .fill-input:focus {
      border-bottom-color: var(--sp-primary, #3b82f6);
    }

    .fill-input.correct {
      border-bottom-color: #22c55e;
      color: #22c55e;
    }

    .fill-input.wrong {
      border-bottom-color: #ef4444;
      color: #ef4444;
    }

    .fill-actions {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .fill-check-btn, .fill-reset-btn {
      padding: 6px 20px;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .fill-check-btn {
      background: var(--sp-primary, #3b82f6);
      color: #fff;
    }

    .fill-reset-btn {
      background: var(--sp-muted, #f1f5f9);
      color: var(--sp-foreground, #1e293b);
    }

    .fill-check-btn:hover, .fill-reset-btn:hover {
      opacity: 0.85;
    }

    .fill-score {
      font-size: 0.85rem;
      color: var(--sp-muted-fg, #64748b);
      font-weight: 500;
    }
  `]
})
export class FillBlanksNodeComponent {
  node = input.required<SlideNode>();

  answers = signal<string[]>([]);
  checked = signal(false);
  results = signal<(boolean | null)[]>([]);

  segments = computed<Segment[]>(() => {
    const content = this.node().content as string;
    const regex = /___(.+?)___/g;
    const segments: Segment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', value: content.slice(lastIndex, match.index) });
      }
      segments.push({ type: 'blank', value: match[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      segments.push({ type: 'text', value: content.slice(lastIndex) });
    }
    return segments;
  });

  totalBlanks = computed(() => this.segments().filter(s => s.type === 'blank').length);

  correctCount = computed(() => this.results().filter(r => r === true).length);

  onInput(segIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const blankIndices = this.segments()
      .map((s, i) => s.type === 'blank' ? i : -1)
      .filter(i => i !== -1);
    const blankPos = blankIndices.indexOf(segIndex);
    if (blankPos === -1) return;

    const current = [...this.answers()];
    current[blankPos] = input.value;
    this.answers.set(current);
  }

  check() {
    const blanks = this.segments().filter(s => s.type === 'blank');
    const ans = this.answers();
    const res = blanks.map((b, i) =>
      (ans[i] ?? '').trim().toLowerCase() === b.value.trim().toLowerCase()
    );
    this.checked.set(true);

    const resultMap: (boolean | null)[] = [];
    let blankIdx = 0;
    for (const seg of this.segments()) {
      if (seg.type === 'blank') {
        resultMap.push(res[blankIdx]);
        blankIdx++;
      } else {
        resultMap.push(null);
      }
    }
    this.results.set(resultMap);
  }

  reset() {
    this.answers.set([]);
    this.checked.set(false);
    this.results.set([]);
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateFillBlanks(node);
  }
}
