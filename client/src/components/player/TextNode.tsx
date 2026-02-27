import type { SlideNode } from "@shared/schema";

interface TextNodeProps {
  node: SlideNode;
}

function parseInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="inline-code">$1</code>')
    .replace(/\$(.+?)\$/g, '<span class="inline-math">$1</span>');
}

function renderContent(content: string): string {
  const paragraphs = content.split('\n\n');
  return paragraphs.map(para => {
    const trimmed = para.trim();
    if (trimmed.startsWith('1. ') || trimmed.match(/^\d+\. /m)) {
      const items = trimmed.split('\n').map(line => {
        const match = line.match(/^\d+\. (.+)/);
        return match ? `<li>${parseInlineMarkdown(match[1])}</li>` : '';
      }).join('');
      return `<ol class="content-ol">${items}</ol>`;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').map(line => {
        const match = line.match(/^[-*] (.+)/);
        return match ? `<li>${parseInlineMarkdown(match[1])}</li>` : '';
      }).join('');
      return `<ul class="content-ul">${items}</ul>`;
    }
    return `<p class="content-p">${parseInlineMarkdown(trimmed)}</p>`;
  }).join('');
}

export function TextNode({ node }: TextNodeProps) {
  const html = renderContent(node.content);

  return (
    <div
      className="text-node-content prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
