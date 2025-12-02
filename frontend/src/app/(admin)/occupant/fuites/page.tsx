"use client";

import { useFkUser } from "@/lib/hooks/useFkUser";
import ListFuites from "@/components/techem/occupant/ListFuites";

export default function OccupantFuitesPage() {
  const fkUser = useFkUser();

  if (!fkUser) {
    return <div className="p-4">Chargement des fuites...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListFuites fkUser={fkUser} />
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuites | TECHEM - Espace client",
  description: "List of leaks",
};

export default function OccupantFuitesPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

