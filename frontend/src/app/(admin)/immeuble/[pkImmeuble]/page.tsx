import { Metadata } from "next";
import ImmeubleMainCard from "@/components/techem/immeuble/ImmeubleMainCard";
import ImmeubleCard from "@/components/techem/immeuble/ImmeubleCard";
import ImmeubleRelevesCard from "@/components/techem/immeuble/ImmeubleRelevesCard";
import { ImmeubleMetrics } from "@/components/techem/immeuble/ImmeubleMetrics";
import ImmeubleReleves from "@/components/techem/immeuble/ImmeubleReleves";
import ImmeubleConsommationChart from "@/components/techem/immeuble/ImmeubleConsommationChart";
import ImmeubleStatisticsConsommationChart from "@/components/techem/immeuble/ImmeubleStatisticsConsommationChart";

export const metadata: Metadata = {
  title: "Immeuble Details | TECHEM - Espace client",
  description: "Building details",
};

export default function ImmeubleDetailsPage({
  params,
}: {
  params: { pkImmeuble: string };
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <ImmeubleMainCard pkImmeuble={params.pkImmeuble} />
          <ImmeubleReleves pkImmeuble={params.pkImmeuble} />
          <ImmeubleStatisticsConsommationChart/>
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-5">
          <ImmeubleCard pkImmeuble={params.pkImmeuble} />
          <ImmeubleMetrics pkImmeuble={params.pkImmeuble} />
          <ImmeubleRelevesCard pkImmeuble={params.pkImmeuble} />
        </div>
      </div>

      <ImmeubleConsommationChart pkImmeuble={params.pkImmeuble} />
    </div>
  );
}

