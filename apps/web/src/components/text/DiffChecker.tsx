"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/api";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DiffChecker() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffHtml, setDiffHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/text/diff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text1, text2 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Diff failed");
      setDiffHtml(data.data);
      toast.success("Comparison complete!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Text 1 (Original)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-80 p-4 font-mono text-sm bg-muted/50 rounded-md border resize-none focus:outline-none"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste original text here..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Text 2 (Modified)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-80 p-4 font-mono text-sm bg-muted/50 rounded-md border resize-none focus:outline-none"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste modified text here..."
            />
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleCompare}
        className="w-full h-12 text-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        ) : (
          <ArrowLeftRight className="w-6 h-6 mr-2" />
        )}
        Compare Text
      </Button>

      {diffHtml && (
        <Card className="animate-in fade-in zoom-in-95 duration-500">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Visual Diff</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="diff-container overflow-auto border rounded-md"
              dangerouslySetInnerHTML={{ __html: diffHtml }}
            />
          </CardContent>
        </Card>
      )}

      <style jsx global>{`
        .diff-container table {
          width: 100%;
          font-family:
            ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          border-collapse: collapse;
        }
        .diff-container td {
          padding: 0.25rem 0.5rem;
        }
        .diff-container .diff_header {
          background-color: #f1f5f9;
          color: #64748b;
          text-align: right;
          width: 1%;
          white-space: nowrap;
          border-right: 1px solid #e2e8f0;
        }
        .diff-container .diff_next {
          display: none;
        }
        .diff-container .diff_add {
          background-color: #dcfce7;
        }
        .diff-container .diff_chg {
          background-color: #fef9c3;
        }
        .diff-container .diff_sub {
          background-color: #fee2e2;
        }
      `}</style>
    </div>
  );
}
