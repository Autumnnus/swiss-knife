"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { API_URL } from "@/lib/api";
import { Languages, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function OcrComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { status, data, error } = useTaskStatus(taskId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setTaskId(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lang", lang);

    try {
      const response = await fetch(`${API_URL}/visual/ocr`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const res = await response.json();
      setTaskId(res.task_id);
      toast.success("Image uploaded, OCR starting...");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>OCR (Text Extraction)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            file
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/50"
          }`}
        >
          <input
            type="file"
            id="ocr-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <label
            htmlFor="ocr-upload"
            className="cursor-pointer space-y-2 block"
          >
            <Upload
              className={`w-10 h-10 mx-auto ${file ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="text-sm font-medium">
              {file ? file.name : "Upload image to extract text"}
            </div>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2 text-left">
            <label className="text-sm font-medium">Language</label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eng">English</SelectItem>
                <SelectItem value="tur">Turkish</SelectItem>
                <SelectItem value="deu">German</SelectItem>
                <SelectItem value="fra">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            className="mt-7"
            disabled={!file || isUploading || status === "PROCESSING"}
          >
            {isUploading || status === "PROCESSING" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Languages className="w-4 h-4 mr-2" />
            )}
            Extract Text
          </Button>
        </div>

        {status === "SUCCESS" && data?.result?.text && (
          <div className="p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">Extracted Text:</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(data.result.text)}
              >
                Copy Text
              </Button>
            </div>
            <div className="bg-white/50 p-3 rounded text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-blue-100 text-left">
              {data.result.text}
            </div>
          </div>
        )}

        {(status === "FAILURE" || error) && (
          <div className="p-4 bg-red-50 text-red-900 rounded-lg border border-red-200">
            <p className="font-semibold text-sm">Error</p>
            <p className="text-xs">{error || data?.error || "Unknown error"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
