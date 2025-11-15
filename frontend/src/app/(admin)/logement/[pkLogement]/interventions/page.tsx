import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interventions | Techem Customer Portal",
  description: "List of interventions",
};

export default function LogementInterventionsPage({
  params,
}: {
  params: { pkLogement: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

