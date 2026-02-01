"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { API_URL } from "@/lib/api";
import { Download, Languages, Loader2, RotateCw, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ImageTools() {
  const [file, setFile] = useState<File | null>(null);
  const [action, setAction] = useState("grayscale");
  const [lang, setLang] = useState("eng");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { status, data, error } = useTaskStatus(taskId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setTaskId(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("action", action);
    formData.append("params", JSON.stringify({})); // Can expand with width/height later

    try {
      const response = await fetch(`${API_URL}/media/image/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Processing failed");

      const res = await response.json();
      setTaskId(res.task_id);
      toast.success("Image uploaded, processing started...");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOCR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setTaskId(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lang", lang);

    try {
      const response = await fetch(`${API_URL}/media/image/ocr`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("OCR failed");

      const res = await response.json();
      setTaskId(res.task_id);
      toast.success("Image uploaded, OCR started...");
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Tools</CardTitle>
          <CardDescription>
            Process images with Pillow or extract text with Tesseract OCR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              file
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              id="image-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer space-y-2 block"
            >
              <Upload
                className={`w-10 h-10 mx-auto ${file ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="text-sm font-medium">
                {file ? file.name : "Click to upload an image"}
              </div>
            </label>
          </div>

          <Tabs defaultValue="edit">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit / Process</TabsTrigger>
              <TabsTrigger value="ocr">OCR (Text Extraction)</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                    <SelectItem value="rotate">Rotate 90°</SelectItem>
                    <SelectItem value="resize">Resize (Auto 800px)</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleProcess}
                  disabled={!file || isUploading || status === "PROCESSING"}
                  className="shrink-0"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Process
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ocr" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng">English</SelectItem>
                    <SelectItem value="tur">Turkish</SelectItem>
                    <SelectItem value="deu">German</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleOCR}
                  disabled={!file || isUploading || status === "PROCESSING"}
                  className="shrink-0"
                  variant="secondary"
                >
                  <Languages className="w-4 h-4 mr-2" />
                  Extract Text
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {status === "PROCESSING" && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing: {data?.step || "Working..."}
            </div>
          )}

          {status === "SUCCESS" && data?.result && (
            <div className="mt-6 space-y-4">
              {data.result.filename ? (
                <div className="p-4 bg-green-50 text-green-900 rounded-lg border border-green-200 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">Image Ready!</p>
                    <p className="text-xs truncate">{data.result.filename}</p>
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
              ) : data.result.text ? (
                <div className="p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">Extracted Text:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(data.result.text)}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="bg-white/50 p-3 rounded text-sm font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-blue-100 italic">
                    {data.result.text || "No text found."}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {(status === "FAILURE" || error) && (
            <div className="mt-6 p-4 bg-red-50 text-red-900 rounded-lg border border-red-200">
              <p className="font-semibold text-sm whitespace-pre-wrap truncate">
                Error: {error || data?.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
