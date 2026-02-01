"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Code,
  FileText,
  Hash,
  Type,
} from "lucide-react";
import Link from "next/link";

const textFeatures = [
  {
    name: "JSON Formatter",
    description: "Validate, format, and beautify your JSON data.",
    href: "/text/json",
    icon: Braces,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    name: "Base64 Tool",
    description: "Encode and decode text to/from Base64 format.",
    href: "/text/base64",
    icon: Hash,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    name: "Markdown Converter",
    description: "Convert Markdown to PDF or HTML with live preview.",
    href: "/text/markdown",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Diff Checker",
    description: "Compare two pieces of text and see the differences.",
    href: "/text/diff",
    icon: Code,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function TextDashboard() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center mb-10 text-center">
        <Link href="/" className="self-start mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="p-3 bg-indigo-500/10 rounded-2xl mb-4">
          <Type className="w-8 h-8 text-indigo-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Text Tools</h1>
        <p className="text-muted-foreground max-w-2xl">
          Complete set of tools for text processing. Format JSON, base64 encode,
          markdown conversion, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {textFeatures.map((feature) => (
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
