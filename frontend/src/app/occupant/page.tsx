import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Occupant | TECHEM - Espace client",
  description: "Occupant dashboard",
};

export default function OccupantPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

