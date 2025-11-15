import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intervention Details | Techem Customer Portal",
  description: "Intervention details",
};

export default function LogementInterventionDetailsPage({
  params,
}: {
  params: { pkLogement: string; pkIntervention: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

