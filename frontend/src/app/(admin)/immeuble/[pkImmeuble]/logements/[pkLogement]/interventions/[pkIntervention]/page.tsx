import { Metadata } from "next";
import ListInterventions from "@/components/techem/logement/ListInterventions";

export const metadata: Metadata = {
  title: "Intervention | TECHEM - Espace client",
  description: "Intervention details for a logement",
};

export default function LogementInterventionDetailsPage({
  params,
}: {
  params: { pkImmeuble: string; pkLogement: string; pkIntervention: string };
}) {
  // Reuse ListInterventions for now; component handles selection internally
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListInterventions pkLogement={params.pkLogement} />
      </div>
    </div>
  );
}


