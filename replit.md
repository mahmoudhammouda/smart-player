# SmartPlayer — Angular LMS Agentic Content Engine

## Overview

A distributable Angular 19+ library package (`smart-player`) that renders structured JSON slides from an LLM into richly formatted educational content. Includes a demo Angular application for testing.

## Architecture

- **Angular Workspace**: Monorepo with library (`projects/smart-player/`) and demo app (`projects/demo/`)
- **Library**: Angular 19 standalone components with signals (`input()`, `signal()`, `output()`, `viewChild()`, `afterRender()`)
- **Demo**: Angular 19 standalone app with routing, sidebar navigation, dark mode
- **Build**: `ng build smart-player` produces an npm-distributable package in `dist/smart-player/`

## Key Features

1. **SmartPlayer** — Main orchestrator component (`<sp-smart-player>`) that renders a `Slide` using a node registry
2. **Node Registry** — Injectable service mapping node types to components
3. **5 Node Types**:
   - `text` — Markdown-aware text with inline formatting (bold, italic, code, lists)
   - `math` — KaTeX display-mode formula rendering
   - `code` — Highlight.js syntax-highlighted code blocks with copy button
   - `diagram` — Mermaid.js flowcharts and graphs
   - `interactive-sandbox` — Isolated iframe-based HTML/CSS/JS sandboxes
4. **Refine Node** — Event emitter for LLM refinement per node block
5. **Upload Playground** — Load custom JSON slides via file drop or paste
6. **4 Demo Scenarios** — Math, history, data structures, physics
7. **Dark Mode** — Full dark/light toggle with localStorage persistence

## File Structure

```
projects/
  smart-player/                 # Angular library
    src/
      public-api.ts             # Library public API exports
      lib/
        models/slide.model.ts   # Slide, SlideNode, NodeType, Scenario, RefineEvent
        services/registry.service.ts  # Node type → component registry
        components/
          smart-player/         # Main orchestrator component
          text-node/            # Markdown text renderer
          math-node/            # KaTeX math renderer
          code-node/            # Highlight.js code renderer
          diagram-node/         # Mermaid.js diagram renderer
          sandbox-node/         # Isolated iframe sandbox
    package.json                # Library peer dependencies
    ng-package.json             # ng-packagr configuration

  demo/                         # Demo Angular app
    src/
      app/
        app.component.ts        # Shell with sidebar + theme toggle
        app.routes.ts           # Route definitions
        pages/
          home.component.ts     # Landing page
          scenario.component.ts # Scenario player page
          upload.component.ts   # Custom JSON loader
        data/
          mock-scenarios.ts     # 4 demo scenarios
```

## Data Format

```json
{
  "id": "lesson-1",
  "title": "My Lesson",
  "description": "Optional description",
  "tags": ["math", "calculus"],
  "nodes": [
    { "id": "n1", "type": "text", "label": "Intro", "content": "**Bold** text" },
    { "id": "n2", "type": "math", "content": "e^{i\\pi} + 1 = 0" },
    { "id": "n3", "type": "code", "language": "python", "content": "print('hi')" },
    { "id": "n4", "type": "diagram", "content": "graph LR; A --> B" },
    { "id": "n5", "type": "interactive-sandbox", "content": "<h1>Hello</h1><script>...</script>" }
  ]
}
```

## Dependencies

- `@angular/core@19`, `@angular/common@19` — Angular framework
- `katex` — Math typesetting
- `mermaid` — Diagram generation
- `highlight.js` — Code syntax highlighting
- `ng-packagr` — Library packaging

## Development

- Workflow: `npx ng serve demo --host 0.0.0.0 --port 5000 --disable-host-check`
- tsconfig paths map `smart-player` → `./projects/smart-player/src/public-api.ts` for dev
- Library build: `npx ng build smart-player` → outputs to `dist/smart-player/`

## Configuration Files

- `angular.json` — Workspace config for both library and demo
- `tsconfig.angular.json` — Root Angular TypeScript config (extended by project tsconfigs)
- `tsconfig.json` — Legacy config (not used by Angular projects)
