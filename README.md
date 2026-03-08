# SmartPlayer

**Angular 19+ library that renders structured JSON from LLMs into rich, interactive educational content.**

SmartPlayer takes a JSON object (a `Slide`) produced by any LLM and renders it as a continuous, Notion-style document with 30 built-in node types — text, math, code, diagrams, interactive exercises, multimedia, and more.

---

## Table of Contents

- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Slide JSON Schema](#slide-json-schema)
- [Node Types Reference (30)](#node-types-reference)
- [LLM Integration](#llm-integration)
  - [System Prompt Builder](#system-prompt-builder)
  - [Node Dictionary](#node-dictionary)
  - [Usage with OpenAI / Anthropic / Any LLM](#usage-with-openai--anthropic--any-llm)
- [Validation](#validation)
- [Custom Nodes](#custom-nodes)
- [Theming & Dark Mode](#theming--dark-mode)
- [Refine Events](#refine-events)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Development](#development)
- [License](#license)

---

## Quick Start

### 1. Configure registry

SmartPlayer is published on **GitHub Packages**. Add this to your project's `.npmrc`:

```ini
@mahmoudhammouda:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

You need a GitHub personal access token with `read:packages` scope. Set it as the `GITHUB_TOKEN` environment variable, or replace `${GITHUB_TOKEN}` directly in `.npmrc`.

### 2. Install

```bash
npm install @mahmoudhammouda/smart-player
```

### 3. Install peer dependencies

```bash
npm install katex mermaid highlight.js
```

Optional (only if you use those node types):
```bash
npm install smiles-drawer   # chemical-structure nodes
```

### 4. Use in your Angular component

```typescript
import { Component } from '@angular/core';
import { SmartPlayerComponent, Slide } from '@mahmoudhammouda/smart-player';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [SmartPlayerComponent],
  template: `<sp-smart-player [slide]="slide" />`
})
export class LessonComponent {
  slide: Slide = {
    id: 'lesson-1',
    title: 'Introduction to Derivatives',
    nodes: [
      { id: 'n1', type: 'heading', content: 'What is a Derivative?', meta: { level: 1 } },
      { id: 'n2', type: 'text', content: 'A derivative measures **instantaneous rate of change**.' },
      { id: 'n3', type: 'math', content: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
      { id: 'n4', type: 'code', language: 'python', content: 'def derivative(f, x, h=1e-7):\n    return (f(x+h) - f(x)) / h' },
      { id: 'n5', type: 'callout', content: 'The derivative of a constant is always zero.', meta: { variant: 'info', title: 'Remember' } },
    ]
  };
}
```

That's it. SmartPlayer renders the slide as a continuous, styled document.

---

## How It Works

```
┌─────────┐       ┌──────────────┐       ┌──────────────────┐
│   LLM   │──JSON──▶  validateSlide()  │──valid──▶  <sp-smart-player>  │
│ (GPT,   │       │  (Zod-based)       │       │  renders 30 node    │
│ Claude, │       │                    │       │  types as a         │
│  etc.)  │       │  2-layer check:    │       │  continuous doc     │
└─────────┘       │  structure + nodes │       └──────────────────┘
                  └──────────────┘
```

1. **Your app** sends a prompt to any LLM, including the SmartPlayer system prompt
2. **The LLM** returns a `Slide` JSON object
3. **Your app** validates it with `validateSlide()` (optional but recommended)
4. **SmartPlayer** renders it with `<sp-smart-player [slide]="slide" />`

---

## Slide JSON Schema

A `Slide` is the top-level object you pass to `<sp-smart-player>`:

```typescript
interface Slide {
  id: string;          // Unique slide identifier (kebab-case)
  title: string;       // Displayed in the header
  description?: string; // Optional subtitle
  tags?: string[];     // Optional keyword tags
  nodes: SlideNode[];  // Content nodes, rendered top-to-bottom
}
```

Each `SlideNode`:

```typescript
interface SlideNode {
  id: string;          // Unique within the slide
  type: string;        // One of 30 built-in types, or a custom type
  content: any;        // Payload — string, object, or array depending on type
  language?: string;   // For 'code' nodes only (syntax highlighting)
  label?: string;      // Optional section heading / embed label
  meta?: Record<string, unknown>; // Type-specific options
}
```

---

## Node Types Reference

SmartPlayer ships with **30 built-in node types** across 6 categories:

### A — Typography & Structure

| Type | Content | Meta | Description |
|------|---------|------|-------------|
| `text` | Markdown string | — | Rich text with inline `$math$`, **bold**, *italic*, `code`, links |
| `heading` | Heading text | `level`: 1\|2\|3 | Semantic headings (H1/H2/H3) |
| `list` | `string[]` | `ordered`: boolean | Ordered or unordered lists |
| `toggle-list` | `{title, body}[]` | — | Collapsible accordion sections |
| `columns-layout` | `SlideNode[][]` | `columns`: 2\|3 | Multi-column layout with nested nodes |
| `divider` | `""` | `style`: `'line'`\|`'dots'`\|`'stars'` | Visual separator |
| `footnote` | Footnote text | — | Small annotation text |

### B — Pedagogical & Engagement

| Type | Content | Meta | Description |
|------|---------|------|-------------|
| `callout` | Message text | `variant`: `'info'`\|`'warning'`\|`'error'`\|`'tip'`\|`'note'`, `title` | Alert / tip / warning boxes |
| `quote` | Quote text | `author`, `source` | Styled blockquote with attribution |
| `key-concept` | Definition text | `term`: string | Term + definition highlight card |
| `step-by-step` | `{title, description}[]` | — | Numbered timeline steps |
| `checklist` | `{text, checked}[]` | — | Interactive checkbox list |

### C — Scientific & Technical

| Type | Content | Meta | Description |
|------|---------|------|-------------|
| `math` | LaTeX string | — | Rendered via KaTeX (display mode) |
| `code` | Code string | — | Syntax-highlighted code block (uses `language` field) |
| `diagram` | Mermaid syntax | — | Flowcharts, sequence diagrams, ER diagrams, Gantt, etc. |
| `table` | `{headers: string[], rows: string[][]}` | `caption` | Data table |
| `chemical-structure` | SMILES notation | `name`, `theme`: `'light'`\|`'dark'` | Molecular structure via SmilesDrawer |
| `data-board` | `{columns: {title, color?, cards: {title, description?, tags?, priority?}[]}[]}` | — | Kanban-style board |

### D — Multimedia & Integrations

| Type | Content | Meta | Description |
|------|---------|------|-------------|
| `image-caption` | Image URL | `caption`, `alt` | Image with caption (click to zoom) |
| `video-embed` | Video URL | `provider`: `'youtube'`\|`'html5'` | Embedded video player |
| `audio-player` | Audio URL | `title` | Audio player with controls |
| `gallery` | `{url, caption?}[]` | — | Image grid (click to zoom) |
| `web-bookmark` | `{url, title, description?, image?, siteName?, favicon?}` | — | OpenGraph-style link card |
| `file-pdf` | PDF URL | `height`, `title` | Embedded PDF viewer |

### E — Interactive & Evaluation

| Type | Content | Meta | Description |
|------|---------|------|-------------|
| `interactive-sandbox` | HTML/CSS/JS string | — | Isolated iframe sandbox |
| `fill-blanks` | Text with `___answer___` blanks | — | Fill-in-the-blanks exercise |
| `flash-card` | `{front, back}[]` | — | 3D flip cards |

### F — Navigation & Meta

| Type | Content | Meta | Description |
|------|---------|------|-------------|
| `toc` | `{title, level}[]` | — | Table of contents |
| `progress` | Milestone text | `completed`: boolean | Progress indicator |
| `mention` | Label text | `href`, `variant`: `'concept'`\|`'chapter'`\|`'person'`\|`'tag'` | Inline @mention chip |

---

## LLM Integration

SmartPlayer exports everything an LLM needs to generate valid slides.

### System Prompt Builder

The fastest way to integrate — call `buildLlmSystemPrompt()` and inject the result into your LLM's system message:

```typescript
import { buildLlmSystemPrompt } from '@mahmoudhammouda/smart-player';

// Full prompt with all 30 node types and examples
const systemPrompt = buildLlmSystemPrompt();

// Or filter to specific categories
const mathPrompt = buildLlmSystemPrompt({
  categories: ['scientific', 'typography'],
  includeExamples: true,
});
```

Then use it in your LLM call:

```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Create a lesson about photosynthesis for high school students' },
  ],
  response_format: { type: 'json_object' },
});

const slide: Slide = JSON.parse(response.choices[0].message.content);
```

### Node Dictionary

For more control, access the raw dictionary:

```typescript
import { SP_NODE_DICTIONARY, getNodeDefinition } from '@mahmoudhammouda/smart-player';

// Full dictionary (1100-line JSON with all node schemas, examples, and rules)
console.log(SP_NODE_DICTIONARY);

// Get a single node definition
const mathDef = getNodeDefinition('math');
// { description: "...", content: { type: "string", ... }, full_example: {...} }
```

The dictionary includes:
- **Slide structure schema** — top-level `Slide` fields and their types
- **Node base schema** — common fields shared by all nodes
- **30 node type definitions** — each with description, content schema, meta options, and a full example
- **LLM generation rules** — constraints to produce valid output

### Usage with OpenAI / Anthropic / Any LLM

#### OpenAI (GPT-4o)

```typescript
import { buildLlmSystemPrompt, validateSlide, Slide } from '@mahmoudhammouda/smart-player';
import OpenAI from 'openai';

const openai = new OpenAI();
const systemPrompt = buildLlmSystemPrompt();

async function generateLesson(topic: string): Promise<Slide> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create a comprehensive lesson about: ${topic}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const slide = JSON.parse(response.choices[0].message.content!) as Slide;

  // Validate before rendering
  const result = validateSlide(slide);
  if (!result.valid) {
    console.error('Validation errors:', result.issues);
  }

  return slide;
}
```

#### Anthropic (Claude)

```typescript
import { buildLlmSystemPrompt, Slide } from '@mahmoudhammouda/smart-player';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const systemPrompt = buildLlmSystemPrompt();

async function generateLesson(topic: string): Promise<Slide> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      { role: 'user', content: `Create a detailed lesson about: ${topic}. Respond with JSON only.` },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text) as Slide;
}
```

#### Any LLM / Local Model

The system prompt is plain text — it works with any API or local model:

```typescript
import { buildLlmSystemPrompt } from '@mahmoudhammouda/smart-player';

const systemPrompt = buildLlmSystemPrompt();

// Use with Ollama, LM Studio, vLLM, etc.
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3',
    system: systemPrompt,
    prompt: 'Create a lesson about quantum mechanics',
    format: 'json',
  }),
});
```

---

## Validation

SmartPlayer includes a **two-layer Zod-based validation** system:

```typescript
import { validateSlide } from '@mahmoudhammouda/smart-player';

