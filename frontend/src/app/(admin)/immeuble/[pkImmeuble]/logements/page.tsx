import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logements | TECHEM - Espace client",
  description: "List of housing units",
};

export default function ImmeubleLogementsPage({
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

