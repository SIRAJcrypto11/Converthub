"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Download, Copy, Check, FileCode, Layers, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FLOWCHART = `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Re-check setup]
    D --> B`;

const SEQUENCE = `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`;

const GANTT = `gantt
    title A Gantt Diagram
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1  , 20d`;

const PIE = `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`;

const templates = [
  { id: "flowchart", name: "Flowchart", code: FLOWCHART },
  { id: "sequence", name: "Sequence Diagram", code: SEQUENCE },
  { id: "gantt", name: "Gantt Chart", code: GANTT },
  { id: "pie", name: "Pie Chart", code: PIE },
];

export default function MarkdownToGraphPage() {
  const [code, setCode] = useState(FLOWCHART);
  const [svg, setSvg] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const renderCounter = useRef(0);

  const renderGraph = useCallback(async () => {
    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "inherit",
      });
      renderCounter.current += 1;
      const id = "mermaid-graph-" + renderCounter.current;
      const { svg: renderedSvg } = await mermaid.render(id, code);
      setSvg(renderedSvg);
      setIsError(false);
      setErrorMessage("");
    } catch (err: any) {
      console.error("MERMAID_RENDER_ERROR", err);
      setIsError(true);
      setErrorMessage("Check your Mermaid syntax for errors.");
    }
  }, [code]);

  useEffect(() => {
    const timeout = setTimeout(renderGraph, 300);
    return () => clearTimeout(timeout);
  }, [renderGraph]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSVG = async () => {
    if (isError || !svg) return;
    const { downloadFile } = await import("@/lib/download");
    await downloadFile(svg, "converthub_graph.svg", "image/svg+xml");
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto font-jakarta">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <BarChart3 className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Markdown to Graph</h1>
        </div>
        <p className="text-muted-foreground text-lg">Turn Mermaid syntax into stunning visualizations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-card border rounded-[2rem] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <FileCode className="w-4 h-4 text-primary" /> Editor
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 p-4 bg-secondary/30 rounded-2xl outline-none font-mono text-sm leading-relaxed border focus:border-primary/50 transition-all"
              placeholder="Enter Mermaid code..."
            />

            <div>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Quick Templates
              </p>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setCode(t.code); setErrorMessage(""); }}
                    className="px-3 py-2 bg-secondary/50 hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all border border-transparent hover:border-primary/20 hover:-translate-y-0.5"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex gap-4 text-sm">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              Supports Flowcharts, Sequence Diagrams, Gantt Charts, Pie Charts, and more using{" "}
              <a href="https://mermaid.js.org/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">Mermaid.js</a> syntax.
            </p>
          </div>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex-grow bg-white border rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[500px] flex items-center justify-center p-12 group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
            <AnimatePresence mode="wait">
              {isError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-8 bg-red-50 rounded-3xl border border-red-100 shadow-inner max-w-xs"
                >
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-black mb-2 uppercase tracking-widest text-xs">Syntax Error!</p>
                  <p className="text-red-400 text-sm font-medium">{errorMessage || "Check your Mermaid code for errors."}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex items-center justify-center overflow-auto"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              )}
            </AnimatePresence>

            {!isError && svg && (
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-teal-500/10 text-teal-600 text-[10px] font-bold px-3 py-1 rounded-full border border-teal-500/20 backdrop-blur-sm">Ready to export</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={downloadSVG}
              disabled={isError || !svg}
              className="py-5 bg-teal-500 text-white rounded-[2rem] font-extrabold text-xl shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" /> Download SVG
            </button>
            <button
              onClick={handleCopy}
              className="py-5 bg-secondary text-secondary-foreground rounded-[2rem] font-bold text-xl hover:bg-secondary/80 transition-all border active:scale-[0.98]"
            >
              <Copy className="w-6 h-6" /> Copy Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
