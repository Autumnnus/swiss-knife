import { ImageConverter } from "@/components/visual/ImageConverter";

export default function ConvertPage() {
  return (
    <div className="container py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Convert & Compress Image</h1>
      <ImageConverter />
    </div>
  );
}
