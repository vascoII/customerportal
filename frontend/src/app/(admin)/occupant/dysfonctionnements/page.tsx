"use client";

import { useFkUser } from "@/lib/hooks/useFkUser";
import ListDysfonctionnements from "@/components/techem/occupant/ListDysfonctionnements";

export default function OccupantDysfonctionnementsPage() {
  const fkUser = useFkUser();

  if (!fkUser) {
    return <div className="p-4">Chargement des alarmes techniques...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListDysfonctionnements fkUser={fkUser} />
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dysfonctionnements | TECHEM - Espace client",
  description: "List of dysfunctions",
};

export default function OccupantDysfonctionnementsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

