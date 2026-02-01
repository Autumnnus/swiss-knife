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
import { API_URL } from "@/lib/api";
import { Download, Loader2, RefreshCcw, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TaskResult {
  filename?: string;
  [key: string]: any;
}

interface TaskInfo {
  task_id: string;
  filename: string;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILURE";
  result?: TaskResult;
}

export function BatchProcessor() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [format, setFormat] = useState("webp");
  const [isUploading, setIsUploading] = useState(false);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("action", "convert");
    formData.append("params", JSON.stringify({ format }));

    try {
      const response = await fetch(`${API_URL}/visual/batch-process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Batch upload failed");

      const data = await response.json();
      const newTasks: TaskInfo[] = data.tasks.map((t: any) => ({
        task_id: t.task_id,
        filename: t.filename,
        status: "PENDING",
      }));
      setTasks(newTasks);
      toast.success(`Batch started for ${files.length} images!`);

      // Monitor tasks
      newTasks.forEach((t) => monitorTask(t.task_id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setIsUploading(false);
    }
  };

  const monitorTask = async (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/tasks/${taskId}`);
        const data = await res.json();

        setTasks((prev) =>
          prev.map((t) =>
            t.task_id === taskId
              ? { ...t, status: data.status, result: data.result }
              : t,
          ),
        );

        if (data.status === "SUCCESS" || data.status === "FAILURE") {
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleDownload = (filename: string) => {
    const downloadUrl = `${API_URL}/download/${encodeURIComponent(filename)}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Batch Image Processor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-muted-foreground/20 hover:border-primary/50">
          <input
            type="file"
            id="batch-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
          <label
            htmlFor="batch-upload"
            className="cursor-pointer space-y-2 block"
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
            <div className="text-sm font-medium">
              {files
                ? `${files.length} files selected`
                : "Click to upload multiple images"}
            </div>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Target Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webp">WebP</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!files || isUploading}
            className="mt-7"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4 mr-2" />
            )}
            Start Batch
          </Button>
        </div>

        {tasks.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto pt-4 border-t">
            {tasks.map((task) => (
              <div
                key={task.task_id}
                className="flex items-center justify-between p-2 bg-muted rounded text-sm"
              >
                <span className="truncate flex-1 mr-2">{task.filename}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium ${
                      task.status === "SUCCESS"
                        ? "text-green-600"
                        : task.status === "FAILURE"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {task.status}
                  </span>
                  {task.status === "SUCCESS" && task.result?.filename && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleDownload(task.result.filename)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
