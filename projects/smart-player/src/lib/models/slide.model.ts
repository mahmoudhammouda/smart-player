export type BuiltInNodeType = 'text' | 'math' | 'code' | 'diagram' | 'interactive-sandbox';

export const BUILT_IN_NODE_TYPES: readonly BuiltInNodeType[] = [
  'text', 'math', 'code', 'diagram', 'interactive-sandbox'
] as const;

export type NodeType = string;

export interface SlideNode {
  id: string;
  type: NodeType;
  content: string;
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
