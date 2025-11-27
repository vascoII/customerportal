"use client";

import React from "react";

import { useOccupant } from "@/lib/hooks/useOccupant";
import OccupantMainCard from "@/components/techem/occupant/OccupantMainCard";
import { OccupantMetrics } from "@/components/techem/occupant/OccupantMetrics";
import OccupantRelevesCard from "@/components/techem/occupant/OccupantRelevesCard";
import OccupantDetailsClient from "@/components/techem/occupant/OccupantDetailsClient";

export default function OccupantPage() {
  const { getOccupantLogementQuery } = useOccupant();
  const { data: occupantData, isLoading: isOccupantLoading, error: occupantError } = getOccupantLogementQuery;
  console.log("[OccupantPage] occupantData:", occupantData);
  console.log("[OccupantPage] isOccupantLoading:", isOccupantLoading);
  console.log("[OccupantPage] occupantError:", occupantError);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        {occupantData && <OccupantMainCard occupantData={occupantData} />}
        {occupantData && <OccupantMetrics occupantData={occupantData} />}
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-5">
        {occupantData && <OccupantRelevesCard occupantData={occupantData} />}
      </div>
      {occupantData && <OccupantDetailsClient occupantData={occupantData} />}
    </div>
  );
}



