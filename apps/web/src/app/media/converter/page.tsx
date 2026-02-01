import { ConverterForm } from "@/features/converter/ConverterForm";

export default function ConverterPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Media Converter</h2>
        <p className="text-muted-foreground">
          Upload your audio or video files to convert them into your desired
          format.
        </p>
      </div>
      <ConverterForm />
    </div>
  );
}
