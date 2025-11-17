import { Metadata } from "next";

import ListImmeubles from "@/components/techem/immeuble/ListImmeubles";

export const metadata: Metadata = {
  title: "Immeubles | TECHEM - Espace client",
  description: "List of buildings",
};

export default function ImmeublePage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListImmeubles />
      </div>
    </div>
  );
}

