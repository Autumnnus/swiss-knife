import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Film, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const mainCategories = [
  {
    name: "Media Tools",
    description:
      "YouTube downloader, Video converter, Compressor and GIF maker.",
    href: "/media",
    icon: Film,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Visual Tools",
    description:
      "Format converter, Background remover, OCR and Batch processor.",
    href: "/visual",
    icon: ImageIcon,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl">
        {mainCategories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="h-full hover:shadow-xl transition-all group cursor-pointer border-2 hover:border-primary/40 p-2">
              <CardHeader>
                <div
                  className={`w-14 h-14 rounded-2xl ${category.bg} flex items-center justify-center ${category.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <category.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                  {category.name}
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </CardTitle>
                <CardDescription className="text-base">
                  {category.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
