import { BatchProcessor } from "@/components/visual/BatchProcessor";

export default function BatchPage() {
  return (
    <div className="container py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Batch Process Images</h1>
      <BatchProcessor />
    </div>
  );
}
