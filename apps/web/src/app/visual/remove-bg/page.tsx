import { BackgroundRemover } from "@/components/visual/BackgroundRemover";

export default function RemoveBgPage() {
  return (
    <div className="container py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Background Remover</h1>
      <BackgroundRemover />
    </div>
  );
}
