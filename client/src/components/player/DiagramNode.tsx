import { useEffect, useRef, useState } from "react";
import type { SlideNode } from "@shared/schema";

interface DiagramNodeProps {
  node: SlideNode;
}

let mermaidInitialized = false;

export function DiagramNode({ node }: DiagramNodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const id = `mermaid-${node.id}-${Date.now()}`;
    ref.current.innerHTML = "";

    import("mermaid").then(async (mod) => {
      const mermaid = mod.default;

      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
          themeVariables: {
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
          },
          flowchart: { curve: "basis", htmlLabels: true },
        });
        mermaidInitialized = true;
      }

      try {
        const { svg } = await mermaid.render(id, node.content);
        if (ref.current) {
          ref.current.innerHTML = svg;
          const svgEl = ref.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        }
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Diagram render error");
        const errEl = document.getElementById(id);
        if (errEl) errEl.remove();
      }
    });
  }, [node.content, node.id]);

  return (
    <div className="diagram-node-wrapper">
      {error ? (
        <div className="diagram-error">
          <span className="diagram-error-label">Diagram Error</span>
          <pre className="diagram-error-text">{error}</pre>
        </div>
      ) : (
        <div ref={ref} className="diagram-render" />
      )}
    </div>
  );
}
