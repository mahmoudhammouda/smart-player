import { Component, inject, computed, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SmartPlayerComponent, RefineEvent } from 'smart-player';
import { MOCK_SCENARIOS } from '../data/mock-scenarios';

@Component({
  selector: 'app-scenario',
  standalone: true,
  imports: [SmartPlayerComponent, RouterLink],
  template: `
    @if (scenario(); as s) {
      <div class="scenario-page">
        <div class="scenario-nav">
          @if (prevScenario(); as prev) {
            <a class="nav-btn" [routerLink]="['/scenario', prev.id]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
              {{ prev.name }}
            </a>
          } @else {
            <div></div>
          }
          @if (nextScenario(); as next) {
            <a class="nav-btn" [routerLink]="['/scenario', next.id]">
              {{ next.name }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
            </a>
          } @else {
            <div></div>
          }
        </div>

        <sp-smart-player
          [slide]="s.slide"
          [enableRefine]="true"
          (refine)="onRefine($event)"
        />

        @if (toast()) {
          <div class="toast" (click)="toast.set(null)">
            <strong>Refinement simulated</strong>
            <span>{{ toast() }}</span>
          </div>
        }
      </div>
    } @else {
      <div class="not-found">
        <p>Scenario not found.</p>
        <a class="nav-btn" routerLink="/">Go Home</a>
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
      margin-bottom: 24px;
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
    });
  }

  onRefine(event: RefineEvent): void {
    this.toast.set(`Block "${event.node.label || event.nodeId}" sent to LLM agent for refinement.`);
    setTimeout(() => this.toast.set(null), 4000);
  }
}
