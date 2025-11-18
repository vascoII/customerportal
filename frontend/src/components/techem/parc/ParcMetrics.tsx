"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useParc } from "@/lib/hooks/useParc";
import StatusIconsAlerte from '@/components/techem/images/StatusIconsAlerte';
import StatusIconsAnomalie from '@/components/techem/images/StatusIconsAnomalie';
import StatusIconsDysfonctionnement from '@/components/techem/images/StatusIconsDysfonctionnement';
import StatusIconsFuite from '@/components/techem/images/StatusIconsFuite';

/**
 * Component displaying 4 parc metrics side by side:
 * - Fuites (nbFuites)
 * - Alarmes (nbDysfonctionnements)
 * - Anomalies (nbAnomalies)
 * - Depannages (nbDepannages)
 */
export const ParcMetrics = () => {
  const { parcData, isParcLoading } = useParc();

  // Extract metrics from API response
  const metrics = useMemo(() => {
    const board = parcData?.board;
    return {
      fuites: board?.nbFuites ?? 0,
      alarmes: board?.nbDysfonctionnements ?? 0,
      anomalies: board?.nbAnomalies ?? 0,
      depannages: board?.nbDepannages ?? 0,
      degresFuites: board?.degresFuites ?? 0,
      degresDysfonctionnements: board?.degresDysfonctionnements ?? 0,
      degresAnomalies: board?.degresAnomalies ?? 0,
      degresDepannages: board?.degresDepannages ?? 0,
    };
  }, [parcData]);

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  // Show loading state
  if (isParcLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center min-h-[100px]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chargement...
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Determine icon colors based on values
  const fuitesColor = metrics.fuites > 0 ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500";
  const dysfonctionnementsColor = metrics.alarmes > 0 ? "text-orange-500 dark:text-orange-400" : "text-gray-400 dark:text-gray-500";
  const anomaliesColor = metrics.anomalies > 0 ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500";
  const depannagesColor = metrics.depannages > 0 ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500";

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      <Link href="/immeuble?fuites=1">
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
      <Link href="/immeuble?dysfonctionnements=1">
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
      <Link href="/immeuble?anomalies=1">
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
      <Link href="/immeuble?depannages=1">
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

