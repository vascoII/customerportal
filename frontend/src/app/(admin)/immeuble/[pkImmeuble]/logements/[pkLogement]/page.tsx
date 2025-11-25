import { Metadata } from "next";

import ImmeubleCard from "@/components/techem/immeuble/ImmeubleCard";

import LogementMainCard from "@/components/techem/logement/LogementMainCard";
import { LogementMetrics } from "@/components/techem/logement/LogementMetrics";
import LogementRelevesCard from "@/components/techem/logement/LogementRelevesCard";
import LogementDetailsClient from "@/components/techem/logement/LogementDetailsClient";

export const metadata: Metadata = {
  title: "Logement Details | TECHEM - Espace client",
  description: "Housing unit details",
};

export default function LogementDetailsPage({
  params,
}: {
  params: { pkImmeuble: string; pkLogement: string };
}) {
  const { pkLogement, pkImmeuble } = params;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <LogementMainCard pkLogement={pkLogement} />
        <LogementMetrics pkLogement={pkLogement} pkImmeuble={pkImmeuble} />
        
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-5">
        <ImmeubleCard pkImmeuble={pkImmeuble} />
        <LogementRelevesCard pkLogement={pkLogement} />
      </div>
      <LogementDetailsClient pkLogement={pkLogement} />
      
    </div>
  );
}