const result = validateSlide(jsonFromLLM);

if (result.valid) {
  // Safe to render
  this.slide = jsonFromLLM;
} else {
  console.log(`Errors: ${result.errorCount}, Warnings: ${result.warningCount}`);
  for (const issue of result.issues) {
    console.log(`[${issue.severity}] ${issue.path}: ${issue.message}`);
    if (issue.hint) console.log(`  Hint: ${issue.hint}`);
  }
}
```

**Layer 1 — Structure validation**: Checks that the JSON matches the `Slide` schema (has `id`, `title`, `nodes` array, each node has `id`, `type`, `content`).

**Layer 2 — Node-specific validation**: For each of the 30 built-in types, checks that `content` and `meta` have the correct shape (e.g., `math` nodes have a string content, `table` nodes have `headers` and `rows`, etc.).

The `ValidationResult` interface:

```typescript
interface ValidationResult {
  valid: boolean;           // true if no errors (warnings are OK)
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
}

interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  path: string;     // e.g. "nodes[2].content"
  message: string;
  hint?: string;    // Suggestion to fix
}
```

---

## Custom Nodes

Extend SmartPlayer with your own node types using the `SP_CUSTOM_NODES` injection token.

### 1. Create a component

```typescript
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { SlideNode } from '@mahmoudhammouda/smart-player';

