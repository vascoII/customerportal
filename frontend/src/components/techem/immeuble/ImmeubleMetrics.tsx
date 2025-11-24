"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useImmeubles } from "@/lib/hooks/useImmeubles";
import StatusIconsAlerte from '@/components/techem/images/StatusIconsAlerte';
import StatusIconsAnomalie from '@/components/techem/images/StatusIconsAnomalie';
import StatusIconsDysfonctionnement from '@/components/techem/images/StatusIconsDysfonctionnement';
import StatusIconsFuite from '@/components/techem/images/StatusIconsFuite';
import { LoadingMetrics } from "@/components/ui/loading";

interface ImmeubleMetricsProps {
  pkImmeuble: string;
}

/**
 * Component displaying 4 immeuble metrics side by side:
 * - Fuites (nbFuites)
 * - Alarmes (nbDysfonctionnements)
 * - Anomalies (nbAnomalies)
 * - Depannages (nbDepannages)
 */
export const ImmeubleMetrics = ({ pkImmeuble }: ImmeubleMetricsProps) => {
  const { getImmeubleQuery } = useImmeubles();
  const { data: immeubleData, isLoading: isImmeubleLoading } = getImmeubleQuery(pkImmeuble);

  // Extract metrics from API response
  const metrics = useMemo(() => {
    const immeuble = immeubleData?.immeuble;
    // Handle both nested ImmeubleEC object and direct properties
    const immeubleEC = (immeuble && typeof immeuble === 'object' && 'ImmeubleEC' in immeuble)
      ? (immeuble as { ImmeubleEC?: Record<string, unknown> }).ImmeubleEC
      : null;
    
    return {
      fuites: (immeubleEC?.NbFuites ?? immeubleEC?.nbFuites ?? immeuble?.NbFuites ?? immeuble?.nbFuites ?? 0) as number,
      alarmes: (immeuble?.NbDysfonctionnements ?? immeuble?.nbDysfonctionnements ?? 0) as number,
      anomalies: (immeubleEC?.NbAnomalies ?? immeubleEC?.nbAnomalies ?? immeuble?.NbAnomalies ?? immeuble?.nbAnomalies ?? 0) as number,
      depannages: (immeuble?.NbDepannages ?? immeuble?.nbDepannages ?? 0) as number,
      degresFuites: (immeubleEC?.DegresFuites ?? immeubleEC?.degresFuites ?? immeuble?.DegresFuites ?? immeuble?.degresFuites ?? 0) as number,
      degresDysfonctionnements: (immeuble?.DegresDysfonctionnements ?? immeuble?.degresDysfonctionnements ?? 0) as number,
      degresAnomalies: (immeubleEC?.DegresAnomalies ?? immeubleEC?.degresAnomalies ?? immeuble?.DegresAnomalies ?? immeuble?.degresAnomalies ?? 0) as number,
      degresDepannages: (immeuble?.DegresDepannages ?? immeuble?.degresDepannages ?? 0) as number,
    };
  }, [immeubleData]);

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  // Show loading state
  if (isImmeubleLoading) {
    return <LoadingMetrics count={4} />;
  }

  // Determine icon colors based on values
  const fuitesColor = metrics.fuites > 0 ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500";
  const dysfonctionnementsColor = metrics.alarmes > 0 ? "text-orange-500 dark:text-orange-400" : "text-gray-400 dark:text-gray-500";
  const anomaliesColor = metrics.anomalies > 0 ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500";
  const depannagesColor = metrics.depannages > 0 ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500";

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <Link href={`/immeuble/${pkImmeuble}/fuites`}>
      {/* Fuites - Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <StatusIconsFuite size={24} className={fuitesColor} color="currentColor" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Fuites
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(metrics.fuites)}
            </h4>
          </div>
        </div>
        </div>
      </Link>
      {/* Fuites - Metric Item End */}

      {/* Alarmes (Dysfonctionnements) - Metric Item Start */}
      <Link href={`/immeuble/${pkImmeuble}/dysfonctionnements`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <StatusIconsDysfonctionnement size={24} className={dysfonctionnementsColor} color="currentColor" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Alarmes techniques
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(metrics.alarmes)}
            </h4>
          </div>
        </div>
        </div>
      </Link>
      {/* Alarmes - Metric Item End */}

      {/* Anomalies - Metric Item Start */}
      <Link href={`/immeuble/${pkImmeuble}/anomalies`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <StatusIconsAnomalie size={24} className={anomaliesColor} color="currentColor" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Anomalies de consommation
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(metrics.anomalies)}
            </h4>
          </div>
        </div>
        </div>
      </Link>
      {/* Anomalies - Metric Item End */}

      {/* Depannages - Metric Item Start */}
      <Link href={`/immeuble/${pkImmeuble}/interventions`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <StatusIconsAlerte size={24} className={depannagesColor} color="currentColor" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Depannages en cours
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(metrics.depannages)}
            </h4>
          </div>
        </div>
        </div>
        </Link>
      {/* Depannages - Metric Item End */}
    </div>
  );
};

