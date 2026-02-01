"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { API_URL } from "@/lib/api";
import { Download, Film, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function GifGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { status, data, error } = useTaskStatus(taskId);

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fps", fps.toString());
    formData.append("width", width.toString());

    try {
      setIsUploading(true);
      setTaskId(null);
      const res = await fetch(`${API_URL}/media/gif`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      const resData = await res.json();
      setTaskId(resData.task_id);
      toast.success("GIF creation started!");
    } catch (error) {
      toast.error("Error starting GIF creation");
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
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>GIF Generator</CardTitle>
      </CardHeader>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex gap-4">
        <div className="space-y-1">
          <span className="text-sm font-medium">FPS</span>
          <Input
            type="number"
            value={fps}
            onChange={(e) => setFps(parseInt(e.target.value))}
            min={1}
            max={30}
          />
        </div>
        <div className="space-y-1">
          <span className="text-sm font-medium">Width (px)</span>
          <Input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            min={100}
            max={1920}
          />
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isUploading || status === "PROCESSING" || !file}
        className="w-full"
      >
        {isUploading || status === "PROCESSING" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Film className="w-4 h-4" />
        )}
        <span className="ml-2">
          {isUploading
            ? "Uploading..."
            : status === "PROCESSING"
              ? "Creating GIF..."
              : "Create GIF"}
        </span>
      </Button>

      {status === "PROCESSING" && (
        <div className="space-y-2">
          <Progress value={45} className="animate-pulse" />
          <p className="text-sm text-muted-foreground text-center">
            Processing: {data?.step || "Please wait..."}
          </p>
        </div>
      )}

      {status === "SUCCESS" && data?.result && (
        <div className="mt-4 p-4 bg-green-50 text-green-900 rounded-md border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm">GIF Ready!</p>
              <p className="text-xs truncate max-w-[200px]">
                {data.result.filename}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}

      {(status === "FAILURE" || error) && (
        <div className="mt-4 p-4 bg-red-50 text-red-900 rounded-md border border-red-200">
          <p className="font-semibold text-sm">Error</p>
          <p className="text-xs">{error || data?.error || "Unknown error"}</p>
        </div>
      )}
    </div>
  );
}
