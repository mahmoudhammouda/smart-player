import {
  Component, input, computed, ChangeDetectionStrategy, inject
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SlideNode } from '../../models/slide.model';
import { ValidationIssue } from '../../validation/types';
import { validateVideoEmbed } from '../../validation/node-validators';

@Component({
  selector: 'sp-video-embed-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sp-video-container" data-testid="video-embed-container">
      @if (provider() === 'youtube') {
        @if (youtubeEmbedUrl()) {
          <iframe
            class="sp-video-frame"
            [src]="youtubeEmbedUrl()!"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            data-testid="video-embed-iframe"
          ></iframe>
        }
      } @else {
        <video
          class="sp-video-frame"
          controls
          data-testid="video-embed-video"
        >
          <source [src]="node().content" />
        </video>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .sp-video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 10px;
      overflow: hidden;
    }

    .sp-video-frame {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  `]
})
export class VideoEmbedNodeComponent {
  node = input.required<SlideNode>();
  private sanitizer = inject(DomSanitizer);

  provider = computed<string>(() => {
    const meta = this.node().meta;
    return (meta?.['provider'] as string) ?? 'youtube';
  });

  youtubeEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.node().content as string;
    const videoId = this.extractYoutubeId(url);
    if (!videoId) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  });

  private extractYoutubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
      const match = url?.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
  static validate(node: Record<string, unknown>): ValidationIssue[] {
    return validateVideoEmbed(node);
  }
}
