# SmartPlayer — Angular LMS Agentic Content Engine

## Overview

A distributable Angular 19+ library package (`smart-player`) that renders structured JSON slides from an LLM into richly formatted educational content. Uses a "Continuous Document" UI layout (Notion/Medium style) where nodes flow as one cohesive article. Includes a demo Angular application for testing and a promotional landing page.

## Architecture

- **Angular Workspace**: Monorepo with library (`projects/smart-player/`) and demo app (`projects/demo/`)
- **Library**: Angular 19 standalone components with signals (`input()`, `signal()`, `output()`, `viewChild()`, `afterRender()`)
- **Demo**: Angular 19 standalone app with routing, sidebar navigation, dark mode
- **Build**: `ng build smart-player` produces an npm-distributable package in `dist/smart-player/`
- **UI Pattern**: Continuous Document — no card borders/shadows; text flows naturally; code/math/diagrams are embedded blocks; actions appear on hover (Ghost UI)

## Key Features

1. **SmartPlayer** — Main orchestrator component (`<sp-smart-player>`) that renders a `Slide` as a continuous document
2. **Node Registry** — Injectable service mapping node types to components
3. **5 Node Types**:
   - `text` — Markdown-aware text with inline formatting (bold, italic, code, lists)
   - `math` — KaTeX display-mode formula rendering (subtle background block)
   - `code` — Highlight.js syntax-highlighted code blocks with copy button (dark terminal style)
   - `diagram` — Mermaid.js flowcharts and graphs (centered with subtle background)
   - `interactive-sandbox` — Isolated iframe-based HTML/CSS/JS sandboxes (bordered container)
4. **Ghost UI** — Refine button hidden by default, appears on node hover (positioned to the right)
5. **Fade & Slide Animations** — Staggered `sp-slide-in` keyframes on node entry
6. **Custom Node Extensibility** — `SP_CUSTOM_NODES` injection token for consumer-defined node types
7. **Upload Playground** — Load custom JSON slides via file drop or paste
8. **5 Demo Scenarios** — Math, history, data structures, physics, quiz (custom node)
9. **Dark Mode** — Full dark/light toggle with localStorage persistence
10. **Promotional Landing Page** — Home page with install command, quick start, API reference, live demos

## File Structure

```
projects/
  smart-player/                 # Angular library
    src/
      public-api.ts             # Library public API exports (SP_CUSTOM_NODES, etc.)
      lib/
        models/slide.model.ts   # Slide, SlideNode, NodeType (string), CustomNodeDefinition, RefineEvent
        services/registry.service.ts  # SP_CUSTOM_NODES token + RegistryService
        components/
          smart-player/         # Main orchestrator — continuous document layout
          text-node/            # Markdown text renderer (flowing paragraphs)
          math-node/            # KaTeX math renderer (centered block)
          code-node/            # Highlight.js code renderer (terminal block)
          diagram-node/         # Mermaid.js diagram renderer (centered block)
          sandbox-node/         # Isolated iframe sandbox (bordered container)
    package.json                # Library peer dependencies
    ng-package.json             # ng-packagr configuration

  demo/                         # Demo Angular app
    src/
      app/
        app.component.ts        # Shell with sidebar + theme toggle (Overview link at top)
        app.routes.ts           # Route definitions
        pages/
          home.component.ts     # Promotional landing page (install, API, demos)
          scenario.component.ts # Scenario player page
          upload.component.ts   # Custom JSON loader
        components/
          quiz-node.component.ts  # Example custom node (registered via SP_CUSTOM_NODES)
        data/
          mock-scenarios.ts     # 5 demo scenarios (math, history, data-structures, physics, quiz)
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

- Workflow: `npx ng serve demo --host 0.0.0.0 --port 5000`
- `angular.json` has `disableHostCheck: true` for Replit proxy compatibility
- tsconfig paths map `smart-player` → `./projects/smart-player/src/public-api.ts` for dev
- Library build: `npx ng build smart-player` → outputs to `dist/smart-player/`

## Configuration Files

- `angular.json` — Workspace config for both library and demo (analytics disabled, disableHostCheck)
- `tsconfig.angular.json` — Root Angular TypeScript config (extended by project tsconfigs)
