"use client";

import { GifGenerator } from "@/components/media/GifGenerator";

export default function GifPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">GIF Maker</h2>
        <p className="text-muted-foreground">
          Create high-quality GIFs from your video files.
        </p>
      </div>
      <GifGenerator />
    </div>
  );
}
