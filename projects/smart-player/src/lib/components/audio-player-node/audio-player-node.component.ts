import {
  Component, input, computed, ChangeDetectionStrategy
} from '@angular/core';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateAudioPlayer } from '../../validation/node-validators';

@Component({
  selector: 'sp-audio-player-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-audio-player" data-testid="audio-player-container">
      @if (title()) {
        <p class="sp-audio-title" data-testid="audio-player-title">{{ title() }}</p>
      }
      <audio
        class="sp-audio-element"
        controls
        [src]="node().content"
        data-testid="audio-player-audio"
      ></audio>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-audio-player {
      background: var(--sp-muted, #f1f5f9);
      padding: 12px;
      border-radius: 8px;
    }

    .sp-audio-title {
      margin: 0 0 8px 0;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--sp-foreground, #1a202c);
      line-height: 1.4;
    }

    .sp-audio-element {
      width: 100%;
      display: block;
    }
  `]
})
export class AudioPlayerNodeComponent {
  node = input.required<SlideNode>();

  title = computed<string>(() => {
    const meta = this.node().meta;
    return (meta?.['title'] as string) ?? '';
  });
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateAudioPlayer(node);
  }
}
