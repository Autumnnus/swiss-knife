"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/api";
import { Check, Clipboard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAction = async (action: "encode" | "decode") => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/text/base64`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Operation failed");
      setOutput(data.data);
      toast.success(`Success!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Input Text / Base64
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full h-40 p-4 font-mono text-sm bg-muted/50 rounded-md border resize-none focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or base64 to decode..."
          />
          <div className="flex gap-4">
            <Button
              onClick={() => handleAction("encode")}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Encode"
              )}
            </Button>
            <Button
              onClick={() => handleAction("decode")}
              variant="secondary"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Decode"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Result</CardTitle>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-40 p-4 font-mono text-sm bg-primary/5 rounded-md border resize-none focus:outline-none"
              readOnly
              value={output}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
