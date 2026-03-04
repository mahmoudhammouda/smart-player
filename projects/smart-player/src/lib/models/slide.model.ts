export type BuiltInNodeType =
  | 'text' | 'math' | 'code' | 'diagram' | 'interactive-sandbox'
  | 'heading' | 'list' | 'divider' | 'footnote'
  | 'callout' | 'quote' | 'key-concept' | 'step-by-step'
  | 'table' | 'image-caption' | 'video-embed' | 'audio-player' | 'gallery'
  | 'fill-blanks' | 'flash-card' | 'toc' | 'progress'
  | 'toggle-list' | 'columns-layout' | 'checklist' | 'data-board'
  | 'chemical-structure' | 'web-bookmark' | 'file-pdf' | 'mention';

export const BUILT_IN_NODE_TYPES: readonly BuiltInNodeType[] = [
  'text', 'math', 'code', 'diagram', 'interactive-sandbox',
  'heading', 'list', 'divider', 'footnote',
  'callout', 'quote', 'key-concept', 'step-by-step',
  'table', 'image-caption', 'video-embed', 'audio-player', 'gallery',
  'fill-blanks', 'flash-card', 'toc', 'progress',
  'toggle-list', 'columns-layout', 'checklist', 'data-board',
  'chemical-structure', 'web-bookmark', 'file-pdf', 'mention',
] as const;

export type NodeType = string;

export interface SlideNode {
  id: string;
  type: NodeType;
  content: any;
  language?: string;
  label?: string;
  meta?: Record<string, unknown>;
}

export interface CustomNodeDefinition {
  type: string;
  component: import('@angular/core').Type<unknown>;
  label?: string;
}

export interface Slide {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  nodes: SlideNode[];
}

export interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  slide: Slide;
}

export interface RefineEvent {
  nodeId: string;
  node: SlideNode;
}
