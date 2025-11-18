import { Metadata } from "next";
import ImmeubleMainCard from "@/components/techem/immeuble/ImmeubleMainCard";
import ImmeubleCard from "@/components/techem/immeuble/ImmeubleCard";
import ImmeubleRelevesCard from "@/components/techem/immeuble/ImmeubleRelevesCard";

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
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ImmeubleMainCard pkImmeuble={params.pkImmeuble} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <ImmeubleCard pkImmeuble={params.pkImmeuble} />
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ImmeubleRelevesCard pkImmeuble={params.pkImmeuble} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        
      </div>

      <div className="col-span-12 xl:col-span-7">
        
      </div>
    </div>
  );
}

