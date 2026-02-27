# SmartPlayer — LMS Agentic Content Engine

## Overview

A modular content player for LLM-generated educational material. Built in React with TypeScript, it renders structured JSON slides containing typed content nodes — text, math formulas, code, diagrams, and interactive sandboxes.

## Architecture

- **Frontend**: React + Vite + TypeScript, Wouter routing, TanStack Query
- **Backend**: Express (minimal — app is primarily frontend-driven)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Storage**: In-memory (no persistence needed — all content is client-side)

## Key Features

1. **SmartPlayer** — Main orchestrator that renders a `Slide` (array of `SlideNode`) using a node registry
2. **Node Registry** — Maps node types to components: `text`, `math`, `code`, `diagram`, `interactive-sandbox`
3. **Node Types**:
   - `text` — Markdown-aware text with inline formatting
   - `math` — KaTeX display-mode formula rendering
   - `code` — Highlight.js syntax-highlighted code blocks with copy button
   - `diagram` — Mermaid.js flowcharts and graphs
   - `interactive-sandbox` — Isolated iframe-based HTML/CSS/JS sandboxes
4. **Refine Node** — Simulated LLM refinement per node block (toast notification)
5. **Upload Playground** — Load custom JSON slides via file drop or paste
6. **5 Demo Scenarios** — Built-in mock scenarios covering math, history, data structures, physics, React patterns
7. **Dark Mode** — Full dark/light toggle with localStorage persistence

## File Structure

```
client/src/
  components/
    player/
      SmartPlayer.tsx   - Main orchestrator
      TextNode.tsx      - Markdown text renderer
      MathNode.tsx      - KaTeX math renderer
      CodeNode.tsx      - Highlight.js code renderer
      DiagramNode.tsx   - Mermaid.js diagram renderer
      SandboxNode.tsx   - Isolated iframe sandbox
    app-sidebar.tsx     - Navigation sidebar with scenario list
    ThemeToggle.tsx     - Dark/light mode toggle
  pages/
    home.tsx            - Landing page with feature grid
    scenario.tsx        - Individual scenario player
    upload.tsx          - Custom JSON loader playground
  data/
    mock-scenarios.ts   - 5 built-in demo scenarios

shared/schema.ts        - Zod schemas for Slide, SlideNode, NodeType
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

## Dependencies Added

- `katex` — Math typesetting
- `mermaid` — Diagram generation
- `highlight.js` — Code syntax highlighting
- `@types/katex` — TypeScript types for KaTeX
