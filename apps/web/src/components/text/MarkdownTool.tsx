"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/api";
import { Download, Eye, Loader2, Pen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function MarkdownTool() {
  const [input, setInput] = useState("# My Document\n\nHello **world**!");
  const [htmlPreview, setHtmlPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const handleConvert = async (target: "html" | "pdf") => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/text/markdown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input, target }),
      });
      const res = await response.json();
      if (!response.ok) throw new Error(res.detail || "Conversion failed");

      if (target === "html") {
        setHtmlPreview(res.data);
        setMode("preview");
        toast.success("Preview generated!");
      } else {
        const downloadUrl = `${API_URL}/download/${res.filename}`;
        window.open(downloadUrl, "_blank");
        toast.success("PDF downloading...");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex gap-2 justify-end">
        <Button
          variant={mode === "edit" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("edit")}
        >
          <Pen className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button
          variant={mode === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => handleConvert("html")}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Eye className="w-4 h-4 mr-2" />
          )}
          Preview
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mode === "edit" ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Markdown Input
              </CardTitle>
              <Button
                onClick={() => handleConvert("pdf")}
                disabled={isLoading}
                variant="secondary"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-[600px] p-4 font-mono text-sm bg-muted/50 rounded-md border resize-none focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="# Type your markdown here..."
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Rendered HTML
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none h-[600px] overflow-auto p-8 border rounded-md bg-white"
                dangerouslySetInnerHTML={{ __html: htmlPreview }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
