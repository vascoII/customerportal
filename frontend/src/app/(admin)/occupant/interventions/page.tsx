"use client";

import { useFkUser } from "@/lib/hooks/useFkUser";
import ListInterventions from "@/components/techem/occupant/ListInterventions";

export default function OccupantInterventionsPage() {
  const fkUser = useFkUser();

  if (!fkUser) {
    return <div className="p-4">Chargement des dépannages...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListInterventions fkUser={fkUser} />
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interventions | TECHEM - Espace client",
  description: "List of interventions",
};

export default function OccupantInterventionsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

