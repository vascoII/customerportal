import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factures | Techem Customer Portal",
  description: "List of invoices",
};

export default function FacturesPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

