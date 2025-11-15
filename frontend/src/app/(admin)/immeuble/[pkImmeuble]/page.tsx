import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immeuble Details | Techem Customer Portal",
  description: "Building details",
};

export default function ImmeubleDetailsPage({
  params,
}: {
  params: { pkImmeuble: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

