"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { API_URL, apiClient } from "@/lib/api";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function YouTubeForm() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { status, data, error } = useTaskStatus(taskId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTaskId(null);

    try {
      const res = await apiClient<{ task_id: string }>(`/media/download`, {
        method: "POST",
        body: JSON.stringify({ url, format }),
      });
      setTaskId(res.task_id);
      toast.info("Download started...");
    } catch (err: any) {
      toast.error(err.message || "Failed to start download");
      setIsLoading(false);
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
        <CardTitle>YouTube Downloader</CardTitle>
        <CardDescription>Download videos or audio from YouTube</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Paste YouTube URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4 (Video)</SelectItem>
                <SelectItem value="mp3">MP3 (Audio)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={
                isLoading && status !== "SUCCESS" && status !== "FAILURE"
              }
              className="flex-1"
            >
              {isLoading && status !== "SUCCESS" && status !== "FAILURE"
                ? "Processing..."
                : "Download"}
            </Button>
          </div>
        </form>

        {status === "PROCESSING" && (
          <div className="mt-4 text-sm text-muted-foreground animate-pulse">
            Processing: {data?.step || "Please wait..."}
          </div>
        )}

        {status === "SUCCESS" && data?.result && (
          <div className="mt-4 p-4 bg-green-50 text-green-900 rounded-md border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Download Complete!</p>
                <p className="text-sm truncate max-w-[250px]">
                  {data.result.title}
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Get File
              </Button>
            </div>
          </div>
        )}

        {(status === "FAILURE" || error) && (
          <div className="mt-4 p-4 bg-red-50 text-red-900 rounded-md border border-red-200">
            <p className="font-semibold">Error</p>
            <p className="text-sm">
              {data?.error || error || "Unknown error occurred"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
