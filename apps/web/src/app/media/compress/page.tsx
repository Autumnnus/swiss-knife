"use client";

import { VideoCompressor } from "@/components/media/VideoCompressor";

export default function CompressPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Media Compressor</h2>
        <p className="text-muted-foreground">
          Upload your video files to compress them and reduce file size.
        </p>
      </div>
      <VideoCompressor />
    </div>
  );
}
