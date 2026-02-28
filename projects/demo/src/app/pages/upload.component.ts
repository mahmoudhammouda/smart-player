import { Component, signal } from '@angular/core';
import { SmartPlayerComponent, Slide } from 'smart-player';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [SmartPlayerComponent],
  template: `
    @if (slide(); as s) {
      <div class="upload-result">
        <div class="upload-result-header">
          <div>
            <h2 class="upload-result-title">Loaded: {{ s.title }}</h2>
            <p class="upload-result-meta">{{ s.nodes.length }} node{{ s.nodes.length !== 1 ? 's' : '' }}</p>
          </div>
          <button class="nav-btn" (click)="reset()">Load Another</button>
        </div>
        <sp-smart-player [slide]="s" [enableRefine]="false" />
      </div>
    } @else {
      <div class="upload-page">
        <div class="upload-header">
          <h1 class="upload-title">Load Custom JSON</h1>
          <p class="upload-subtitle">Upload a slide JSON file or paste JSON directly to preview it in the SmartPlayer.</p>
        </div>

        <div
          class="upload-dropzone"
          [class.dropzone-active]="dragging()"
          (dragover)="onDragOver($event)"
          (dragleave)="dragging.set(false)"
          (drop)="onDrop($event)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--muted-fg, #64748b); margin-bottom: 12px;"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 12h4"></path><path d="M10 18h4"></path><path d="M10 6h4"></path></svg>
          <p class="dropzone-text">Drop a JSON file here</p>
          <p class="dropzone-sub">or</p>
          <label class="nav-btn" for="file-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Browse Files
          </label>
          <input id="file-input" type="file" accept=".json" style="display:none" (change)="onFileInput($event)" />
        </div>

        <div class="divider"><span>or paste JSON</span></div>

        <div class="paste-area">
          <textarea
            class="paste-textarea"
            placeholder='{"id": "...", "title": "...", "nodes": [...]}'
            [value]="jsonText()"
            (input)="onTextInput($event)"
            rows="8"
          ></textarea>
          <button class="btn btn-primary" [disabled]="!jsonText().trim()" (click)="parseJSON()">Preview Slide</button>
        </div>

        @if (error()) {
          <div class="upload-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>{{ error() }}</span>
          </div>
        }

        <div class="example-section">
          <h3 class="example-title">Expected Format</h3>
          <pre class="example-code">{{ exampleJSON }}</pre>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .upload-page, .upload-result {
      max-width: 700px;
      margin: 0 auto;
      padding: 40px 24px 80px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .upload-result { max-width: 860px; padding-top: 24px; gap: 20px; }

    .upload-result-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .upload-result-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
    .upload-result-meta { font-size: 0.8rem; color: var(--muted-fg, #64748b); margin: 0; }

    .upload-header { display: flex; flex-direction: column; gap: 6px; }
    .upload-title { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.025em; margin: 0; }
    .upload-subtitle { font-size: 0.875rem; color: var(--muted-fg, #64748b); line-height: 1.6; margin: 0; }

    .upload-dropzone {
      border: 2px dashed var(--border, #e2e8f0);
      border-radius: 14px;
      padding: 40px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      transition: border-color 0.15s, background 0.15s;
      background: color-mix(in srgb, var(--muted, #f1f5f9) 30%, transparent);
    }

    .upload-dropzone:hover, .upload-dropzone.dropzone-active {
      border-color: color-mix(in srgb, var(--primary, #3b82f6) 50%, transparent);
      background: color-mix(in srgb, var(--primary, #3b82f6) 4%, transparent);
    }

    .dropzone-text { font-size: 0.9rem; font-weight: 600; margin: 0; }
    .dropzone-sub { font-size: 0.78rem; color: var(--muted-fg, #64748b); margin: 0; }

    .nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--fg, #1e293b);
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 6px;
      cursor: pointer;
      background: transparent;
      transition: background 0.15s;
      text-decoration: none;
    }

    .nav-btn:hover { background: var(--muted, #f1f5f9); }

    .divider {
      display: flex;
      align-items: center;
      gap: 12px;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--border, #e2e8f0);
      }

      span {
        font-size: 0.75rem;
        color: var(--muted-fg, #64748b);
        white-space: nowrap;
      }
    }

    .paste-area {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .paste-textarea {
      width: 100%;
      border-radius: 10px;
      border: 1px solid var(--border, #e2e8f0);
      padding: 12px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      line-height: 1.6;
      background: color-mix(in srgb, var(--muted, #f1f5f9) 40%, transparent);
      color: var(--fg, #1e293b);
      resize: vertical;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;

      &:focus { border-color: var(--primary, #3b82f6); }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
      border: none;
    }

    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: var(--primary, #3b82f6); color: white; }

    .upload-error {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px 14px;
      border-radius: 8px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      font-size: 0.8rem;
      color: #ef4444;
    }

    .example-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .example-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--muted-fg, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0;
    }

    .example-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      line-height: 1.65;
      padding: 16px;
      border-radius: 10px;
      background: #1a1b26;
      color: #c3e88d;
      overflow-x: auto;
      border: 1px solid #232436;
      margin: 0;
    }
  `]
})
export class UploadComponent {
  slide = signal<Slide | null>(null);
  error = signal<string | null>(null);
  dragging = signal(false);
  jsonText = signal('');

  exampleJSON = JSON.stringify({
    id: 'example-1',
    title: 'My Custom Lesson',
    description: 'A lesson with text and math',
    tags: ['example'],
    nodes: [
      { id: 'n1', type: 'text', label: 'Introduction', content: 'This is **bold** text.' },
      { id: 'n2', type: 'math', label: "Euler's Identity", content: 'e^{i\\pi} + 1 = 0' },
      { id: 'n3', type: 'code', language: 'javascript', label: 'Hello', content: 'console.log("Hello!");' },
    ],
  }, null, 2);

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
    this.jsonText.set((e.target as HTMLTextAreaElement).value);
  }

  parseJSON(): void {
    const text = this.jsonText().trim();
    if (!text) return;
    this.tryParse(text);
  }

  reset(): void {
    this.slide.set(null);
    this.error.set(null);
    this.jsonText.set('');
  }

  private readFile(file: File): void {
    if (!file.name.endsWith('.json')) {
      this.error.set('Please upload a .json file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      this.jsonText.set(text);
      this.tryParse(text);
    };
    reader.readAsText(file);
  }

  private tryParse(text: string): void {
    try {
      const raw = JSON.parse(text);
      if (!raw.id || !raw.title || !Array.isArray(raw.nodes)) {
        this.error.set('Invalid slide format: must have id, title, and nodes array.');
        this.slide.set(null);
        return;
      }
      this.slide.set(raw as Slide);
      this.error.set(null);
    } catch {
      this.error.set('Invalid JSON - please check your file format.');
      this.slide.set(null);
    }
  }
}
