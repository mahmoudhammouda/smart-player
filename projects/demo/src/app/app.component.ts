import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MOCK_SCENARIOS } from './data/mock-scenarios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell" [class.dark]="isDark()">
      <aside class="sidebar" [class.sidebar-open]="sidebarOpen()">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <div class="sidebar-brand-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"></rect><path d="M17 14v7"></path><path d="M7 14v7"></path><path d="M17 3v3"></path><path d="M7 3v3"></path><path d="M10 14 2.3 6.3"></path><path d="m14 6 7.7 7.7"></path><path d="m8 6 8 8"></path></svg>
            </div>
            <div class="sidebar-brand-text">
              <span class="sidebar-brand-name">SmartPlayer</span>
              <span class="sidebar-brand-tagline">LMS Content Engine</span>
            </div>
          </div>
        </div>
        <div class="sidebar-content">
          <div class="sidebar-group">
            <span class="sidebar-group-label">Scenarios</span>
            @for (scenario of scenarios; track scenario.id) {
              <a
                class="sidebar-item"
                [routerLink]="['/scenario', scenario.id]"
                routerLinkActive="sidebar-item-active"
                (click)="closeSidebarMobile()"
              >
                <span class="sidebar-item-icon">{{ getIcon(scenario.icon) }}</span>
                <div class="sidebar-item-info">
                  <span class="sidebar-item-name">{{ scenario.name }}</span>
                  <span class="sidebar-item-desc">{{ scenario.description }}</span>
                </div>
              </a>
            }
          </div>
          <div class="sidebar-group">
            <span class="sidebar-group-label">Tools</span>
            <a
              class="sidebar-item"
              routerLink="/upload"
              routerLinkActive="sidebar-item-active"
              (click)="closeSidebarMobile()"
            >
              <span class="sidebar-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </span>
              <div class="sidebar-item-info">
                <span class="sidebar-item-name">Load JSON</span>
              </div>
            </a>
          </div>
        </div>
        <div class="sidebar-footer">
          <span class="sidebar-footer-text">Angular Library v1.0</span>
        </div>
      </aside>

      <div class="main-area">
        <header class="app-header">
          <button class="hamburger-btn" (click)="toggleSidebar()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
          </button>
          <span class="header-title">SmartPlayer</span>
          <button class="theme-btn" (click)="toggleTheme()">
            @if (isDark()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            }
          </button>
        </header>
        <main class="main-content">
          <router-outlet />
        </main>
      </div>

      @if (sidebarOpen()) {
        <div class="sidebar-overlay" (click)="closeSidebarMobile()"></div>
      }
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  scenarios = MOCK_SCENARIOS;
  isDark = signal(false);
  sidebarOpen = signal(false);

  constructor() {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('sp-theme') : null;
    if (stored === 'dark' || (!stored && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDark.set(true);
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sp-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sp-theme', 'light');
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebarMobile(): void {
    this.sidebarOpen.set(false);
  }

  getIcon(icon: string): string {
    const icons: Record<string, string> = {
      function: '\u03A3',
      history: '\u231A',
      tree: '\u{1F332}',
      wave: '\u223C',
    };
    return icons[icon] || icon;
  }
}
