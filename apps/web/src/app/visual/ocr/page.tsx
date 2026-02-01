import { OcrComponent } from "@/components/visual/OcrComponent";

export default function OcrPage() {
  return (
    <div className="container py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">OCR - Text Extraction</h1>
      <OcrComponent />
    </div>
  );
}
