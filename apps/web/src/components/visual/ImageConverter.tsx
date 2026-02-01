"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { API_URL } from "@/lib/api";
import { Download, Loader2, RefreshCcw, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(80);
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
    formData.append("action", "convert");
    formData.append("params", JSON.stringify({ format, quality }));

    try {
      const response = await fetch(`${API_URL}/visual/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const res = await response.json();
      setTaskId(res.task_id);
      toast.success("Image uploaded, conversion started...");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start conversion",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (data?.result?.filename) {
      const downloadUrl = `${API_URL}/download/${encodeURIComponent(data.result.filename)}`;
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Image Converter & Compressor</CardTitle>
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
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer space-y-2 block"
          >
            <Upload
              className={`w-10 h-10 mx-auto ${file ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="text-sm font-medium">
              {file ? file.name : "Click to upload image"}
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webp">WebP</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="avif">AVIF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quality ({quality}%)</label>
            <Input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!file || isUploading || status === "PROCESSING"}
        >
          {isUploading || status === "PROCESSING" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4 mr-2" />
          )}
          {isUploading
            ? "Uploading..."
            : status === "PROCESSING"
              ? "Converting..."
              : "Start Conversion"}
        </Button>

        {status === "SUCCESS" && data?.result && (
          <div className="p-4 bg-green-50 text-green-900 rounded-lg border border-green-200 flex justify-between items-center">
            <div className="min-w-0">
              <p className="font-semibold text-sm">Conversion Ready!</p>
              <p className="text-xs truncate opacity-70">
                {data.result.filename}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 shrink-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
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
