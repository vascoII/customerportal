"use client";
import { useState } from "react";
import LogementReleves, { TabType } from "@/components/techem/logement/LogementReleves";
import LogementConsommationChartEf from "@/components/techem/logement/releve/LogementConsommationChartEf";
import LogementStatisticsConsommationChartEf from "@/components/techem/logement/releve/LogementStatisticsConsommationChartEf";
import LogementConsommationChartEc from "@/components/techem/logement/releve/LogementConsommationChartEc";
import LogementStatisticsConsommationChartEc from "@/components/techem/logement/releve/LogementStatisticsConsommationChartEc";
import LogementConsommationChartRepart from "@/components/techem/logement/releve/LogementConsommationChartRepart";
import LogementStatisticsConsommationChartRepart from "@/components/techem/logement/releve/LogementStatisticsConsommationChartRepart";
import LogementConsommationChartCet from "@/components/techem/logement/releve/LogementConsommationChartCet";
import LogementStatisticsConsommationChartCet from "@/components/techem/logement/releve/LogementStatisticsConsommationChartCet";

interface LogementDetailsClientProps {
  pkLogement: string;
}

export default function LogementDetailsClient({ pkLogement }: LogementDetailsClientProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>("eauFroide");

  return (
    <div className="col-span-12 space-y-6 xl:col-span-12">
      <LogementReleves 
        pkLogement={pkLogement} 
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      
      {/* Eau froide - Afficher uniquement les composants Ef */}
      {selectedTab === "eauFroide" && (
        <>
          <LogementConsommationChartEf pkLogement={pkLogement} />
          <LogementStatisticsConsommationChartEf pkLogement={pkLogement} />
        </>
      )}
      
      {/* Eau chaude - Afficher uniquement les composants Ec */}
      {selectedTab === "eauChaude" && (
        <>
          <LogementConsommationChartEc pkLogement={pkLogement} />
          <LogementStatisticsConsommationChartEc pkLogement={pkLogement} />
        </>
      )}
      
      {/* Répartiteur - Afficher uniquement les composants Repart */}
      {selectedTab === "repartiteur" && (
        <>
          <LogementConsommationChartRepart pkLogement={pkLogement} />
          <LogementStatisticsConsommationChartRepart pkLogement={pkLogement} />
        </>
      )}
      
      {/* Compteur d'énergie - Afficher uniquement les composants Cet */}
      {selectedTab === "compteurEnergie" && (
        <>
          <LogementConsommationChartCet pkLogement={pkLogement} />
          <LogementStatisticsConsommationChartCet pkLogement={pkLogement} />
        </>
      )}
    </div>
  );
}

