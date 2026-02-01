import { JsonFormatter } from "@/components/text/JsonFormatter";

export default function JsonPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        JSON Formatter & Validator
      </h1>
      <JsonFormatter />
    </div>
  );
}
