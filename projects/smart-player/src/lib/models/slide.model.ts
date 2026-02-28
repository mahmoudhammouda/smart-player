export type NodeType = 'text' | 'math' | 'code' | 'diagram' | 'interactive-sandbox';

export interface SlideNode {
  id: string;
  type: NodeType;
  content: string;
  language?: string;
  label?: string;
  meta?: Record<string, unknown>;
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
