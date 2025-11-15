import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parc | Techem Customer Portal",
  description: "Parc management",
};

export default function ParcPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

