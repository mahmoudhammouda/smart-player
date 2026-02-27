import { useEffect, useRef, useState } from "react";
import type { SlideNode } from "@shared/schema";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeNodeProps {
  node: SlideNode;
}

export function CodeNode({ node }: CodeNodeProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    import("highlight.js").then((hljs) => {
      if (!ref.current) return;
      const lang = node.language || "plaintext";
      try {
        const result = hljs.default.highlight(node.content, { language: lang, ignoreIllegals: true });
        ref.current.innerHTML = result.value;
      } catch {
        ref.current.textContent = node.content;
      }
    });
  }, [node.content, node.language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(node.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-node-wrapper">
      <div className="code-header">
        <div className="code-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="code-lang-badge">{node.language || "text"}</span>
        <Button
          size="icon"
          variant="ghost"
          className="copy-btn"
          onClick={handleCopy}
          data-testid="button-copy-code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
      </div>
      <div className="code-scroll">
        <pre className="code-pre">
          <code ref={ref} className={`language-${node.language || "plaintext"}`}>
            {node.content}
          </code>
        </pre>
      </div>
    </div>
  );
}
