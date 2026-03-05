import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateFlashCard } from '../../validation/node-validators';

interface FlashCard {
  front: string;
  back: string;
}

@Component({
  selector: 'sp-flash-card-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flash-card-wrap">
      <div class="flash-card-counter" data-testid="text-card-counter">
        {{ currentIndex() + 1 }} / {{ cards().length }}
      </div>
      <div class="flash-card-scene" (click)="flip()" data-testid="button-flip-card">
        <div class="flash-card-inner" [class.flipped]="flipped()">
          <div class="flash-card-face flash-card-front">
            <span>{{ currentCard()?.front }}</span>
          </div>
          <div class="flash-card-face flash-card-back">
            <span>{{ currentCard()?.back }}</span>
          </div>
        </div>
      </div>
      <div class="flash-card-nav">
        <button
          class="flash-nav-btn"
          (click)="prev()"
          [disabled]="currentIndex() === 0"
          data-testid="button-prev-card"
        >Prev</button>
        <button
          class="flash-nav-btn"
          (click)="next()"
          [disabled]="currentIndex() === cards().length - 1"
          data-testid="button-next-card"
        >Next</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .flash-card-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
    }

    .flash-card-counter {
      font-size: 0.85rem;
      color: var(--sp-muted-fg, #64748b);
      font-weight: 500;
    }

    .flash-card-scene {
      perspective: 1000px;
      width: 100%;
      max-width: 420px;
      height: 280px;
      cursor: pointer;
    }

    .flash-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.5s ease;
      transform-style: preserve-3d;
    }

    .flash-card-inner.flipped {
      transform: rotateY(180deg);
    }

    .flash-card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      padding: 24px;
      font-size: 1.1rem;
      line-height: 1.6;
      text-align: center;
      box-sizing: border-box;
    }

    .flash-card-front {
      background: var(--sp-bg, #ffffff);
      color: var(--sp-primary, #3b82f6);
      border: 2px solid var(--sp-border, #e2e8f0);
      font-weight: 600;
    }

    .flash-card-back {
      background: var(--sp-muted, #f1f5f9);
      color: var(--sp-foreground, #1e293b);
      border: 2px solid var(--sp-border, #e2e8f0);
      transform: rotateY(180deg);
    }

    .flash-card-nav {
      display: flex;
      gap: 12px;
    }

    .flash-nav-btn {
      padding: 6px 20px;
      border: 1px solid var(--sp-border, #e2e8f0);
      border-radius: 6px;
      background: var(--sp-bg, #ffffff);
      color: var(--sp-foreground, #1e293b);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .flash-nav-btn:hover:not(:disabled) {
      opacity: 0.75;
    }

    .flash-nav-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `]
})
export class FlashCardNodeComponent {
  node = input.required<SlideNode>();

  currentIndex = signal(0);
  flipped = signal(false);

  cards = computed<FlashCard[]>(() => {
    const content = this.node().content;
    return Array.isArray(content) ? content : [];
  });

  currentCard = computed(() => this.cards()[this.currentIndex()] ?? null);

  flip() {
    this.flipped.update(v => !v);
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.flipped.set(false);
    }
  }

  next() {
    if (this.currentIndex() < this.cards().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.flipped.set(false);
    }
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateFlashCard(node);
  }
}
