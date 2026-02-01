"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { API_URL } from "@/lib/api";
import { Download, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ConverterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("mp3");
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
      // Manual fetch as apiClient might not handle FormData seamlessly without adjustments
      const response = await fetch(`${API_URL}/media/convert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const res = await response.json();
      setTaskId(res.task_id);
      toast.success("File uploaded, conversion started...");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start conversion";
      toast.error(message);
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
        <CardTitle>Media Converter</CardTitle>
        <CardDescription>
          Upload video/audio and convert to other formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              accept="video/*,audio/*"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer space-y-2 block"
            >
              <Upload
                className={`w-10 h-10 mx-auto ${file ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="text-sm font-medium">
                {file ? file.name : "Click to upload or drag and drop"}
              </div>
              <p className="text-xs text-muted-foreground">
                MP4, MKV, AVI, MP3, WAV, etc.
              </p>
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium shrink-0">Convert to:</span>
              <Select value={targetFormat} onValueChange={setTargetFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Target Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3 (Audio)</SelectItem>
                  <SelectItem value="mp4">MP4 (Video)</SelectItem>
                  <SelectItem value="wav">WAV (Audio)</SelectItem>
                  <SelectItem value="mkv">MKV (Video)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!file || isUploading || status === "PROCESSING"}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : status === "PROCESSING" ? (
                "Converting..."
              ) : (
                "Start Conversion"
              )}
            </Button>
          </div>
        </form>

        {status === "PROCESSING" && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {data?.step === "converting"
                  ? "Converting file..."
                  : "Queued..."}
              </span>
              <span>Please wait</span>
            </div>
            <Progress value={45} className="h-1 animate-pulse" />
          </div>
        )}

        {status === "SUCCESS" && data?.result && (
          <div className="mt-6 p-4 bg-green-50 text-green-900 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
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
          </div>
        )}

        {(status === "FAILURE" || error) && (
          <div className="mt-6 p-4 bg-red-50 text-red-900 rounded-lg border border-red-200">
            <p className="font-semibold text-sm">Conversion Failed</p>
            <p className="text-xs opacity-70">
              {error || data?.error || "Unknown error"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
