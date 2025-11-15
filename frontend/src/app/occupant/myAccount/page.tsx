import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Techem Customer Portal",
  description: "My account",
};

export default function MyAccountPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello</h1>
    </div>
  );
}