@Component({
  selector: 'app-quiz-node',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quiz">
      <!-- Your custom rendering logic -->
      <h3>{{ node().label }}</h3>
      <p>{{ node().content }}</p>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class QuizNodeComponent {
  node = input.required<SlideNode>();
}
```

### 2. Register it

```typescript
// app.config.ts
import { SP_CUSTOM_NODES } from '@mahmoudhammouda/smart-player';
import { QuizNodeComponent } from './components/quiz-node.component';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    {
      provide: SP_CUSTOM_NODES,
      useValue: [
        { type: 'quiz', component: QuizNodeComponent, label: 'Quiz' }
      ]
    }
  ]
};
```

### 3. Use it in your slides

```json
{
  "id": "q1",
  "type": "quiz",
  "label": "Check your understanding",
  "content": "..."
}
```

SmartPlayer will automatically render your custom component for any node with `"type": "quiz"`.

---

## Theming & Dark Mode

SmartPlayer uses CSS custom properties. Override them to match your brand:

```css
sp-smart-player {
  --sp-primary: #3b82f6;
  --sp-foreground: #1e293b;
  --sp-muted-fg: #64748b;
  --sp-muted: #f1f5f9;
  --sp-border: #e2e8f0;
  --sp-bg: #ffffff;
  --sp-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

**Dark mode** is automatic — SmartPlayer detects `.dark` class or `data-theme="dark"` on the `<html>` element and adjusts all variables.

---

## Refine Events

Each node can emit a **refine event** when the user clicks the "Refine" button (Ghost UI — visible on hover). This lets you send a specific node back to the LLM for targeted regeneration:

```typescript
import { SmartPlayerComponent, RefineEvent, Slide } from '@mahmoudhammouda/smart-player';

@Component({
  imports: [SmartPlayerComponent],
  template: `
    <sp-smart-player
      [slide]="slide"
      [enableRefine]="true"
      (refine)="onRefine($event)"
    />
  `
})
export class LessonComponent {
  slide!: Slide;

  async onRefine(event: RefineEvent) {
    // event.nodeId — the ID of the node to refine
    // event.node — the full SlideNode object

    const response = await this.llmService.refineNode(event.node);
    // Replace the node in the slide with the improved version
    this.slide = {
      ...this.slide,
      nodes: this.slide.nodes.map(n =>
        n.id === event.nodeId ? response : n
      )
    };
  }
}
```

---

## API Reference

### Components

| Component | Selector | Inputs | Outputs |
|-----------|----------|--------|---------|
| `SmartPlayerComponent` | `sp-smart-player` | `slide: Slide` (required), `enableRefine: boolean` | `refine: RefineEvent` |

### Functions

| Function | Description |
|----------|-------------|
| `buildLlmSystemPrompt(options?)` | Generates a complete system prompt for LLMs. Options: `includeExamples` (boolean), `categories` (string[]) |
| `getNodeDefinition(type)` | Returns the dictionary definition for a single node type |
| `validateSlide(raw)` | Validates a JSON object against the Slide schema. Returns `ValidationResult` |

### Constants & Tokens

| Export | Description |
|--------|-------------|
| `SP_NODE_DICTIONARY` | Full JSON dictionary of all 30 node types with schemas and examples |
| `SP_CUSTOM_NODES` | Angular `InjectionToken` for registering custom node types |
| `BUILT_IN_NODE_TYPES` | Readonly array of all 30 built-in type strings |
| `NODE_VALIDATORS` | Map of node-type-specific validation functions |
| `SlideBaseSchema` | Zod schema for top-level Slide validation |
| `SlideNodeBaseSchema` | Zod schema for individual SlideNode validation |

### Types

```typescript
import type {
  Slide,
  SlideNode,
  NodeType,
  BuiltInNodeType,
  CustomNodeDefinition,
  RefineEvent,
  Scenario,
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
  NodeValidator,
} from '@mahmoudhammouda/smart-player';
```

---

## Project Structure

```
projects/
  smart-player/                   # The library (publishable package)
    src/
      public-api.ts               # All public exports
      lib/
        models/slide.model.ts     # Slide, SlideNode, RefineEvent interfaces
        services/registry.service.ts  # SP_CUSTOM_NODES + RegistryService
        llm-schema/
          index.ts                # buildLlmSystemPrompt(), getNodeDefinition()
          node-dictionary.json    # Complete 30-type dictionary for LLMs
        validation/
          index.ts                # validateSlide()
          slide-schema.ts         # Zod schemas
          node-validators.ts      # Per-node-type validators
          types.ts                # ValidationResult, ValidationIssue
        components/
          smart-player/           # Main orchestrator component
          text-node/              # + 29 other node components
    package.json
    ng-package.json

  demo/                           # Demo application (not part of the library)
    src/app/
      data/mock-scenarios.ts      # Example scenarios
      components/quiz-node.component.ts  # Custom node example
```

---

## Development

```bash
# Serve the demo app (with hot reload)
npx ng serve demo --host 0.0.0.0 --port 5000

# Build the library for distribution
npx ng build smart-player

# The built package is output to dist/smart-player/
```

### Peer Dependencies

| Package | Version | Used By |
|---------|---------|---------|
| `@angular/core` | ^19.0.0 | Core framework |
| `@angular/common` | ^19.0.0 | NgComponentOutlet |
| `katex` | ^0.16.0 | `math` nodes |
| `mermaid` | ^11.0.0 | `diagram` nodes |
| `highlight.js` | ^11.0.0 | `code` nodes |
| `smiles-drawer` | *(optional)* | `chemical-structure` nodes |

---

## License

MIT
