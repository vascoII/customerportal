import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intervention Details | TECHEM - Espace client",
  description: "Intervention details",
};

export default function OccupantInterventionDetailsPage({
  params,
}: {
  params: { pkIntervention: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

