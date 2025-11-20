import { Metadata } from "next";

import ListDysfonctionnements from "@/components/techem/logement/ListDysfonctionnements";

export const metadata: Metadata = {
  title: "Dysfonctionnements | TECHEM - Espace client",
  description: "List of dysfunctions",
};

export default function LogementDysfonctionnementsPage({
  params,
}: {
  params: { pkLogement: string };
}) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListDysfonctionnements pkLogement={params.pkLogement} />
      </div>
    </div>
  );
}

