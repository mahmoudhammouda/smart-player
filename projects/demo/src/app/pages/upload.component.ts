import { Component, signal, computed } from '@angular/core';
import { SmartPlayerComponent, Slide, validateSlide, ValidationIssue } from 'smart-player';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [SmartPlayerComponent],
  template: `
    @if (slide()) {
      <div class="upload-result">
        <div class="upload-result-header">
          <div>
            <h2 class="upload-result-title">{{ slide()!.title }}</h2>
            <p class="upload-result-meta">
              {{ slide()!.nodes.length }} nœud{{ slide()!.nodes.length !== 1 ? 's' : '' }}
              @if (warningCount() > 0) {
                &nbsp;·&nbsp;<span class="warn-badge">{{ warningCount() }} avert.</span>
              }
            </p>
          </div>
          <button class="nav-btn" (click)="reset()" data-testid="button-load-another">
            Charger un autre
          </button>
        </div>

        @if (issues().length > 0) {
          <div class="issues-banner">
            <div class="issues-banner-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              {{ warningCount() }} avertissement{{ warningCount() !== 1 ? 's' : '' }} (la slide s'affiche quand même)
            </div>
            @for (issue of issues(); track $index) {
              <div class="issue-row" [class]="'issue-' + issue.severity">
                <span class="issue-badge" [class]="'badge-' + issue.severity">{{ severityLabel(issue.severity) }}</span>
                <code class="issue-path">{{ issue.path }}</code>
                <span class="issue-msg">{{ issue.message }}</span>
                @if (issue.hint) {
                  <span class="issue-hint">→ {{ issue.hint }}</span>
                }
              </div>
            }
          </div>
        }

        <sp-smart-player [slide]="slide()!" [enableRefine]="false" />
      </div>
    } @else {
      <div class="upload-page">
        <div class="upload-header">
          <h1 class="upload-title">Charger un JSON</h1>
          <p class="upload-subtitle">
            Glissez un fichier .json, parcourez vos fichiers, ou collez directement du JSON.
            La validation s'effectue en temps réel via la bibliothèque SmartPlayer.
          </p>
        </div>

        <div
          class="upload-dropzone"
          [class.dropzone-active]="dragging()"
          (dragover)="onDragOver($event)"
          (dragleave)="dragging.set(false)"
          (drop)="onDrop($event)"
          data-testid="dropzone-upload"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="color:var(--muted-fg,#64748b)"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12h4"/><path d="M10 18h4"/><path d="M10 6h4"/></svg>
          <p class="dropzone-text">Glisser un fichier JSON ici</p>
          <p class="dropzone-sub">ou</p>
          <label class="nav-btn" for="file-input" data-testid="label-browse-files">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Parcourir
          </label>
          <input id="file-input" type="file" accept=".json" style="display:none" (change)="onFileInput($event)" data-testid="input-file" />
        </div>

        <div class="divider"><span>ou coller du JSON</span></div>

        <div class="editor-area">
          <div class="editor-toolbar">
            <span class="editor-label">JSON</span>
            <div class="editor-tools">
              <button class="tool-btn" (click)="formatJSON()" [disabled]="!jsonText().trim()" data-testid="button-format-json">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10H3"/><path d="M21 6H3"/><path d="M21 14H3"/><path d="M21 18H3"/></svg>
                Formater
              </button>
              <button class="tool-btn" (click)="clearJSON()" [disabled]="!jsonText().trim()" data-testid="button-clear-json">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Vider
              </button>
              <button class="tool-btn" (click)="loadExample()" data-testid="button-load-example">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                Exemple
              </button>
            </div>
          </div>

          <div class="editor-wrapper"
            [class.has-errors]="liveErrorCount() > 0"
            [class.has-warnings]="liveErrorCount() === 0 && liveWarningCount() > 0"
            [class.is-valid]="jsonText().trim() && !parseError() && liveIssues().length === 0">
            <textarea
              class="paste-textarea"
              placeholder='{"id": "slide-001", "title": "Ma slide", "nodes": [...]}'
              [value]="jsonText()"
              (input)="onTextInput($event)"
              rows="14"
              spellcheck="false"
              data-testid="textarea-json"
            ></textarea>
            <div class="editor-status-bar">
              @if (!jsonText().trim()) {
                <span class="status-empty">En attente de JSON…</span>
              } @else if (parseError()) {
                <span class="status-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  JSON invalide
                </span>
              } @else if (liveErrorCount() > 0) {
                <span class="status-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ liveErrorCount() }} erreur{{ liveErrorCount() !== 1 ? 's' : '' }}
                </span>
                @if (liveWarningCount() > 0) {
                  <span class="status-warn">· {{ liveWarningCount() }} avert.</span>
                }
              } @else if (liveWarningCount() > 0) {
                <span class="status-warn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  {{ liveWarningCount() }} avertissement{{ liveWarningCount() !== 1 ? 's' : '' }}
                </span>
              } @else {
                <span class="status-ok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Valide · Zod ✓ · composants vérifiés
                </span>
              }
              <span class="status-chars">{{ jsonText().length }} car.</span>
            </div>
          </div>

          @if (liveIssues().length > 0) {
            <div class="issues-panel" data-testid="panel-validation-issues">
              <div class="issues-panel-header">
                <span class="issues-panel-title">
                  Résultats de validation SmartPlayer
                </span>
                <div class="issues-counts">
                  @if (liveErrorCount() > 0) {
                    <span class="count-badge error-count">{{ liveErrorCount() }} erreur{{ liveErrorCount() !== 1 ? 's' : '' }}</span>
                  }
                  @if (liveWarningCount() > 0) {
                    <span class="count-badge warn-count">{{ liveWarningCount() }} avert.</span>
                  }
                  @if (liveInfoCount() > 0) {
                    <span class="count-badge info-count">{{ liveInfoCount() }} info</span>
                  }
                </div>
              </div>

              <div class="issues-list">
                @for (issue of liveIssues(); track $index) {
                  <div class="issue-item" [attr.data-testid]="'issue-' + issue.severity">
                    <span class="issue-severity-dot" [class]="'dot-' + issue.severity"></span>
                    <div class="issue-body">
                      <div class="issue-header-row">
                        <code class="issue-path-inline">{{ issue.path }}</code>
                        <span class="issue-sev-label" [class]="'sev-' + issue.severity">{{ severityLabel(issue.severity) }}</span>
                      </div>
                      <p class="issue-message">{{ issue.message }}</p>
                      @if (issue.hint) {
                        <p class="issue-hint-text">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                          {{ issue.hint }}
                        </p>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (parseError()) {
            <div class="parse-error-block" data-testid="panel-parse-error">
              <div class="parse-error-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Erreur de syntaxe JSON
              </div>
              <code class="parse-error-msg">{{ parseError() }}</code>
              <p class="parse-error-hint">Vérifiez les virgules manquantes, guillemets non fermés, ou accolades mal appariées.</p>
            </div>
          }

          <div class="editor-actions">
            <button class="btn btn-primary" [disabled]="!canPreview()" (click)="preview()" data-testid="button-preview">
              @if (liveErrorCount() > 0) {
                Prévisualiser quand même ({{ liveErrorCount() }} erreur{{ liveErrorCount() !== 1 ? 's' : '' }})
              } @else {
                Prévisualiser la slide
              }
            </button>
            @if (liveErrorCount() > 0) {
              <span class="preview-warning-note">Des nœuds invalides pourraient ne pas s'afficher correctement.</span>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .upload-page, .upload-result {
      max-width: 720px;
      margin: 0 auto;
      padding: 36px 24px 80px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .upload-result { max-width: 860px; padding-top: 24px; }

    .upload-result-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .upload-result-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
    .upload-result-meta {
      font-size: 0.8rem;
      color: var(--muted-fg, #64748b);
      margin: 4px 0 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .warn-badge {
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(245,158,11,0.12);
      color: #d97706;
      padding: 1px 6px;
      border-radius: 8px;
    }

    .upload-header { display: flex; flex-direction: column; gap: 6px; }
    .upload-title { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.025em; margin: 0; }
    .upload-subtitle { font-size: 0.875rem; color: var(--muted-fg, #64748b); line-height: 1.6; margin: 0; }

    .upload-dropzone {
      border: 2px dashed var(--border, #e2e8f0);
      border-radius: 14px;
      padding: 36px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: border-color 0.15s, background 0.15s;
      background: color-mix(in srgb, var(--muted, #f1f5f9) 30%, transparent);
      cursor: pointer;
    }
    .upload-dropzone:hover, .upload-dropzone.dropzone-active {
      border-color: color-mix(in srgb, var(--primary, #3b82f6) 60%, transparent);
      background: color-mix(in srgb, var(--primary, #3b82f6) 5%, transparent);
    }

    .dropzone-text { font-size: 0.88rem; font-weight: 600; margin: 0; }
    .dropzone-sub { font-size: 0.75rem; color: var(--muted-fg, #64748b); margin: 0; }

    .nav-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; font-size: 0.8rem; font-weight: 600;
      color: var(--fg, #1e293b); border: 1px solid var(--border, #e2e8f0);
      border-radius: 6px; cursor: pointer; background: var(--card, #fff);
      transition: background 0.15s; text-decoration: none;
    }
    .nav-btn:hover { background: var(--muted, #f1f5f9); }

    .divider {
      display: flex; align-items: center; gap: 12px;
      &::before, &::after { content: ''; flex: 1; height: 1px; background: var(--border, #e2e8f0); }
      span { font-size: 0.72rem; color: var(--muted-fg, #64748b); white-space: nowrap; }
    }

    .editor-area { display: flex; flex-direction: column; gap: 0; }

    .editor-toolbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 6px 12px;
      background: var(--muted, #f1f5f9);
      border: 1px solid var(--border, #e2e8f0);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
    }

    .editor-label {
      font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.07em; color: var(--muted-fg, #64748b);
    }
    .editor-tools { display: flex; gap: 4px; }
    .tool-btn {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 8px; font-size: 0.72rem; font-weight: 600;
      color: var(--muted-fg, #64748b); background: none;
      border: 1px solid transparent; border-radius: 4px; cursor: pointer;
      transition: background 0.12s, color 0.12s;
    }
    .tool-btn:hover:not(:disabled) { background: var(--card, #fff); color: var(--foreground, #0f172a); border-color: var(--border, #e2e8f0); }
    .tool-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .editor-wrapper {
      position: relative;
      border: 1px solid var(--border, #e2e8f0);
      transition: border-color 0.2s;
    }
    .editor-wrapper.has-errors { border-color: rgba(239,68,68,0.6); }
    .editor-wrapper.has-warnings { border-color: rgba(245,158,11,0.6); }
    .editor-wrapper.is-valid { border-color: rgba(34,197,94,0.6); }

    .paste-textarea {
      width: 100%; border: none; padding: 14px;
      font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
      font-size: 0.76rem; line-height: 1.7;
      background: #0f172a; color: #e2e8f0;
      resize: vertical; outline: none; box-sizing: border-box;
      display: block; min-height: 200px;
    }
    .paste-textarea::placeholder { color: #475569; }

    .editor-status-bar {
      display: flex; align-items: center; gap: 10px;
      padding: 5px 12px; background: #1e293b;
      font-size: 0.7rem; font-family: ui-monospace, monospace;
    }
    .status-empty { color: #475569; }
    .status-ok { color: #22c55e; display: flex; align-items: center; gap: 4px; }
    .status-error { color: #ef4444; display: flex; align-items: center; gap: 4px; }
    .status-warn { color: #f59e0b; display: flex; align-items: center; gap: 4px; }
    .status-chars { color: #475569; margin-left: auto; }

    .issues-panel {
      border: 1px solid var(--border, #e2e8f0); border-top: none;
      background: var(--card, #fff); max-height: 340px; overflow-y: auto;
    }
    .issues-panel-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px; border-bottom: 1px solid var(--border, #f0f2f5);
      background: var(--muted, #f8fafc); position: sticky; top: 0;
    }
    .issues-panel-title {
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--muted-fg, #64748b);
    }
    .issues-counts { display: flex; gap: 6px; }
    .count-badge { font-size: 0.65rem; font-weight: 700; padding: 1px 6px; border-radius: 8px; }
    .error-count { background: rgba(239,68,68,0.1); color: #ef4444; }
    .warn-count { background: rgba(245,158,11,0.1); color: #d97706; }
    .info-count { background: rgba(59,130,246,0.1); color: #3b82f6; }

    .issues-list { display: flex; flex-direction: column; }
    .issue-item {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 10px 12px; border-bottom: 1px solid var(--border, #f0f2f5);
      transition: background 0.1s;
    }
    .issue-item:last-child { border-bottom: none; }
    .issue-item:hover { background: var(--muted, #f8fafc); }

    .issue-severity-dot {
      width: 7px; height: 7px; border-radius: 50%;
      flex-shrink: 0; margin-top: 5px;
    }
    .dot-error { background: #ef4444; }
    .dot-warning { background: #f59e0b; }
    .dot-info { background: #3b82f6; }

    .issue-body { flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .issue-header-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .issue-path-inline {
      font-size: 0.72rem; font-family: ui-monospace, monospace;
      color: var(--foreground, #0f172a); background: var(--muted, #f1f5f9);
      padding: 1px 5px; border-radius: 3px; font-weight: 600;
    }
    .issue-sev-label {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.05em; padding: 1px 5px; border-radius: 3px;
    }
    .sev-error { background: rgba(239,68,68,0.1); color: #ef4444; }
    .sev-warning { background: rgba(245,158,11,0.1); color: #d97706; }
    .sev-info { background: rgba(59,130,246,0.1); color: #3b82f6; }
    .issue-message { font-size: 0.78rem; color: var(--foreground, #1e293b); margin: 0; line-height: 1.5; }
    .issue-hint-text {
      font-size: 0.72rem; color: var(--muted-fg, #64748b); margin: 0;
      display: flex; align-items: baseline; gap: 4px; line-height: 1.4;
    }

    .parse-error-block {
      border: 1px solid rgba(239,68,68,0.25); border-top: none;
      background: rgba(239,68,68,0.04); padding: 12px 14px;
      display: flex; flex-direction: column; gap: 6px;
    }
    .parse-error-title { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 700; color: #ef4444; }
    .parse-error-msg { font-size: 0.75rem; font-family: ui-monospace, monospace; color: #ef4444; }
    .parse-error-hint { font-size: 0.72rem; color: var(--muted-fg, #64748b); margin: 0; }

    .editor-actions { display: flex; align-items: center; gap: 12px; padding: 12px 0 0; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 6px; padding: 9px 18px; border-radius: 8px;
      font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none;
      transition: opacity 0.15s;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: var(--primary, #3b82f6); color: white; }
    .preview-warning-note { font-size: 0.72rem; color: var(--muted-fg, #64748b); }

    .issues-banner {
      border: 1px solid rgba(245,158,11,0.25);
      background: rgba(245,158,11,0.04);
      border-radius: 8px; padding: 12px 14px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .issues-banner-title {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.78rem; font-weight: 700; color: #d97706; margin-bottom: 4px;
    }
    .issue-row {
      display: flex; align-items: baseline; gap: 8px;
      font-size: 0.75rem; flex-wrap: wrap;
    }
    .issue-badge {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      padding: 1px 5px; border-radius: 3px; flex-shrink: 0;
    }
    .badge-error { background: rgba(239,68,68,0.12); color: #ef4444; }
    .badge-warning { background: rgba(245,158,11,0.12); color: #d97706; }
    .badge-info { background: rgba(59,130,246,0.12); color: #3b82f6; }
    .issue-path { font-size: 0.7rem; font-family: ui-monospace, monospace; color: var(--muted-fg, #64748b); }
    .issue-msg { color: var(--foreground, #1e293b); }
    .issue-hint { color: var(--muted-fg, #64748b); font-style: italic; }
  `]
})
export class UploadComponent {
  slide = signal<Slide | null>(null);
  issues = signal<ValidationIssue[]>([]);
  dragging = signal(false);
  jsonText = signal('');
  parseError = signal<string | null>(null);

