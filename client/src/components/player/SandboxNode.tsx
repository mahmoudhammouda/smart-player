import { useEffect, useRef } from "react";
import type { SlideNode } from "@shared/schema";

interface SandboxNodeProps {
  node: SlideNode;
}

export function SandboxNode({ node }: SandboxNodeProps) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const iframe = ref.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; overflow: auto; }
</style>
</head>
<body>
${node.content}
</body>
</html>`);
    doc.close();
  }, [node.content]);

  return (
    <div className="sandbox-node-wrapper">
      <div className="sandbox-indicator">
        <span className="sandbox-badge">Interactive Sandbox</span>
      </div>
      <iframe
        ref={ref}
        title={`sandbox-${node.id}`}
        className="sandbox-frame"
        sandbox="allow-scripts allow-same-origin"
        scrolling="no"
        data-testid={`sandbox-frame-${node.id}`}
      />
    </div>
  );
}
