import { useState, useCallback } from "react";
import { SmartPlayer } from "@/components/player/SmartPlayer";
import { slideSchema } from "@shared/schema";
import type { Slide } from "@shared/schema";
import { Upload, FileJson, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [slide, setSlide] = useState<Slide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const parseJSON = useCallback((text: string) => {
    try {
      const raw = JSON.parse(text);
      const result = slideSchema.safeParse(raw);
      if (!result.success) {
        setError("Invalid slide format: " + result.error.issues[0]?.message);
        setSlide(null);
        return;
      }
      setSlide(result.data);
      setError(null);
    } catch {
      setError("Invalid JSON — please check your file format.");
      setSlide(null);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".json")) {
      setError("Please upload a .json file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonText(text);
      parseJSON(text);
    };
    reader.readAsText(file);
  }, [parseJSON]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleTextParse = () => {
    if (jsonText.trim()) parseJSON(jsonText);
  };

  const reset = () => {
    setSlide(null);
    setError(null);
    setJsonText("");
  };

  const EXAMPLE_JSON: Slide = {
    id: "example-1",
    title: "My Custom Lesson",
    description: "A lesson with text and math",
    tags: ["example"],
    nodes: [
      { id: "n1", type: "text", label: "Introduction", content: "This is a **text node** with *markdown* support." },
      { id: "n2", type: "math", label: "Euler's Identity", content: "e^{i\\pi} + 1 = 0" },
      { id: "n3", type: "code", language: "javascript", label: "Hello World", content: 'console.log("Hello, World!");' },
    ],
  };

  if (slide) {
    return (
      <div className="upload-result-page">
        <div className="upload-result-header">
          <div>
            <h2 className="upload-result-title">Loaded: {slide.title}</h2>
            <p className="upload-result-meta">{slide.nodes.length} node{slide.nodes.length !== 1 ? "s" : ""}</p>
          </div>
          <Button variant="outline" size="sm" onClick={reset} data-testid="button-reset-upload">
            <X className="w-4 h-4 mr-1" />
            Load Another
          </Button>
        </div>
        <SmartPlayer slide={slide} onRefineNode={() => {}} />
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-page-header">
        <h1 className="upload-title">Load Custom JSON</h1>
        <p className="upload-subtitle">
          Upload a slide JSON file or paste JSON directly to preview it in the SmartPlayer.
        </p>
      </div>

      <div
        className={`upload-dropzone ${dragging ? "dropzone-active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        data-testid="upload-dropzone"
      >
        <FileJson className="w-10 h-10 text-muted-foreground mb-3" />
        <p className="dropzone-main-text">Drop a JSON file here</p>
        <p className="dropzone-sub-text">or</p>
        <label htmlFor="file-upload">
          <Button asChild variant="outline" size="sm" data-testid="button-browse-file">
            <span>
              <Upload className="w-3.5 h-3.5 mr-2" />
              Browse Files
            </span>
          </Button>
        </label>
        <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleFileInput} />
      </div>

      <div className="upload-divider">
        <span className="upload-divider-text">or paste JSON</span>
      </div>

      <div className="upload-paste-area">
        <textarea
          className="upload-textarea"
          placeholder='{"id": "...", "title": "...", "nodes": [...]}'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={8}
          data-testid="input-json-paste"
        />
        <Button
          onClick={handleTextParse}
          disabled={!jsonText.trim()}
          data-testid="button-parse-json"
        >
          Preview Slide
        </Button>
      </div>

      {error && (
        <div className="upload-error" data-testid="upload-error">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="upload-example">
        <h3 className="upload-example-title">Expected Format</h3>
        <pre className="upload-example-code">
          {JSON.stringify(EXAMPLE_JSON, null, 2)}
        </pre>
      </div>
    </div>
  );
}
