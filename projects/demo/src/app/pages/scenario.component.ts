import { Component, inject, computed, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SmartPlayerComponent, RefineEvent } from 'smart-player';
import { MOCK_SCENARIOS } from '../data/mock-scenarios';

type Tab = 'preview' | 'json';

@Component({
  selector: 'app-scenario',
  standalone: true,
  imports: [SmartPlayerComponent, RouterLink],
  template: `
    @if (scenario(); as s) {
      <div class="scenario-page">
        <div class="scenario-nav">
          @if (prevScenario(); as prev) {
            <a class="nav-btn" [routerLink]="['/scenario', prev.id]" data-testid="link-prev-scenario">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
              {{ prev.name }}
            </a>
          } @else {
            <div></div>
          }
          @if (nextScenario(); as next) {
            <a class="nav-btn" [routerLink]="['/scenario', next.id]" data-testid="link-next-scenario">
              {{ next.name }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
            </a>
          } @else {
            <div></div>
          }
        </div>

        <div class="tab-bar" role="tablist">
          <button
            class="tab-btn"
            [class.active]="activeTab() === 'preview'"
            (click)="activeTab.set('preview')"
            role="tab"
            [attr.aria-selected]="activeTab() === 'preview'"
            data-testid="button-tab-preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Aperçu
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab() === 'json'"
            (click)="activeTab.set('json')"
            role="tab"
            [attr.aria-selected]="activeTab() === 'json'"
            data-testid="button-tab-json"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            JSON
          </button>
          <div class="tab-copy-area">
            @if (activeTab() === 'json') {
              <button class="copy-btn" (click)="copyJson(s)" data-testid="button-copy-json">
                @if (copied()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Copié !
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Copier
                }
              </button>
            }
          </div>
        </div>

        <div class="tab-content" role="tabpanel">
          @if (activeTab() === 'preview') {
            <sp-smart-player
              [slide]="s.slide"
              [enableRefine]="true"
              (refine)="onRefine($event)"
            />
          } @else {
            <div class="json-viewer" data-testid="panel-json">
              <pre class="json-pre"><code [innerHTML]="highlighted(s.slide)"></code></pre>
            </div>
          }
        </div>

        @if (toast()) {
          <div class="toast" (click)="toast.set(null)" data-testid="toast-refine">
            <strong>Refinement simulated</strong>
            <span>{{ toast() }}</span>
          </div>
        }
      </div>
    } @else {
      <div class="not-found">
        <p>Scenario not found.</p>
        <a class="nav-btn" routerLink="/" data-testid="link-go-home">Go Home</a>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .scenario-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 24px 80px;
    }

    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      height: 300px;
      color: var(--muted-fg, #64748b);
    }

    .scenario-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 20px;
    }

    .nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--muted-fg, #64748b);
      text-decoration: none;
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 6px;
      transition: background 0.15s;
    }

    .nav-btn:hover {
      background: var(--muted, #f1f5f9);
    }

    .tab-bar {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--border, #e2e8f0);
      margin-bottom: 24px;
      gap: 2px;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--muted-fg, #64748b);
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      cursor: pointer;
      border-radius: 4px 4px 0 0;
      transition: color 0.15s, border-color 0.15s;
    }

    .tab-btn:hover {
      color: var(--foreground, #0f172a);
      background: var(--muted, #f1f5f9);
    }

    .tab-btn.active {
      color: var(--foreground, #0f172a);
      border-bottom-color: var(--foreground, #0f172a);
    }

    .tab-copy-area {
      margin-left: auto;
      padding-right: 4px;
    }

    .copy-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--muted-fg, #64748b);
      background: none;
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .copy-btn:hover {
      background: var(--muted, #f1f5f9);
      color: var(--foreground, #0f172a);
    }

    .tab-content {
      min-height: 200px;
    }

    .json-viewer {
      background: #0f172a;
      border-radius: 10px;
      border: 1px solid #1e293b;
      overflow: hidden;
    }

    .json-pre {
      margin: 0;
      padding: 20px 24px;
      overflow-x: auto;
      font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', ui-monospace, monospace;
      font-size: 0.78rem;
      line-height: 1.7;
      color: #e2e8f0;
      white-space: pre;
    }

    .json-pre :global(.jk) { color: #93c5fd; }
    .json-pre :global(.js) { color: #86efac; }
    .json-pre :global(.jn) { color: #fda4af; }
    .json-pre :global(.jb) { color: #c4b5fd; }
    .json-pre :global(.jp) { color: #94a3b8; }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 18px;
      border-radius: 10px;
      background: var(--card, #f8fafc);
      border: 1px solid var(--card-border, #f0f2f5);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-width: 320px;
      cursor: pointer;
      z-index: 100;
      animation: toast-in 0.3s ease;
    }

    .toast strong {
      font-size: 0.8rem;
      font-weight: 700;
    }

    .toast span {
      font-size: 0.75rem;
      color: var(--muted-fg, #64748b);
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ScenarioComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  toast = signal<string | null>(null);
  activeTab = signal<Tab>('preview');
  copied = signal(false);

  scenarioId = signal<string | null>(null);

  scenario = computed(() => {
    const id = this.scenarioId();
    return MOCK_SCENARIOS.find(s => s.id === id) ?? null;
  });

  prevScenario = computed(() => {
    const idx = MOCK_SCENARIOS.findIndex(s => s.id === this.scenarioId());
    return idx > 0 ? MOCK_SCENARIOS[idx - 1] : null;
  });

  nextScenario = computed(() => {
    const idx = MOCK_SCENARIOS.findIndex(s => s.id === this.scenarioId());
    return idx >= 0 && idx < MOCK_SCENARIOS.length - 1 ? MOCK_SCENARIOS[idx + 1] : null;
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.scenarioId.set(params.get('id'));
      this.activeTab.set('preview');
    });
  }

  highlighted(slide: unknown): string {
    const json = JSON.stringify(slide, null, 2);
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(
        /("(?:[^"\\]|\\.)*")(\s*:)/g,
        '<span class="jk">$1</span><span class="jp">$2</span>'
      )
      .replace(
        /:\s*("(?:[^"\\]|\\.)*")/g,
        ': <span class="js">$1</span>'
      )
      .replace(
        /:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,
        ': <span class="jn">$1</span>'
      )
      .replace(
        /:\s*(true|false|null)/g,
        ': <span class="jb">$1</span>'
      );
  }

  async copyJson(slide: unknown): Promise<void> {
    try {
      await navigator.clipboard.writeText(JSON.stringify(slide, null, 2));
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.copied.set(false);
    }
  }

  onRefine(event: RefineEvent): void {
    this.toast.set(`Block "${event.node.label || event.nodeId}" sent to LLM agent for refinement.`);
    setTimeout(() => this.toast.set(null), 4000);
  }
}
