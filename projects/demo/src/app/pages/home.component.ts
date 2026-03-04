import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOCK_SCENARIOS } from '../data/mock-scenarios';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-page">

      <!-- ── HERO ── -->
      <section class="hero">
        <div class="hero-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Angular 19 · Standalone · ESM
        </div>

        <h1 class="hero-title">
          Render LLM content<br>
          <span class="gradient-text">beautifully in Angular</span>
        </h1>

        <p class="hero-subtitle">
          <strong>SmartPlayer</strong> is an Angular library that turns structured JSON slides from an LLM
          into rich educational content — math, code, diagrams, interactive sandboxes, and more.
          Drop it into any Angular 19+ app in minutes.
        </p>

        <div class="install-box">
          <span class="install-dollar">$</span>
          <code class="install-cmd">npm install smart-player</code>
          <button class="copy-btn" (click)="copy('npm install smart-player', $event)" title="Copy">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            @if (copied()) { <span style="font-size:0.7rem">Copied!</span> }
          </button>
        </div>

        <div class="hero-actions">
          <a class="btn btn-primary" [routerLink]="['/scenario', scenarios[0].id]">
            Live Demo
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a class="btn btn-outline" routerLink="/upload">Try Your JSON</a>
        </div>
      </section>

      <!-- ── FEATURES ── -->
      <section class="section">
        <h2 class="section-title">Everything you need to render LLM content</h2>
        <p class="section-subtitle">Five built-in node types, dark mode, refine events, and a clean extension API.</p>

        <div class="features-grid">
          @for (feat of features; track feat.title) {
            <div class="feature-card">
              <div class="feature-icon-wrap">
                <span class="feature-icon">{{ feat.icon }}</span>
              </div>
              <h3 class="feature-name">{{ feat.title }}</h3>
              <p class="feature-desc">{{ feat.desc }}</p>
              <div class="feature-tag">{{ feat.tag }}</div>
            </div>
          }
        </div>
      </section>

      <!-- ── QUICK START ── -->
      <section class="section">
        <h2 class="section-title">Up and running in 3 steps</h2>
        <p class="section-subtitle">No NgModules. Fully standalone.</p>

        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-body">
              <h3 class="step-title">Install the package</h3>
              <div class="code-block">
                <div class="code-label">Terminal</div>
                <pre class="code-pre"><code>npm install smart-player</code></pre>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-body">
              <h3 class="step-title">Import the component</h3>
              <div class="code-block">
                <div class="code-label">app.component.ts</div>
                <pre class="code-pre"><code>import &#123; SmartPlayerComponent &#125; from 'smart-player';

