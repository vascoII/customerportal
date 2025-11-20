import { Metadata } from "next";

import ListFuites from "@/components/techem/logement/ListFuites";

export const metadata: Metadata = {
  title: "Fuites | TECHEM - Espace client",
  description: "List of leaks",
};

export default function LogementFuitesPage({
  params,
}: {
  params: { pkLogement: string };
}) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ListFuites pkLogement={params.pkLogement} />
      </div>
    </div>
  );
}

