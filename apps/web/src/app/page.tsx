import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, RefreshCcw, Youtube } from "lucide-react";
import Link from "next/link";

const features = [
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
    icon: RefreshCcw,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export default function Home() {
  return (
    <div className="space-y-12 py-10">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Complete Media Management Tool
        </h1>
        <p className="text-xl text-muted-foreground">
          A powerful open-source tool for downloading, converting, and managing
          your media collection with ease.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
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
