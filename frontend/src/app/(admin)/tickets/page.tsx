import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets | Techem Customer Portal",
  description: "List of tickets",
};

export default function TicketsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

