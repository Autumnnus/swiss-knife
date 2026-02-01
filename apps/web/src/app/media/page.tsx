"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, FileAudio, FileVideo, Film, Youtube } from "lucide-react";
import Link from "next/link";

const mediaFeatures = [
  {
    name: "YouTube Downloader",
    description: "Download videos and audio from YouTube in high quality.",
    href: "/media/youtube",
    icon: Youtube,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Media Converter",
    description: "Convert between different video and audio formats.",
    href: "/media/converter",
    icon: FileAudio,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Video Compressor",
    description: "Reduce video file size without losing quality.",
    href: "/media/compress",
    icon: FileVideo,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    name: "GIF Maker",
    description: "Create GIFs from your video files easily.",
    href: "/media/gif",
    icon: Film,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Media Tools</h1>
        <p className="text-muted-foreground">
          Select a tool to start processing your media files.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mediaFeatures.map((feature) => (
          <Link key={feature.name} href={feature.href}>
            <Card className="h-full hover:shadow-lg transition-all group cursor-pointer border-2 hover:border-primary/20">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center ${feature.color} mb-2`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  {feature.name}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
