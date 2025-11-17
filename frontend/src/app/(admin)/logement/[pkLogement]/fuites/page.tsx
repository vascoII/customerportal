import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuites | TECHEM - Espace client",
  description: "List of leaks",
};

export default function LogementFuitesPage({
  params,
}: {
  params: { pkLogement: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

