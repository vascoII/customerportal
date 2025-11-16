"use client";
import React, { useMemo } from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useParc } from "@/lib/hooks/useParc";

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
    if (!board) {
      return {
        fuites: 0,
        alarmes: 0,
        anomalies: 0,
        depannages: 0,
        degresFuites: 0,
        degresDysfonctionnements: 0,
        degresAnomalies: 0,
        degresDepannages: 0,
      };
    }

    return {
      fuites: board.nbFuites ?? board.NbFuites ?? 0,
      alarmes: board.nbDysfonctionnements ?? board.NbDysfonctionnements ?? 0,
      anomalies: board.nbAnomalies ?? board.NbAnomalies ?? 0,
      depannages: board.nbDepannages ?? board.NbDepannages ?? 0,
      degresFuites: board.degresFuites ?? board.DegresFuites ?? 0,
      degresDysfonctionnements: board.degresDysfonctionnements ?? board.DegresDysfonctionnements ?? 0,
      degresAnomalies: board.degresAnomalies ?? board.DegresAnomalies ?? 0,
      degresDepannages: board.degresDepannages ?? board.DegresDepannages ?? 0,
    };
  }, [parcData]);

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  // Get badge color and icon based on degres value
  const getBadgeProps = (degres: number) => {
    if (degres > 0) {
      return {
        color: "success" as const,
        icon: <ArrowUpIcon />,
        value: `+${degres}%`,
      };
    } else if (degres < 0) {
      return {
        color: "error" as const,
        icon: <ArrowDownIcon className="text-error-500" />,
        value: `${degres}%`,
      };
    }
    return null; // No badge if degres is 0 or -1
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

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {/* Fuites - Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Nombre de fuites
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(metrics.fuites)}
            </h4>
          </div>
          
        </div>
      </div>
      {/* Fuites - Metric Item End */}

      {/* Alarmes (Dysfonctionnements) - Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
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
      {/* Alarmes - Metric Item End */}

      {/* Anomalies - Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Nombre d'anomalies de consommation
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(metrics.anomalies)}
            </h4>
          </div>
        </div>
      </div>
      {/* Anomalies - Metric Item End */}

      {/* Depannages - Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
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
      {/* Depannages - Metric Item End */}
    </div>
  );
};

