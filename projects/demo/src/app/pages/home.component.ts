import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOCK_SCENARIOS } from '../data/mock-scenarios';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-page">
      <div class="home-hero">
        <div class="home-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
          <span>Agentic LMS Content Engine</span>
        </div>
        <h1 class="home-title"><span class="gradient-text">SmartPlayer</span></h1>
        <p class="home-subtitle">
          A modular Angular library for rendering LLM-generated educational content.
          Supports math formulas, interactive code, diagrams, and sandboxed experiments.
        </p>
        <div class="home-actions">
          <a class="btn btn-primary" [routerLink]="['/scenario', scenarios[0].id]">
            Start Exploring
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </a>
          <a class="btn btn-outline" routerLink="/upload">Load Custom JSON</a>
        </div>
      </div>

      <div class="features-grid">
        @for (feat of features; track feat.title) {
          <div class="feature-card">
            <div class="feature-icon">
              <span>{{ feat.icon }}</span>
            </div>
            <div class="feature-body">
              <h3 class="feature-title">{{ feat.title }}</h3>
              <p class="feature-desc">{{ feat.desc }}</p>
            </div>
          </div>
        }
      </div>

      <div class="scenarios-section">
        <h2 class="section-title">Demo Scenarios</h2>
        <div class="scenarios-list">
          @for (s of scenarios; track s.id) {
            <a class="scenario-card" [routerLink]="['/scenario', s.id]">
              <div class="scenario-icon">{{ getIcon(s.icon) }}</div>
              <div class="scenario-body">
                <h3 class="scenario-name">{{ s.name }}</h3>
                <p class="scenario-desc">{{ s.description }}</p>
              </div>
              <svg class="scenario-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .home-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 24px 80px;
      display: flex;
      flex-direction: column;
      gap: 64px;
    }

    .home-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 20px;
    }

    .home-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--primary, #3b82f6) 20%, transparent);
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary, #3b82f6);
      letter-spacing: 0.04em;
    }

    .home-title {
      font-size: 4rem;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
      margin: 0;
    }

    .gradient-text {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .home-subtitle {
      max-width: 540px;
      font-size: 1.05rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.65;
      margin: 0;
    }

    .home-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 4px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      border: none;
    }

    .btn:hover { opacity: 0.9; }
    .btn:active { transform: scale(0.98); }

    .btn-primary {
      background: var(--primary, #3b82f6);
      color: white;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border, #e2e8f0);
      color: var(--fg, #1e293b);
    }

    .btn-outline:hover {
      background: var(--muted, #f1f5f9);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    .feature-card {
      display: flex;
      gap: 14px;
      padding: 18px;
      border-radius: 12px;
      background: var(--card, #f8fafc);
      border: 1px solid var(--card-border, #f0f2f5);
    }

    .feature-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--primary, #3b82f6) 15%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--primary, #3b82f6);
      font-weight: 700;
    }

    .feature-body { display: flex; flex-direction: column; gap: 4px; }

    .feature-title {
      font-size: 0.875rem;
      font-weight: 700;
      margin: 0;
    }

    .feature-desc {
      font-size: 0.78rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.55;
      margin: 0;
    }

    .scenarios-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin: 0;
    }

    .scenarios-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .scenario-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      border-radius: 12px;
      background: var(--card, #f8fafc);
      border: 1px solid var(--card-border, #f0f2f5);
      cursor: pointer;
      transition: border-color 0.15s;
      text-decoration: none;
      color: var(--fg, #1e293b);
    }

    .scenario-card:hover {
      border-color: color-mix(in srgb, var(--primary, #3b82f6) 40%, transparent);
    }

    .scenario-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--muted, #f1f5f9);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .scenario-body { flex: 1; min-width: 0; }

    .scenario-name {
      font-size: 0.9rem;
      font-weight: 700;
      margin: 0 0 2px;
    }

    .scenario-desc {
      font-size: 0.78rem;
      color: var(--muted-fg, #64748b);
      margin: 0;
    }

    .scenario-arrow {
      flex-shrink: 0;
      opacity: 0.3;
      transition: opacity 0.15s, transform 0.15s;
      color: var(--muted-fg, #64748b);
    }

    .scenario-card:hover .scenario-arrow {
      opacity: 1;
      transform: translateX(3px);
    }

    @media (max-width: 640px) {
      .home-title { font-size: 2.5rem; }
      .home-subtitle { font-size: 0.9rem; }
    }
  `]
})
export class HomeComponent {
  scenarios = MOCK_SCENARIOS;

  features = [
    { icon: 'Aa', title: 'Rich Text Rendering', desc: 'Markdown-aware paragraphs, lists, and inline formatting.' },
    { icon: '\u03A3', title: 'KaTeX Mathematics', desc: 'Beautiful typeset equations - display mode and inline LaTeX.' },
    { icon: '</>', title: 'Syntax Highlighting', desc: 'Highlight.js powered code blocks with copy functionality.' },
    { icon: '\u25C7', title: 'Mermaid Diagrams', desc: 'Flowcharts, sequence diagrams, and graph visualizations.' },
    { icon: '\u26A1', title: 'Interactive Sandboxes', desc: 'Isolated iframe-based HTML/CSS/JS experiments.' },
    { icon: '\u2728', title: 'Node Refinement', desc: 'Send blocks to an LLM agent for targeted regeneration.' },
  ];

  getIcon(icon: string): string {
    const icons: Record<string, string> = { function: '\u03A3', history: '\u231A', tree: '\u{1F332}', wave: '\u223C' };
    return icons[icon] || icon;
  }
}
