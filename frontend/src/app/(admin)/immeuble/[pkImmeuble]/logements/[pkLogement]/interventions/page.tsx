import { Metadata } from "next";
import ListInterventions from "@/components/techem/logement/ListInterventions";

export const metadata: Metadata = {
  title: "Interventions | TECHEM - Espace client",
  description: "List of interventions for a logement",
};

export default function LogementInterventionsPage({
  params,
}: {
  params: { pkImmeuble: string; pkLogement: string };
}) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListInterventions pkLogement={params.pkLogement} />
      </div>
    </div>
  );
}


