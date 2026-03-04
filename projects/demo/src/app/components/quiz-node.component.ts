import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from 'smart-player';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

@Component({
  selector: 'app-quiz-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quiz-container">
      @for (q of questions(); track $index; let qi = $index) {
        <div class="quiz-question">
          <p class="quiz-question-text">{{ qi + 1 }}. {{ q.question }}</p>
          <div class="quiz-options">
            @for (opt of q.options; track $index; let oi = $index) {
              <button
                class="quiz-option"
                [class.quiz-correct]="selections()[qi] !== undefined && oi === q.answer"
                [class.quiz-wrong]="selections()[qi] === oi && oi !== q.answer"
                [class.quiz-selected]="selections()[qi] === oi"
                [disabled]="selections()[qi] !== undefined"
                (click)="selectAnswer(qi, oi)"
              >
                <span class="quiz-option-letter">{{ getLetter(oi) }}</span>
                <span>{{ opt }}</span>
              </button>
            }
          </div>
        </div>
      }
      @if (allAnswered()) {
        <div class="quiz-result">
          Score: {{ correctCount() }} / {{ questions().length }}
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .quiz-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .quiz-question-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--sp-foreground, #1e293b);
      margin: 0 0 10px;
    }

    .quiz-options {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .quiz-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid var(--sp-border, #e2e8f0);
      border-radius: 8px;
      background: transparent;
      color: var(--sp-foreground, #1e293b);
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      text-align: left;
      font-family: inherit;
    }

    .quiz-option:hover:not(:disabled) {
      background: var(--sp-muted, #f1f5f9);
      border-color: var(--sp-muted-fg, #94a3b8);
    }

    .quiz-option:disabled {
      cursor: default;
    }

    .quiz-option-letter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: var(--sp-muted, #f1f5f9);
      font-weight: 700;
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    .quiz-correct {
      border-color: #22c55e;
      background: rgba(34, 197, 94, 0.08);
    }

    .quiz-correct .quiz-option-letter {
      background: #22c55e;
      color: white;
    }

    .quiz-wrong {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.08);
    }

    .quiz-wrong .quiz-option-letter {
      background: #ef4444;
      color: white;
    }

    .quiz-result {
      font-size: 0.9rem;
      font-weight: 700;
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--sp-muted, #f1f5f9);
      color: var(--sp-foreground, #1e293b);
      text-align: center;
    }
  `]
})
export class QuizNodeComponent {
  node = input.required<SlideNode>();
  selections = signal<Record<number, number>>({});

  questions = (): QuizQuestion[] => {
    try {
      const parsed = JSON.parse(this.node().content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  allAnswered = (): boolean => {
    const qs = this.questions();
    const sels = this.selections();
    return qs.length > 0 && qs.every((_, i) => sels[i] !== undefined);
  };

  correctCount = (): number => {
    const qs = this.questions();
    const sels = this.selections();
    return qs.filter((q, i) => sels[i] === q.answer).length;
  };

  selectAnswer(questionIndex: number, optionIndex: number): void {
    this.selections.update(s => ({ ...s, [questionIndex]: optionIndex }));
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
