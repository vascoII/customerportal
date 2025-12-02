import { Metadata } from "next";
import InterventionDetails from "@/components/techem/immeuble/InterventionDetails";

export const metadata: Metadata = {
  title: "Détail de l'intervention occupant | TECHEM - Espace client",
  description: "Détails d'une intervention de dépannage pour l'occupant",
};

export default function OccupantInterventionDetailsPage({
  params,
}: {
  params: { pkIntervention: string };
}) {
  const { pkIntervention } = params;

  // Pour la vue occupant, il n'y a pas de pkImmeuble dans l'URL.
  // On passe une valeur neutre ou on adaptera plus tard si l'API nécessite un immeuble.
  const pkImmeuble = "";

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <InterventionDetails pkImmeuble={pkImmeuble} pkIntervention={pkIntervention} />
    </div>
  );
}

