"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/api";
import { Check, Clipboard, FileJson, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/text/json/format`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Formatting failed");
      setOutput(data.data);
      toast.success("JSON formatted successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileJson className="w-4 h-4" /> Input JSON
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-[500px] p-4 font-mono text-sm bg-muted/50 rounded-md border resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={handleFormat}
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Format & Validate"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Output
          </CardTitle>
          {output && (
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-[500px] p-4 font-mono text-sm bg-primary/5 rounded-md border resize-none focus:outline-none"
            readOnly
            value={output}
            placeholder="Formatted JSON will appear here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
