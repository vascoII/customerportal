import { Metadata } from "next";
import ImmeubleDetailsClient from "@/components/techem/immeuble/ImmeubleDetailsClient";

export const metadata: Metadata = {
  title: "Immeuble Details | TECHEM - Espace client",
  description: "Building details",
};

export default function ImmeubleDetailsPage({
  params,
}: {
  params: { pkImmeuble: string };
}) {
  return <ImmeubleDetailsClient pkImmeuble={params.pkImmeuble} />;
}

