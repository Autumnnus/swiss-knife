"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function VideoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_format", format);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/media/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      const data = await res.json();
      toast.success("Conversion started!");
      pollStatus(data.task_id);
    } catch (error) {
      toast.error("Error starting conversion");
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
          toast.success("Conversion completed!");
        } else if (data.status === "FAILURE") {
          clearInterval(interval);
          setLoading(false);
          toast.error(`Conversion failed: ${data.error}`);
        } else {
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
        <CardTitle>Video Converter</CardTitle>
      </CardHeader>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex items-center gap-4">
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mp3">MP3 (Audio)</SelectItem>
            <SelectItem value="mp4">MP4 (Video)</SelectItem>
            <SelectItem value="wav">WAV (Audio)</SelectItem>
            <SelectItem value="avi">AVI (Video)</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleConvert} disabled={loading || !file}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
          <span className="ml-2">Convert</span>
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
