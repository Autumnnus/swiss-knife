"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/media/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Failed to start download");

      const data = await res.json();
      setTaskId(data.task_id);
      toast.success("Download started!");

      // Start polling for status
      pollStatus(data.task_id);
    } catch (error) {
      toast.error("Error starting download");
      setLoading(false);
    }
  };

  const pollStatus = async (mid: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/tasks/${mid}`);
        const data = await res.json();

        if (data.status === "SUCCESS") {
          clearInterval(interval);
          setLoading(false);
          setProgress(100);
          toast.success("Download completed!");
          setTaskId(null);
        } else if (data.status === "FAILURE") {
          clearInterval(interval);
          setLoading(false);
          toast.error(`Download failed: ${data.error}`);
          setTaskId(null);
        } else {
          // Simulate progress or use data.step
          setProgress((prev) => (prev < 90 ? prev + 5 : prev));
        }
      } catch (e) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>Video Downloader</CardTitle>
      </CardHeader>
      <div className="flex gap-2">
        <Input
          placeholder="Paste URL (YouTube, Twitter, Instagram...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleDownload} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="ml-2">Download</span>
        </Button>
      </div>

      {loading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-center">
            Processing...
          </p>
        </div>
      )}
    </div>
  );
}
