import { DiffChecker } from "@/components/text/DiffChecker";

export default function DiffPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Diff Checker</h1>
      <DiffChecker />
    </div>
  );
}