&#64;Component(&#123;
  imports: [SmartPlayerComponent],
  template: \`&lt;sp-smart-player [slide]="slide" /&gt;\`
&#125;)
export class AppComponent &#123;
  slide = &#123; /* your JSON slide data */ &#125;;
&#125;</code></pre>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-body">
              <h3 class="step-title">Pass your JSON slide</h3>
              <div class="code-block">
                <div class="code-label">Slide JSON format</div>
                <pre class="code-pre"><code>&#123;
  "id": "slide-1",
  "title": "Introduction to Calculus",
  "nodes": [
    &#123; "id": "n1", "type": "text",    "label": "Overview",   "content": "Calculus is..." &#125;,
    &#123; "id": "n2", "type": "math",    "label": "Derivative", "content": "f'(x) = \\lim..." &#125;,
    &#123; "id": "n3", "type": "code",    "label": "Example",    "content": "def f(x):\n  ..." &#125;,
    &#123; "id": "n4", "type": "diagram", "label": "Flow",       "content": "graph TD\n A--&gt;B" &#125;
  ]
&#125;</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── NODE TYPES ── -->
      <section class="section">
        <h2 class="section-title">Five built-in node types</h2>
        <p class="section-subtitle">Each node type is rendered by a dedicated standalone component.</p>

        <div class="node-types-grid">
          @for (n of nodeTypes; track n.type) {
            <div class="node-type-card">
              <div class="node-type-header">
                <span class="node-type-icon">{{ n.icon }}</span>
                <div>
                  <div class="node-type-name">{{ n.name }}</div>
                  <div class="node-type-badge">type: "{{ n.type }}"</div>
                </div>
              </div>
              <p class="node-type-desc">{{ n.desc }}</p>
              <div class="node-type-powered">Powered by <strong>{{ n.lib }}</strong></div>
            </div>
          }
        </div>
      </section>

      <!-- ── EXTENSIBILITY ── -->
      <section class="section extend-section">
        <div class="extend-content">
          <div class="extend-text">
            <div class="extend-badge">Extensible</div>
            <h2 class="extend-title">Add your own node types</h2>
            <p class="extend-desc">
              Register custom node components via Angular's dependency injection.
              No library source modifications required.
            </p>
            <ul class="extend-list">
              <li>Provide your component via <code>SP_CUSTOM_NODES</code></li>
              <li>Receives the full <code>SlideNode</code> as an input signal</li>
              <li>Works with any Angular standalone component</li>
            </ul>
          </div>
          <div class="extend-code">
            <div class="code-block">
              <div class="code-label">app.config.ts</div>
              <pre class="code-pre"><code>import &#123; SP_CUSTOM_NODES &#125; from 'smart-player';
import &#123; QuizNodeComponent &#125; from './quiz-node';

export const appConfig = &#123;
  providers: [
    &#123;
      provide: SP_CUSTOM_NODES,
      useValue: [&#123;
        type: 'quiz',
        component: QuizNodeComponent,
        label: 'Quiz'
      &#125;]
    &#125;
  ]
&#125;;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- ── COMPONENT API ── -->
      <section class="section">
        <h2 class="section-title">Component API</h2>
        <p class="section-subtitle">Clean, minimal inputs and outputs.</p>

        <div class="api-table-wrap">
          <table class="api-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Direction</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              @for (api of apiRef; track api.name) {
                <tr>
                  <td><code class="api-name">{{ api.name }}</code></td>
                  <td><code class="api-type">{{ api.type }}</code></td>
                  <td><span class="api-dir" [class.api-dir-out]="api.dir === 'output'">{{ api.dir }}</span></td>
                  <td class="api-desc-cell">{{ api.desc }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- ── LIVE DEMOS ── -->
      <section class="section">
        <h2 class="section-title">Live demos</h2>
        <p class="section-subtitle">Each scenario is a real JSON slide rendered by SmartPlayer.</p>

        <div class="demos-grid">
          @for (s of scenarios; track s.id) {
            <a class="demo-card" [routerLink]="['/scenario', s.id]">
              <div class="demo-icon">{{ getIcon(s.icon) }}</div>
              <div class="demo-body">
                <div class="demo-name">{{ s.name }}</div>
                <div class="demo-desc">{{ s.description }}</div>
                <div class="demo-tags">
                  @for (tag of s.slide.tags || []; track tag) {
                    <span class="demo-tag">{{ tag }}</span>
                  }
                </div>
              </div>
              <svg class="demo-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          }
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .home-page {
      max-width: 920px;
      margin: 0 auto;
      padding: 40px 24px 96px;
      display: flex;
      flex-direction: column;
      gap: 72px;
    }

    /* ── Hero ── */
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 22px;
      padding-top: 16px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--primary, #3b82f6) 25%, transparent);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--primary, #3b82f6);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .hero-title {
      font-size: 3.6rem;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 0;
      color: var(--fg, #1e293b);
    }

    .gradient-text {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 60%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      max-width: 580px;
      font-size: 1.05rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.7;
      margin: 0;
    }

    .install-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--card, #f8fafc);
      border: 1px solid var(--card-border, #e2e8f0);
      border-radius: 10px;
      padding: 10px 16px;
      font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
      font-size: 0.9rem;
    }

    .install-dollar {
      color: var(--muted-fg, #94a3b8);
      user-select: none;
    }

    .install-cmd {
      color: var(--fg, #1e293b);
      background: none;
      padding: 0;
    }

    .copy-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 8px;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--card-border, #e2e8f0);
      background: transparent;
      color: var(--muted-fg, #64748b);
      cursor: pointer;
      font-size: 0.75rem;
      transition: background 0.15s, color 0.15s;
    }

    .copy-btn:hover {
      background: var(--muted, #f1f5f9);
      color: var(--fg, #1e293b);
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 11px 22px;
      border-radius: 9px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.15s, transform 0.1s;
      border: none;
      cursor: pointer;
    }

    .btn:hover { opacity: 0.88; }
    .btn:active { transform: scale(0.98); }

    .btn-primary {
      background: var(--primary, #3b82f6);
      color: #fff;
      box-shadow: 0 1px 6px color-mix(in srgb, var(--primary, #3b82f6) 40%, transparent);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border, #e2e8f0);
      color: var(--fg, #1e293b);
    }

    .btn-outline:hover { background: var(--muted, #f1f5f9); }

    /* ── Sections ── */
    .section {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .section-title {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
      color: var(--fg, #1e293b);
    }

    .section-subtitle {
      font-size: 0.95rem;
      color: var(--muted-fg, #64748b);
      margin: -18px 0 0;
      line-height: 1.6;
    }

    /* ── Features ── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 14px;
    }

    .feature-card {
      padding: 20px;
      border-radius: 12px;
      background: var(--card, #f8fafc);
      border: 1px solid var(--card-border, #f0f2f5);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .feature-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 9px;
      background: color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--primary, #3b82f6) 18%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary, #3b82f6);
    }

    .feature-name {
      font-size: 0.875rem;
      font-weight: 700;
      margin: 4px 0 0;
      color: var(--fg, #1e293b);
    }

    .feature-desc {
      font-size: 0.78rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.55;
      margin: 0;
      flex: 1;
    }

    .feature-tag {
      font-size: 0.65rem;
      font-weight: 600;
      color: color-mix(in srgb, var(--primary, #3b82f6) 80%, transparent);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* ── Steps ── */
    .steps {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .step {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary, #3b82f6);
      color: #fff;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .step-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .step-title {
      font-size: 0.95rem;
      font-weight: 700;
      margin: 6px 0 0;
      color: var(--fg, #1e293b);
    }

    .code-block {
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--card-border, #e2e8f0);
    }

    .code-label {
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted-fg, #94a3b8);
      background: var(--card, #f8fafc);
      padding: 7px 14px;
      border-bottom: 1px solid var(--card-border, #e2e8f0);
    }

    .code-pre {
      margin: 0;
      padding: 14px 16px;
      background: var(--code-bg, #0f172a);
      overflow-x: auto;
    }

    .code-pre code {
      font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
      font-size: 0.82rem;
      line-height: 1.65;
      color: #e2e8f0;
    }

    /* ── Node types ── */
    .node-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }

    .node-type-card {
      padding: 18px;
      border-radius: 12px;
      background: var(--card, #f8fafc);
      border: 1px solid var(--card-border, #f0f2f5);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .node-type-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .node-type-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .node-type-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--fg, #1e293b);
    }

    .node-type-badge {
      font-size: 0.68rem;
      font-family: 'Fira Code', monospace;
      color: var(--muted-fg, #94a3b8);
      margin-top: 1px;
    }

    .node-type-desc {
      font-size: 0.78rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.55;
      margin: 0;
      flex: 1;
    }

    .node-type-powered {
      font-size: 0.7rem;
      color: var(--muted-fg, #94a3b8);
    }

    .node-type-powered strong {
      color: var(--fg, #475569);
    }

    /* ── Extensibility ── */
    .extend-section {
      background: color-mix(in srgb, var(--primary, #3b82f6) 5%, var(--card, #f8fafc));
      border: 1px solid color-mix(in srgb, var(--primary, #3b82f6) 15%, transparent);
      border-radius: 16px;
      padding: 32px;
    }

    .extend-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .extend-badge {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--primary, #3b82f6);
      background: color-mix(in srgb, var(--primary, #3b82f6) 12%, transparent);
      padding: 3px 10px;
      border-radius: 999px;
      margin-bottom: 10px;
    }

    .extend-title {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 10px;
      color: var(--fg, #1e293b);
    }

    .extend-desc {
      font-size: 0.875rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.65;
      margin: 0 0 16px;
    }

    .extend-list {
      margin: 0;
      padding-left: 18px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .extend-list li {
      font-size: 0.82rem;
      color: var(--muted-fg, #64748b);
      line-height: 1.5;
    }

    .extend-list code {
      font-family: 'Fira Code', monospace;
      font-size: 0.78rem;
      background: color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
      color: var(--primary, #3b82f6);
      padding: 1px 5px;
      border-radius: 4px;
    }

    /* ── API table ── */
    .api-table-wrap {
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid var(--card-border, #e2e8f0);
    }

    .api-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.83rem;
    }

    .api-table th {
      text-align: left;
      padding: 10px 16px;
      background: var(--card, #f8fafc);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted-fg, #94a3b8);
      border-bottom: 1px solid var(--card-border, #e2e8f0);
    }

    .api-table td {
      padding: 11px 16px;
      border-bottom: 1px solid var(--card-border, #f0f2f5);
      vertical-align: top;
    }

    .api-table tr:last-child td { border-bottom: none; }

    .api-name {
      font-family: 'Fira Code', monospace;
      font-size: 0.8rem;
      background: color-mix(in srgb, var(--primary, #3b82f6) 8%, transparent);
      color: var(--primary, #3b82f6);
      padding: 1px 6px;
      border-radius: 4px;
    }

    .api-type {
      font-family: 'Fira Code', monospace;
      font-size: 0.78rem;
      color: var(--muted-fg, #64748b);
    }

    .api-dir {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, #22c55e 12%, transparent);
      color: #16a34a;
    }

    .api-dir-out {
      background: color-mix(in srgb, #f59e0b 12%, transparent);
      color: #d97706;
    }

    .api-desc-cell {
      color: var(--muted-fg, #64748b);
      line-height: 1.5;
    }

    /* ── Demos ── */
    .demos-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .demo-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      border-radius: 12px;
      background: var(--card, #f8fafc);
      border: 1px solid var(--card-border, #f0f2f5);
      text-decoration: none;
      color: var(--fg, #1e293b);
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .demo-card:hover {
      border-color: color-mix(in srgb, var(--primary, #3b82f6) 45%, transparent);
      box-shadow: 0 2px 12px color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
    }

    .demo-icon {
      font-size: 1.5rem;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--muted, #f1f5f9);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .demo-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }

    .demo-name {
      font-size: 0.9rem;
      font-weight: 700;
    }

    .demo-desc {
      font-size: 0.78rem;
      color: var(--muted-fg, #64748b);
    }

    .demo-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 2px;
    }

    .demo-tag {
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--muted, #f1f5f9);
      color: var(--muted-fg, #64748b);
    }

    .demo-arrow {
      flex-shrink: 0;
      opacity: 0.25;
      color: var(--muted-fg, #64748b);
      transition: opacity 0.15s, transform 0.15s;
    }

    .demo-card:hover .demo-arrow {
      opacity: 0.8;
      transform: translateX(4px);
    }

    /* ── Dark mode ── */
    :host-context(.dark) .code-pre { background: #0d1117; }
    :host-context(.dark) .hero-title { color: #f1f5f9; }
    :host-context(.dark) .section-title { color: #f1f5f9; }
    :host-context(.dark) .feature-card { background: #1e293b; border-color: #334155; }
    :host-context(.dark) .node-type-card { background: #1e293b; border-color: #334155; }
    :host-context(.dark) .demo-card { background: #1e293b; border-color: #334155; }
    :host-context(.dark) .install-box { background: #1e293b; border-color: #334155; }
    :host-context(.dark) .install-cmd { color: #e2e8f0; }
    :host-context(.dark) .extend-section { background: color-mix(in srgb, #3b82f6 8%, #1e293b); }
    :host-context(.dark) .extend-title { color: #f1f5f9; }
    :host-context(.dark) .api-table-wrap { border-color: #334155; }
    :host-context(.dark) .api-table th { background: #1e293b; border-color: #334155; }
    :host-context(.dark) .api-table td { border-color: #1e293b; }
    :host-context(.dark) .code-block { border-color: #334155; }
    :host-context(.dark) .code-label { background: #1e293b; border-color: #334155; }

    /* ── Responsive ── */
    @media (max-width: 700px) {
      .hero-title { font-size: 2.2rem; }
      .extend-content { grid-template-columns: 1fr; }
      .extend-section { padding: 20px; }
    }

    @media (max-width: 480px) {
      .home-page { padding: 24px 16px 64px; gap: 48px; }
      .hero-title { font-size: 1.9rem; }
      .install-box { font-size: 0.78rem; flex-wrap: wrap; }
    }
  `]
})
export class HomeComponent {
  scenarios = MOCK_SCENARIOS;
  copied = signal(false);

