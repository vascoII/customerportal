import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dysfonctionnements | TECHEM - Espace client",
  description: "List of dysfunctions",
};

export default function ImmeubleDysfonctionnementsPage({
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

