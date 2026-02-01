import { MarkdownTool } from "@/components/text/MarkdownTool";

export default function MarkdownPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Markdown Converter
      </h1>
      <MarkdownTool />
    </div>
  );
}
