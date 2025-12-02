"use client";

import { useFkUser } from "@/lib/hooks/useFkUser";
import ListAnomalies from "@/components/techem/occupant/ListAnomalies";

export default function OccupantAnomaliesPage() {
  const fkUser = useFkUser();

  if (!fkUser) {
    return <div className="p-4">Chargement des anomalies...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListAnomalies fkUser={fkUser} />
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anomalies | TECHEM - Espace client",
  description: "List of anomalies",
};

export default function OccupantAnomaliesPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

