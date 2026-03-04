# SmartPlayer

An Angular library for rendering LLM-generated educational content. Supports rich text, math formulas (KaTeX), syntax-highlighted code (Highlight.js), diagrams (Mermaid), and interactive HTML sandboxes — all from a single JSON data structure.

## Features

- **Text nodes** with inline Markdown formatting (bold, italic, inline code, lists)
- **Math nodes** rendered with KaTeX (display mode, custom macros)
- **Code nodes** with Highlight.js syntax highlighting and one-click copy
- **Diagram nodes** powered by Mermaid (flowcharts, sequence diagrams, etc.)
- **Interactive sandbox nodes** that run arbitrary HTML/CSS/JS in a secure iframe
- **Dark mode** support via CSS custom properties (`.dark` class or `[data-theme="dark"]`)
- **Refine** button per node — emits an event so your app can re-generate content with an LLM
- **Extensible** — register custom node types at runtime via `RegistryService`
- Fully standalone Angular components (no NgModules required)

## Installation

```bash
npm install smart-player
```

### Peer Dependencies

The library requires the following peer dependencies:

| Package             | Version   | Used by          |
|---------------------|-----------|------------------|
| `@angular/core`     | `^19.0.0` | Core framework   |
| `@angular/common`   | `^19.0.0` | Core framework   |
| `katex`             | `^0.16.0` | Math rendering   |
| `mermaid`           | `^11.0.0` | Diagram rendering|
| `highlight.js`      | `^11.0.0` | Code highlighting|

```bash
npm install katex mermaid highlight.js
```

> **Note:** You may also need to include the KaTeX CSS in your global styles or `angular.json`:
>
> ```json
> "styles": [
>   "node_modules/katex/dist/katex.min.css"
> ]
> ```

## Quick Start

Import `SmartPlayerComponent` in your standalone component or module, then pass a `Slide` object:

```typescript
import { Component } from '@angular/core';
import { SmartPlayerComponent, Slide } from 'smart-player';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SmartPlayerComponent],
  template: `<sp-smart-player [slide]="slide" />`,
})
export class AppComponent {
  slide: Slide = {
    id: 'demo-1',
    title: 'Hello SmartPlayer',
    description: 'A minimal example',
    tags: ['demo'],
    nodes: [
      {
        id: 'n1',
        type: 'text',
        label: 'Welcome',
        content: 'This is a **bold** and *italic* text node.',
      },
    ],
  };
}
```

That's it — the player renders automatically with animations, badges, and dark-mode support.

## API Reference

### `SmartPlayerComponent`

**Selector:** `sp-smart-player`

#### Inputs

| Input          | Type      | Default | Description                                           |
|----------------|-----------|---------|-------------------------------------------------------|
| `slide`        | `Slide`   | *required* | The slide data to render (see data model below).   |
| `enableRefine` | `boolean` | `true`  | Show/hide the "Refine" button on each node.           |

#### Outputs

| Output   | Type                       | Description                                                     |
|----------|----------------------------|-----------------------------------------------------------------|
| `refine` | `EventEmitter<RefineEvent>`| Emitted when the user clicks "Refine" on a node.               |

### Data Model

All types are exported from `smart-player`.

#### `Slide`

```typescript
interface Slide {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  nodes: SlideNode[];
}
```

#### `SlideNode`

```typescript
interface SlideNode {
  id: string;
  type: NodeType;
  content: string;
  language?: string;   // used by 'code' nodes (e.g. 'python', 'typescript')
  label?: string;      // optional heading displayed in the node header
  meta?: Record<string, unknown>; // arbitrary metadata for custom nodes
}
```

#### `NodeType`

```typescript
type NodeType = 'text' | 'math' | 'code' | 'diagram' | 'interactive-sandbox';
```

#### `Scenario`

A convenience wrapper used by the demo app:

```typescript
interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  slide: Slide;
}
```

#### `RefineEvent`

```typescript
interface RefineEvent {
  nodeId: string;
  node: SlideNode;
}
```

## JSON Data Format

A slide is a flat JSON object. Each node in the `nodes` array has a `type` that determines how `content` is rendered.

### Text Node

Renders Markdown-like content with support for bold (`**text**`), italic (`*text*`), inline code (`` `code` ``), inline math (`$formula$`), and ordered/unordered lists.

```json
{
  "id": "n1",
  "type": "text",
  "label": "Overview",
  "content": "Calculus is the study of **continuous change**.\n\nKey branches:\n\n1. Differential calculus\n2. Integral calculus"
}
```

### Math Node

Renders a LaTeX expression in display mode using KaTeX. Supports custom macros (`\R`, `\N`, `\Z` are built-in).

```json
{
  "id": "n2",
  "type": "math",
  "label": "Derivative Definition",
  "content": "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}"
}
```

### Code Node

Renders syntax-highlighted code using Highlight.js. Set `language` to any language identifier supported by Highlight.js (e.g. `python`, `typescript`, `java`). Includes a copy-to-clipboard button.

```json
{
  "id": "n3",
  "type": "code",
  "label": "Python Example",
  "language": "python",
  "content": "def greet(name):\n    return f'Hello, {name}!'"
}
```

