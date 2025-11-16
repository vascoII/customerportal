import type { Metadata } from "next";
import React from "react";
import VosReleves from "@/components/techem/parc/VosReleves";
import { ParcMetrics } from "@/components/techem/parc/ParcMetrics";
import ParcMainCard from "@/components/techem/parc/ParcMainCard";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title: "Parc | Techem Customer Portal",
  description: "Parc management",
};

export default function ParcPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <ParcMainCard />
        <ParcMetrics />
        
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <VosReleves />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}

