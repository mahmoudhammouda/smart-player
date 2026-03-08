# smart-player v1.0.0 — Release Notes

**Date** : 2026-03-08

## Nouveautés

### 30 types de noeuds intégrés

| Catégorie | Types |
|-----------|-------|
| Typographie | `text`, `heading`, `list`, `divider`, `footnote`, `toggle-list`, `columns-layout` |
| Pédagogique | `callout`, `quote`, `key-concept`, `step-by-step`, `checklist` |
| Scientifique | `math` (KaTeX), `code` (Highlight.js), `diagram` (Mermaid), `table`, `chemical-structure` (SmilesDrawer), `data-board` |
| Multimédia | `image-caption`, `video-embed`, `audio-player`, `gallery`, `web-bookmark`, `file-pdf` |
| Interactif | `interactive-sandbox`, `fill-blanks`, `flash-card` |
| Navigation | `toc`, `progress`, `mention` |

### Dictionnaire LLM & System Prompt

- `SP_NODE_DICTIONARY` : dictionnaire JSON complet des 30 types avec schéma, exemples et contraintes
- `getNodeDefinition(type)` : récupère la définition d'un type de noeud
- `buildLlmSystemPrompt(options?)` : génère un system prompt prêt à l'emploi pour GPT/Claude/Gemini

### Validation JSON

- `validateSlide(raw)` : validation en 2 couches (structure Zod + validateurs par type)
- `NODE_VALIDATORS` : registre de 30 fonctions de validation
- Retourne `{ valid, issues[], errorCount, warningCount, infoCount }`

### Extension via injection

- `SP_CUSTOM_NODES` : token d'injection pour enregistrer des composants personnalisés
- Chaque composant custom reçoit un `input.required<SlideNode>()`

### Architecture

- Angular 19+ standalone (pas de NgModule)
- ChangeDetectionStrategy.OnPush partout
- CSS variables thémables (`--sp-foreground`, `--sp-primary`, etc.)
- Support dark mode via `:host-context(.dark)`
- Lazy loading des libs externes (KaTeX, Mermaid, Highlight.js, SmilesDrawer)

## Installation

```bash
tar xzf smart-player-1.0.0.tar.gz -C ./smart-player
npm install ./smart-player
```

## Utilisation minimale

```typescript
import { SmartPlayerComponent } from 'smart-player';

@Component({
  imports: [SmartPlayerComponent],
  template: `<sp-smart-player [slide]="slide" />`
})
export class AppComponent {
  slide = { id: 's1', title: 'Hello', nodes: [{ id: 'n1', type: 'text', content: 'World' }] };
}
```