  liveIssues = signal<ValidationIssue[]>([]);
  liveErrorCount = computed(() => this.liveIssues().filter(i => i.severity === 'error').length);
  liveWarningCount = computed(() => this.liveIssues().filter(i => i.severity === 'warning').length);
  liveInfoCount = computed(() => this.liveIssues().filter(i => i.severity === 'info').length);
  warningCount = computed(() => this.issues().filter(i => i.severity !== 'error').length);

  canPreview = computed(() => {
    return !!this.jsonText().trim() && !this.parseError();
  });

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(true);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.readFile(file);
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.readFile(file);
  }

  onTextInput(e: Event): void {
    const text = (e.target as HTMLTextAreaElement).value;
    this.jsonText.set(text);
    this.scheduleValidation(text);
  }

  formatJSON(): void {
    try {
      const formatted = JSON.stringify(JSON.parse(this.jsonText()), null, 2);
      this.jsonText.set(formatted);
      this.runValidation(formatted);
    } catch { }
  }

  clearJSON(): void {
    this.jsonText.set('');
    this.liveIssues.set([]);
    this.parseError.set(null);
  }

  loadExample(): void {
    const example = JSON.stringify({
      id: 'example-lesson-001',
      title: 'Exemple de slide SmartPlayer',
      description: 'Une slide de démonstration avec plusieurs types de nœuds',
      tags: ['exemple', 'demo'],
      nodes: [
        { id: 'n1', type: 'heading', content: 'Introduction', meta: { level: 1 } },
        { id: 'n2', type: 'text', label: 'Présentation', content: 'Ceci est un exemple. Le contenu supporte le **gras**, *l\'italique* et le `code inline`.' },
        { id: 'n3', type: 'math', label: 'Formule d\'Euler', content: 'e^{i\\pi} + 1 = 0' },
        { id: 'n4', type: 'code', language: 'python', label: 'Hello World', content: 'def hello(name):\n    return f"Bonjour, {name}!"\n\nprint(hello("monde"))' },
        { id: 'n5', type: 'callout', content: 'Les nœuds sont rendus de haut en bas.', meta: { variant: 'tip', title: 'Bon à savoir' } },
        { id: 'n6', type: 'checklist', content: [{ text: 'Lire la documentation', checked: true }, { text: 'Tester le JSON loader', checked: false }] },
      ],
    }, null, 2);
    this.jsonText.set(example);
    this.runValidation(example);
  }

  preview(): void {
    const text = this.jsonText().trim();
    if (!text || this.parseError()) return;
    try {
      const raw = JSON.parse(text);
      const result = validateSlide(raw);
      this.issues.set(result.issues.filter(i => i.severity !== 'error'));
      this.slide.set(raw as Slide);
    } catch (e: unknown) {
      this.parseError.set(e instanceof Error ? e.message : 'JSON invalide');
    }
  }

  reset(): void {
    this.slide.set(null);
    this.issues.set([]);
    this.parseError.set(null);
    this.jsonText.set('');
    this.liveIssues.set([]);
  }

  severityLabel(s: ValidationIssue['severity']): string {
    return s === 'error' ? 'Erreur' : s === 'warning' ? 'Attention' : 'Info';
  }

  private scheduleValidation(text: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.runValidation(text), 300);
  }

  private runValidation(text: string): void {
    if (!text.trim()) {
      this.parseError.set(null);
      this.liveIssues.set([]);
      return;
    }
    let raw: unknown;
    try {
      raw = JSON.parse(text);
      this.parseError.set(null);
    } catch (e: unknown) {
      this.parseError.set(e instanceof Error ? e.message : 'JSON invalide');
      this.liveIssues.set([]);
      return;
    }
    const result = validateSlide(raw);
    this.liveIssues.set(result.issues);
  }

  private readFile(file: File): void {
    if (!file.name.endsWith('.json')) {
      this.parseError.set('Veuillez charger un fichier .json');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.jsonText.set(text);
      this.runValidation(text);
    };
    reader.readAsText(file);
  }
}
