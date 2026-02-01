import { YouTubeForm } from "@/features/youtube/YoutubeForm";

export default function YouTubePage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          YouTube Downloader
        </h2>
        <p className="text-muted-foreground">
          Enter a YouTube URL to download video or audio directly to your
          server.
        </p>
      </div>
      <YouTubeForm />
    </div>
  );
}
