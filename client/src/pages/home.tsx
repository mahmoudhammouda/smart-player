import { Link } from "wouter";
import { MOCK_SCENARIOS } from "@/data/mock-scenarios";
import { ArrowRight, Layers, Sparkles, BookOpen, Code2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-badge">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agentic LMS Content Engine</span>
        </div>
        <h1 className="home-hero-title">
          <span className="home-hero-gradient">SmartPlayer</span>
        </h1>
        <p className="home-hero-subtitle">
          A modular content renderer for LLM-generated educational material.
          Supports math formulas, interactive code, diagrams, and sandboxed experiments.
        </p>
        <div className="home-hero-actions">
          <Button asChild size="lg" data-testid="button-start-exploring">
            <Link href={`/scenario/${MOCK_SCENARIOS[0].id}`}>
              Start Exploring
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" data-testid="button-load-json">
            <Link href="/upload">Load Custom JSON</Link>
          </Button>
        </div>
      </div>

      <div className="home-features">
        {[
          { icon: BookOpen, title: "Rich Text Rendering", desc: "Markdown-aware paragraphs, lists, and inline formatting with proper typographic hierarchy." },
          { icon: "∑", title: "KaTeX Mathematics", desc: "Beautiful typeset equations using KaTeX — display mode, inline, and complex LaTeX expressions." },
          { icon: Code2, title: "Syntax Highlighting", desc: "Highlight.js powered code blocks with copy functionality and language detection." },
          { icon: "◇", title: "Mermaid Diagrams", desc: "Flowcharts, sequence diagrams, and graph visualizations rendered from text definitions." },
          { icon: FlaskConical, title: "Interactive Sandboxes", desc: "Isolated iframe-based sandboxes for running HTML/CSS/JS experiments safely." },
          { icon: Sparkles, title: "Node Refinement", desc: "Send individual content blocks back to an LLM agent for targeted regeneration." },
        ].map((feat, i) => (
          <div key={i} className="home-feature-card" data-testid={`feature-card-${i}`}>
            <div className="home-feature-icon">
              {typeof feat.icon === "string" ? (
                <span className="text-lg font-bold text-primary">{feat.icon}</span>
              ) : (
                <feat.icon className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="home-feature-body">
              <h3 className="home-feature-title">{feat.title}</h3>
              <p className="home-feature-desc">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="home-scenarios-section">
        <h2 className="home-section-title">Demo Scenarios</h2>
        <div className="home-scenarios-grid">
          {MOCK_SCENARIOS.map((s) => (
            <Link key={s.id} href={`/scenario/${s.id}`} data-testid={`scenario-card-${s.id}`}>
              <div className="home-scenario-card hover-elevate">
                <div className="home-scenario-icon">{s.icon}</div>
                <div className="home-scenario-body">
                  <h3 className="home-scenario-name">{s.name}</h3>
                  <p className="home-scenario-desc">{s.description}</p>
                </div>
                <ArrowRight className="home-scenario-arrow w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
