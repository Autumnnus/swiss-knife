import { ImageTools } from "@/features/image/ImageTools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Tools & OCR | SwissKnife",
  description: "Process images or extract text using OCR",
};

export default function ImagePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Image Tools</h1>
        <p className="text-muted-foreground">
          Manipulate image files or extract text using Tesseract OCR engine.
        </p>
      </div>

      <ImageTools />
    </div>
  );
}
