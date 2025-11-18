"use client";

import { useEffect, useMemo, useState } from "react";
import StatusIconsAnomalie from "@/components/techem/images/StatusIconsAnomalie";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImmeubles } from "@/lib/hooks/useImmeubles";
import type { Building, Anomaly } from "@/lib/types/api";

interface ListAnomaliesProps {
  pkImmeuble: string;
}

export default function ListAnomalies({ pkImmeuble }: ListAnomaliesProps) {
  const { getAnomalies } = useImmeubles();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [immeuble, setImmeuble] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnomalies = async () => {
      try {
        setIsLoading(true);
        const response = await getAnomalies(pkImmeuble);
        if (!isMounted) {
          return;
        }

        setAnomalies(response.anomalies ?? []);
        setImmeuble(response.immeuble ?? null);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error loading anomalies:", error);
        if (isMounted) {
          setErrorMessage("Impossible de charger les anomalies.");
          setAnomalies([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (pkImmeuble) {
      loadAnomalies();
    } else {
      setErrorMessage("Identifiant d'immeuble manquant.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkImmeuble]);

  const totalAnomalies = useMemo(() => anomalies.length, [anomalies]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-6 pt-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement des anomalies...
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50 px-4 py-6 dark:border-red-900/60 dark:bg-red-950/40 sm:px-6">
        <p className="text-sm text-red-700 dark:text-red-200">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {immeuble?.Nom ? `Anomalies de consommation – ${immeuble.Nom}` : "Anomalies de consommation"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalAnomalies} anomalie{totalAnomalies > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {anomalies.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune anomalie de consommation signalée pour cet immeuble.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Nombre Anomalies de consommation
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Index
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Conso
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                OBSERVATION
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {anomalies.map((anomalie, index) => {
              const key = anomalie.PkAnomalie ?? anomalie.Appareil?.Numero ?? `anomalie-${index}`;
              const indexValue = anomalie.Anomalie?.Index ?? "—";
              const conso = anomalie.Anomalie?.Conso ?? "—";
              const observations = anomalie.Anomalie?.Observations ?? "—";
              const rawFluide = anomalie.Appareil?.Fluide ?? "";
              const fluide =
                rawFluide === "EC"
                  ? "Eau chaude"
                  : rawFluide === "EF"
                  ? "Eau froide"
                  : rawFluide || "—";

              return (
                <TableRow key={key} className="align-top">
                  <TableCell className="py-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10">
                        <StatusIconsAnomalie
                          size={22}
                          className="text-amber-600 dark:text-amber-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          1
                        </p>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {anomalie.Occupant?.Ref ?? "Réf. client inconnue"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Logement {anomalie.Logement?.NumOrdre ?? "—"} –{" "}
                          {anomalie.Occupant?.Nom ?? "Occupant inconnu"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Étage {anomalie.Logement?.NumEtage ?? "—"} | Bât.{" "}
                          {anomalie.Logement?.NumBatiment ?? "—"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          N° compteur: {anomalie.Appareil?.Numero ?? "—"} | {fluide}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Emplacement: {anomalie.Appareil?.Emplacement ?? "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                    {indexValue}
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                    {conso}
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                    {observations}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
