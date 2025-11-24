import { Metadata } from "next";

import LogementMainCard from "@/components/techem/logement/LogementMainCard";
import LogementCard from "@/components/techem/logement/LogementCard";
import { LogementMetrics } from "@/components/techem/logement/LogementMetrics";
import LogementReleves from "@/components/techem/logement/LogementReleves";
import LogementRelevesCard from "@/components/techem/logement/LogementRelevesCard";
import LogementConsommationChart from "@/components/techem/logement/LogementConsommationChart";
import LogementStatisticsConsommationChart from "@/components/techem/logement/LogementStatisticsConsommationChart";

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
        <LogementReleves pkLogement={pkLogement} />
        <LogementConsommationChart />
        <LogementStatisticsConsommationChart />
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-5">
        <LogementCard pkLogement={pkLogement} />
        <LogementMetrics pkLogement={pkLogement} pkImmeuble={pkImmeuble} />
        <LogementRelevesCard pkLogement={pkLogement} />
      </div>
    </div>
  );
}


