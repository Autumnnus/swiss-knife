"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Files,
  Image as ImageIcon,
  Languages,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const visualFeatures = [
  {
    name: "Format Converter",
    description: "Convert images between PNG, JPG, WebP, and AVIF formats.",
    href: "/visual/convert",
    icon: RefreshCcw,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Batch Processor",
    description: "Resize, compress or convert multiple images at once.",
    href: "/visual/batch",
    icon: Files,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    name: "Background Remover",
    description: "Remove image backgrounds automatically using AI.",
    href: "/visual/remove-bg",
    icon: Sparkles,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    name: "OCR - Text Extraction",
    description: "Extract text from images using advanced OCR technology.",
    href: "/visual/ocr",
    icon: Languages,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export default function VisualDashboard() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="p-3 bg-pink-500/10 rounded-2xl mb-4">
          <ImageIcon className="w-8 h-8 text-pink-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Visual Tools</h1>
        <p className="text-muted-foreground max-w-2xl">
          Everything you need for image processing. Convert formats, remove
          backgrounds, extract text, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {visualFeatures.map((feature) => (
          <Link key={feature.name} href={feature.href}>
            <Card className="h-full hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/50">
              <CardHeader>
                <div
                  className={`p-2 w-fit rounded-lg ${feature.bg} mb-2 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {feature.name}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
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
