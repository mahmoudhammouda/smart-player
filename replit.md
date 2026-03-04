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
3. **22 Built-in Node Types** (grouped by category):
   - **Typography & Structure**: `text`, `heading`, `list`, `divider`, `footnote`
   - **Pedagogical & Engagement**: `callout`, `quote`, `key-concept`, `step-by-step`
   - **Scientific & Technical**: `math` (KaTeX), `code` (Highlight.js), `diagram` (Mermaid.js), `table`
   - **Multimedia**: `image-caption`, `video-embed`, `audio-player`, `gallery`
   - **Interactive & Evaluation**: `interactive-sandbox` (iframe), `fill-blanks`, `flash-card`
   - **Navigation & Meta**: `toc`, `progress`
4. **Ghost UI** — Refine button hidden by default, appears on node hover
5. **Fade & Slide Animations** — Staggered `sp-slide-in` keyframes on node entry
6. **Custom Node Extensibility** — `SP_CUSTOM_NODES` injection token for consumer-defined node types
7. **Upload Playground** — Load custom JSON slides via file drop or paste
8. **6 Demo Scenarios** — Math, history, data structures, physics, rich content showcase, quiz
9. **Dark Mode** — Full dark/light toggle with localStorage persistence
10. **Promotional Landing Page** — Home page with install command, quick start, API reference, live demos

## File Structure

```
projects/
  smart-player/                 # Angular library
    src/
      public-api.ts             # Library public API exports
      lib/
        models/slide.model.ts   # Slide, SlideNode, NodeType, CustomNodeDefinition, RefineEvent
        services/registry.service.ts  # SP_CUSTOM_NODES token + RegistryService
        components/
          smart-player/         # Main orchestrator — continuous document layout
          text-node/            # Markdown text renderer
          heading-node/         # H1/H2/H3 semantic headings
          list-node/            # Ordered/unordered lists with nesting
          divider-node/         # Section dividers (line/dots/stars)
          footnote-node/        # Small annotation text
          callout-node/         # Alert/info/tip/warning/error boxes
          quote-node/           # Editorial blockquotes with author
          key-concept-node/     # Term + definition cards
          step-by-step-node/    # Numbered timeline steps
          math-node/            # KaTeX formula renderer
          code-node/            # Highlight.js code renderer
          diagram-node/         # Mermaid.js diagram renderer
          table-node/           # Data tables with headers/rows
          image-caption-node/   # Images with captions
          video-embed-node/     # YouTube/HTML5 video embeds
          audio-player-node/    # Audio player with title
          gallery-node/         # Image grid galleries
          sandbox-node/         # Isolated iframe sandbox
          fill-blanks-node/     # Fill-in-the-blanks exercises
          flash-card-node/      # 3D flip flash cards
          toc-node/             # Table of contents
          progress-node/        # Progress milestone markers
    package.json
    ng-package.json

  demo/                         # Demo Angular app
    src/
      app/
        app.component.ts        # Shell with sidebar + theme toggle
        app.routes.ts           # Route definitions
        pages/
          home.component.ts     # Promotional landing page
          scenario.component.ts # Scenario player page
          upload.component.ts   # Custom JSON loader
        components/
          quiz-node.component.ts  # Example custom node (registered via SP_CUSTOM_NODES)
        data/
          mock-scenarios.ts     # 6 demo scenarios
```

## SlideNode Data Format

```typescript
interface SlideNode {
  id: string;
  type: string;       // Any built-in or custom type
  content: any;        // String for text types, JSON for structured types
  language?: string;   // For code nodes
  label?: string;      // Section heading or embed label
  meta?: Record<string, unknown>;  // Type-specific metadata
}
```

### Node Type Reference

| Type | Content | Meta |
|------|---------|------|
| `text` | Markdown string | — |
| `heading` | Heading text string | `level`: 1-3 |
| `list` | Array of strings | `ordered`: boolean |
| `divider` | Empty string | `style`: 'line'\|'dots'\|'stars' |
| `footnote` | Footnote text string | — |
| `callout` | Message text | `variant`: 'info'\|'warning'\|'error'\|'tip'\|'note', `title`: string |
| `quote` | Quote text | `author`, `source` |
| `key-concept` | Definition text | `term`: string |
| `step-by-step` | Array of `{title, description}` | — |
| `math` | LaTeX string | — |
| `code` | Code string | — (uses `language` field) |
| `diagram` | Mermaid syntax string | — |
| `table` | `{headers: string[], rows: string[][]}` | `caption` |
| `image-caption` | Image URL | `caption`, `alt` |
| `video-embed` | Video URL | `provider`: 'youtube'\|'html5' |
| `audio-player` | Audio URL | `title` |
| `gallery` | Array of `{url, caption?}` | — |
| `interactive-sandbox` | HTML/CSS/JS string | — |
| `fill-blanks` | Text with `___answer___` blanks | — |
| `flash-card` | Array of `{front, back}` | — |
| `toc` | Array of `{title, level}` | — |
| `progress` | Milestone text | `completed`: boolean |

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
