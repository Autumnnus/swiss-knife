import { Base64Tool } from "@/components/text/Base64Tool";

export default function Base64Page() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Base64 Encode / Decode
      </h1>
      <Base64Tool />
    </div>
  );
}
