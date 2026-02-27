import { useEffect, useRef } from "react";
import type { SlideNode } from "@shared/schema";

interface MathNodeProps {
  node: SlideNode;
}

export function MathNode({ node }: MathNodeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    import("katex").then((katex) => {
      try {
        katex.default.render(node.content, ref.current!, {
          displayMode: true,
          throwOnError: false,
          strict: false,
          trust: true,
          macros: {
            "\\R": "\\mathbb{R}",
            "\\N": "\\mathbb{N}",
            "\\Z": "\\mathbb{Z}",
          },
        });
      } catch (e) {
        if (ref.current) {
          ref.current.textContent = node.content;
        }
      }
    });
  }, [node.content]);

  return (
    <div className="math-node-wrapper">
      <div ref={ref} className="math-display" />
    </div>
  );
}
