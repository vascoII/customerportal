"use client";
import { useMemo, useCallback } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useLogements } from "@/lib/hooks/useLogements";
import { LoadingChart } from "@/components/ui/loading";
import Alert from "@/components/ui/alert/Alert";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface LogementConsommationChartEfProps {
  pkLogement: string;
}

const readingOrder: Array<"R5" | "R4" | "R3" | "R2" | "R1"> = ["R5", "R4", "R3", "R2", "R1"];

const formatDateLabel = (dateValue?: string, fallback?: string) => {
  if (!dateValue) {
    return fallback ?? "";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return fallback ?? dateValue;
  }

  return parsedDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const parseConsoPeriodeReadings = (
  consoPeriode?: Record<"R1" | "R2" | "R3" | "R4" | "R5", { DateReleve?: string; Conso?: string | number }>
) => {
  const categories: string[] = [];
  const values: number[] = [];

  if (!consoPeriode) {
    return { categories, values };
  }

  readingOrder.forEach((readingKey) => {
    const reading = consoPeriode[readingKey];
    if (!reading) {
      return;
    }

    const label = formatDateLabel(reading.DateReleve, readingKey);
    const rawValue = reading.Conso ?? "";
    const numericValue =
      typeof rawValue === "number" ? rawValue : Number(String(rawValue).replace(",", "."));

    if (Number.isNaN(numericValue)) {
      return;
    }

    categories.push(label);
    values.push(numericValue);
  });

  return { categories, values };
};

export default function LogementConsommationChartEf({ pkLogement }: LogementConsommationChartEfProps) {
  const { getLogementQuery } = useLogements();
  const {
    data: logementData,
    isLoading,
    error,
  } = getLogementQuery(pkLogement);

  const { categories, values, pkOccupant } = useMemo(() => {
    const logement = logementData?.logement as Record<string, unknown> | undefined;

    const logementEF =
      logement && typeof logement === "object" && "LogementEF" in logement
        ? (logement.LogementEF as Record<string, unknown> | undefined)
        : null;

    const consoPeriode =
      logementEF && typeof logementEF === "object" && "ConsoPeriode" in logementEF
        ? (logementEF.ConsoPeriode as Record<
            "R1" | "R2" | "R3" | "R4" | "R5",
            { DateReleve?: string; Conso?: string | number }
          >)
        : undefined;

    const occupant =
      logement && typeof logement === "object" && "Occupant" in logement
        ? (logement.Occupant as { PkOccupant?: string | number } | undefined)
        : undefined;

    const parsed = parseConsoPeriodeReadings(consoPeriode);

    return {
      ...parsed,
      pkOccupant: occupant?.PkOccupant,
    };
  }, [logementData]);

  const handleOpenOccupantPdf = useCallback(() => {
    if (!pkOccupant) return;
    const url = `/occupant/${String(pkOccupant)}/releve-eau`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [pkOccupant]);

  const hasData = values.length > 0 && categories.length > 0;

  const options: ApexOptions = useMemo(() => {
    return {
      colors: ["#465fff"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "bar",
        height: 180,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "39%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      xaxis: {
        categories,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          rotate: -45,
          style: {
            fontSize: "11px",
          },
        },
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        fontFamily: "Outfit",
      },
      yaxis: {
        title: {
          text: "Volume (m³)",
        },
        labels: {
          formatter: (value) => value.toFixed(0),
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        x: {
          show: true,
        },
        y: {
          formatter: (val: number) => `${val.toLocaleString("fr-FR")} m³`,
        },
      },
    };
  }, [categories]);

  const series = useMemo(
    () => [
      {
        name: "Consommations récentes (m³)",
        data: values,
      },
    ],
    [values]
  );

  if (isLoading) {
    return (
      <LoadingChart
        variant="bar"
        height={200}
        title="Compteur Eau froide"
        message="Chargement des consommations..."
      />
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <Alert
          variant="error"
          title="Erreur de chargement"
          message="Impossible de récupérer les données de consommation."
          showLink={false}
        />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Compteur Eau froide
        </h3>
        <div className="flex items-center justify-center min-h-[160px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800 mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune donnée de consommation disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Compteur Eau froide
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Information consommation + variation entre deux relevés
          </p>
        </div>
        {pkOccupant && (
          <button
            type="button"
            onClick={handleOpenOccupantPdf}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-theme-xs transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]"
          >
            <span>Export PDF</span>
            <svg
              className="h-4 w-4 text-red-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 2H14L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2ZM13 9V3.5L18.5 9H13Z" />
              <path d="M8 13H16V15H8V13Z" />
              <path d="M8 17H16V19H8V17Z" />
            </svg>
          </button>
        )}
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
