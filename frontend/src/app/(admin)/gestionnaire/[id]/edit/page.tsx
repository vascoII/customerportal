import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Gestionnaire | Techem Customer Portal",
  description: "Edit manager",
};

export default function EditGestionnairePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