### Diagram Node

Renders a Mermaid diagram. The `content` should be valid Mermaid syntax.

```json
{
  "id": "n4",
  "type": "diagram",
  "label": "Flow",
  "content": "graph LR\n    A[Start] --> B[Process]\n    B --> C[End]"
}
```

### Interactive Sandbox Node

Renders arbitrary HTML/CSS/JS inside a sandboxed `<iframe>` (with `sandbox="allow-scripts"`). The `content` is injected as the body of a full HTML document.

```json
{
  "id": "n5",
  "type": "interactive-sandbox",
  "label": "Counter Demo",
  "content": "<button onclick=\"this.textContent = +this.textContent + 1\">0</button>"
}
```

## Handling the Refine Event

When `enableRefine` is `true` (the default), each node displays a "Refine" button. Clicking it emits a `RefineEvent` containing the node's id and full data. Use this to call an LLM and regenerate or improve the content.

```html
<sp-smart-player
  [slide]="slide"
  [enableRefine]="true"
  (refine)="onRefine($event)"
/>
```

```typescript
import { RefineEvent } from 'smart-player';

onRefine(event: RefineEvent): void {
  console.log('Refine requested for node:', event.nodeId);
  console.log('Current content:', event.node.content);
  // Call your LLM API, then update the slide data
}
```

To hide the refine buttons entirely:

```html
<sp-smart-player [slide]="slide" [enableRefine]="false" />
```

## Dark Mode Support

The player automatically adapts to dark mode. It detects dark mode via:

1. A `dark` CSS class on any ancestor element (e.g. `<html class="dark">`)
2. A `data-theme="dark"` attribute on any ancestor element

No additional configuration is needed. All built-in node types (text, math, code, diagram, sandbox) respond to the theme change through CSS custom properties:

| Variable            | Light             | Dark              |
|---------------------|-------------------|-------------------|
| `--sp-primary`      | `#3b82f6`         | `#60a5fa`         |
| `--sp-foreground`   | `#1e293b`         | `#f8fafc`         |
| `--sp-muted-fg`     | `#64748b`         | `#94a3b8`         |
| `--sp-muted`        | `#f1f5f9`         | `#1e293b`         |
| `--sp-border`       | `#e2e8f0`         | `#1e293b`         |
| `--sp-card`         | `#f8fafc`         | `#0f172a`         |
| `--sp-card-border`  | `#f0f2f5`         | `#1e293b`         |

## Extending with Custom Node Types

You can register custom node components at runtime using the `RegistryService`. This lets you add new node types without modifying the library source.

### Step 1: Create a Custom Node Component

Your component must accept a `node` input of type `SlideNode`:

```typescript
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from 'smart-player';

@Component({
  selector: 'app-video-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="video-wrapper">
      <video [src]="node().content" controls style="width: 100%; border-radius: 8px;"></video>
    </div>
  `,
})
export class VideoNodeComponent {
  node = input.required<SlideNode>();
}
```

### Step 2: Register It

Inject `RegistryService` and register your component before the player renders:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { RegistryService, SmartPlayerComponent, Slide } from 'smart-player';
import { VideoNodeComponent } from './video-node.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SmartPlayerComponent],
  template: `<sp-smart-player [slide]="slide" />`,
})
export class AppComponent implements OnInit {
  private registry = inject(RegistryService);

  slide: Slide = {
    id: 'demo',
    title: 'Custom Nodes',
    nodes: [
      {
        id: 'v1',
        type: 'video' as any,
        label: 'Tutorial',
        content: 'https://example.com/video.mp4',
      },
    ],
  };

  ngOnInit(): void {
    this.registry.register('video' as any, VideoNodeComponent);
  }
}
```

The player will resolve the component from the registry and render it via `NgComponentOutlet`. The `meta` field on `SlideNode` can carry any additional data your custom node needs.

### `RegistryService` API

| Method                                       | Description                                    |
|----------------------------------------------|------------------------------------------------|
| `register(type: NodeType, component: Type)`  | Register a component for a given node type.    |
| `get(type: NodeType): Type \| undefined`     | Retrieve the component for a node type.        |
| `has(type: NodeType): boolean`               | Check if a node type has a registered component.|
| `getAll(): Map<NodeType, Type>`              | Get a copy of the full registry map.           |

## Built-in Node Components

All node components are exported and can be used independently if needed:

| Component                | Selector            | Description                          |
|--------------------------|---------------------|--------------------------------------|
| `TextNodeComponent`      | `sp-text-node`      | Markdown-like text rendering         |
| `MathNodeComponent`      | `sp-math-node`      | KaTeX math formula rendering         |
| `CodeNodeComponent`      | `sp-code-node`      | Syntax-highlighted code with copy    |
| `DiagramNodeComponent`   | `sp-diagram-node`   | Mermaid diagram rendering            |
| `SandboxNodeComponent`   | `sp-sandbox-node`   | Sandboxed HTML/CSS/JS iframe         |

## Building

```bash
ng build smart-player
```

Build artifacts are placed in the `dist/smart-player` directory.

## Publishing

```bash
cd dist/smart-player
npm publish
```

## License

MIT
