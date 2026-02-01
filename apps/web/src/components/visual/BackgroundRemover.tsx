"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { API_URL } from "@/lib/api";
import { Download, Loader2, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
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

    try {
      const response = await fetch(`${API_URL}/visual/remove-bg`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const res = await response.json();
      setTaskId(res.task_id);
      toast.success("Image uploaded, background removal started...");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
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
        <CardTitle>AI Background Remover</CardTitle>
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
            id="bg-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <label htmlFor="bg-upload" className="cursor-pointer space-y-2 block">
            <Upload
              className={`w-10 h-10 mx-auto ${file ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="text-sm font-medium">
              {file ? file.name : "Upload image to remove background"}
            </div>
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!file || isUploading || status === "PROCESSING"}
        >
          {isUploading || status === "PROCESSING" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {isUploading
            ? "Uploading..."
            : status === "PROCESSING"
              ? "Processing..."
              : "Remove Background"}
        </Button>

        {status === "SUCCESS" && data?.result && (
          <div className="p-4 bg-green-50 text-green-900 rounded-lg border border-green-200 flex justify-between items-center">
            <div className="min-w-0 text-left">
              <p className="font-semibold text-sm">Background Removed!</p>
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