  features = [
    { icon: 'Aa', title: 'Rich Text', tag: 'type: text', desc: 'Markdown-aware paragraphs, bold/italic/inline code, bullet lists, and more.' },
    { icon: 'Σ', title: 'KaTeX Math', tag: 'type: math', desc: 'Beautiful typeset equations in display and inline mode with custom macros.' },
    { icon: '</>', title: 'Syntax Highlighting', tag: 'type: code', desc: 'Highlight.js powered code blocks with copy-to-clipboard and language label.' },
    { icon: '◇', title: 'Mermaid Diagrams', tag: 'type: diagram', desc: 'Flowcharts, sequence diagrams, ER diagrams, and Gantt charts from text.' },
    { icon: '⚡', title: 'Interactive Sandbox', tag: 'type: interactive-sandbox', desc: 'Isolated iframe-based HTML/CSS/JS experiments with full script support.' },
    { icon: '✨', title: 'Node Refinement', tag: '@refine output', desc: 'Each node emits a RefineEvent so you can send it back to an LLM for targeted regeneration.' },
  ];

  nodeTypes = [
    { icon: 'Aa', type: 'text', name: 'Text', lib: 'Custom Markdown parser', desc: 'Renders paragraphs with inline Markdown: **bold**, *italic*, `code`, and - bullet lists.' },
    { icon: 'Σ', type: 'math', name: 'Math', lib: 'KaTeX', desc: 'Renders LaTeX expressions in display mode. Supports multi-line equations and custom macros.' },
    { icon: '</>', type: 'code', name: 'Code', lib: 'Highlight.js', desc: 'Syntax-highlighted code block with auto language detection, language label, and copy button.' },
    { icon: '◇', type: 'diagram', name: 'Diagram', lib: 'Mermaid.js', desc: 'Converts Mermaid DSL text into SVG diagrams: flowchart, sequence, class, ER, and more.' },
    { icon: '⚡', type: 'interactive-sandbox', name: 'Sandbox', lib: 'secure iframe', desc: 'Renders an arbitrary HTML/CSS/JS document inside a sandboxed iframe with allow-scripts.' },
  ];

  apiRef = [
    { name: 'slide', type: 'Slide', dir: 'input', desc: 'The slide object containing a list of nodes to render.' },
    { name: 'showRefineButton', type: 'boolean', dir: 'input', desc: 'Optionally show a "Refine" button on each node. Default: false.' },
    { name: 'refine', type: 'EventEmitter<RefineEvent>', dir: 'output', desc: 'Emitted when a user clicks "Refine" on a node. Contains nodeId, nodeType, and content.' },
  ];

  getIcon(icon: string): string {
    const icons: Record<string, string> = {
      function: 'Σ', history: '⌚', tree: '🌲', wave: '∼', quiz: '?'
    };
    return icons[icon] || icon;
  }

  copy(text: string, event: Event): void {
    navigator.clipboard?.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
