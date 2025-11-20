import { Metadata } from "next";
import { Suspense } from "react";
import ListLogements from "@/components/techem/logement/ListLogements";

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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Chargement...
        </p>
      </div>
    }>
      <ListLogements pkImmeuble={params.pkImmeuble} />
    </Suspense>
  );
}

