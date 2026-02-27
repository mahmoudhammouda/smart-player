import { useState, useCallback } from "react";
import type { Slide, SlideNode, NodeType } from "@shared/schema";
import { TextNode } from "./TextNode";
import { MathNode } from "./MathNode";
import { CodeNode } from "./CodeNode";
import { DiagramNode } from "./DiagramNode";
import { SandboxNode } from "./SandboxNode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wand2, Tag, BookOpen } from "lucide-react";

type NodeRegistry = {
  [K in NodeType]: React.ComponentType<{ node: SlideNode }>;
};

const NODE_REGISTRY: NodeRegistry = {
  text: TextNode,
  math: MathNode,
  code: CodeNode,
  diagram: DiagramNode,
  "interactive-sandbox": SandboxNode,
};

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  text: "Text",
  math: "Formula",
  code: "Code",
  diagram: "Diagram",
  "interactive-sandbox": "Interactive",
};

const NODE_TYPE_COLORS: Record<NodeType, string> = {
  text: "node-badge-text",
  math: "node-badge-math",
  code: "node-badge-code",
  diagram: "node-badge-diagram",
  "interactive-sandbox": "node-badge-sandbox",
};

interface SmartPlayerProps {
  slide: Slide;
  onRefineNode?: (nodeId: string, node: SlideNode) => void;
}

interface NodeBlockProps {
  node: SlideNode;
  index: number;
  onRefine?: (nodeId: string, node: SlideNode) => void;
}

function NodeBlock({ node, index, onRefine }: NodeBlockProps) {
  const Component = NODE_REGISTRY[node.type];
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = useCallback(async () => {
    setIsRefining(true);
    onRefine?.(node.id, node);
    await new Promise((r) => setTimeout(r, 1200));
    setIsRefining(false);
  }, [node, onRefine]);

  if (!Component) return null;

  return (
    <div
      className="node-block"
      style={{ animationDelay: `${index * 80}ms` }}
      data-testid={`node-block-${node.id}`}
    >
      <div className="node-block-header">
        <div className="node-block-meta">
          <span className={`node-type-badge ${NODE_TYPE_COLORS[node.type]}`}>
            {NODE_TYPE_LABELS[node.type]}
          </span>
          {node.label && (
            <span className="node-label" data-testid={`node-label-${node.id}`}>
              {node.label}
            </span>
          )}
        </div>
        {onRefine && (
          <Button
            size="sm"
            variant="ghost"
            className="refine-btn"
            onClick={handleRefine}
            disabled={isRefining}
            data-testid={`button-refine-${node.id}`}
          >
            <Wand2 className={`w-3.5 h-3.5 ${isRefining ? "animate-spin" : ""}`} />
            <span>{isRefining ? "Refining…" : "Refine"}</span>
          </Button>
        )}
      </div>
      <div className="node-block-body">
        <Component node={node} />
      </div>
    </div>
  );
}

export function SmartPlayer({ slide, onRefineNode }: SmartPlayerProps) {
  return (
    <div className="smart-player">
      <div className="player-slide-header">
        <div className="player-slide-title-row">
          <BookOpen className="w-5 h-5 text-primary shrink-0" />
          <h1 className="player-slide-title" data-testid="player-slide-title">
            {slide.title}
          </h1>
        </div>
        {slide.description && (
          <p className="player-slide-description">{slide.description}</p>
        )}
        {slide.tags && slide.tags.length > 0 && (
          <div className="player-tags">
            <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {slide.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="player-tag" data-testid={`tag-${tag}`}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="player-nodes" data-testid="player-nodes">
        {slide.nodes.map((node, index) => (
          <NodeBlock
            key={node.id}
            node={node}
            index={index}
            onRefine={onRefineNode}
          />
        ))}
      </div>
    </div>
  );
}
