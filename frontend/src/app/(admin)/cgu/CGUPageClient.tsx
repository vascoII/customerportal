"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import CguOccupant from "@/components/techem/cgu/CguOccupant";
import CguClient from "@/components/techem/cgu/CguClient";

export default function CGUPageClient() {
  const { user } = useAuth();
  const userType = user?.UserType;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {userType === "O" ? <CguOccupant /> : <CguClient />}
    </div>
  );
}

