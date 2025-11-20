import { Metadata } from "next";

import ListAnomalies from "@/components/techem/logement/ListAnomalies";

export const metadata: Metadata = {
  title: "Anomalies | TECHEM - Espace client",
  description: "List of anomalies",
};

export default function LogementAnomaliesPage({
  params,
}: {
  params: { pkLogement: string };
}) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListAnomalies pkLogement={params.pkLogement} />
      </div>
    </div>
  );
}

