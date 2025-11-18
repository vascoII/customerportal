"use client";

import { useEffect, useMemo, useState } from "react";
import StatusIconsFuite from "@/components/techem/images/StatusIconsFuite";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImmeubles } from "@/lib/hooks/useImmeubles";
import type { Building, Leak } from "@/lib/types/api";

interface ListFuitesProps {
  pkImmeuble: string;
}

const formatDays = (value?: number | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${value} jour${value > 1 ? "s" : ""}`;
};

const getLeakCount = (fuite: Leak): number => {
  const count = fuite?.Fuite?.NbFuites ?? fuite?.Fuite?.Nombre;
  if (typeof count === "number" && !Number.isNaN(count)) {
    return count;
  }
  return 1;
};

export default function ListFuites({ pkImmeuble }: ListFuitesProps) {
  const { getFuites } = useImmeubles();
  const [fuites, setFuites] = useState<Leak[]>([]);
  const [immeuble, setImmeuble] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFuites = async () => {
      try {
        setIsLoading(true);
        const response = await getFuites(pkImmeuble);
        if (!isMounted) {
          return;
        }

        setFuites(response.fuites ?? []);
        setImmeuble(response.immeuble ?? null);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error loading leaks:", error);
        if (isMounted) {
          setErrorMessage("Impossible de charger les fuites.");
          setFuites([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (pkImmeuble) {
      loadFuites();
    } else {
      setErrorMessage("Identifiant d'immeuble manquant.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkImmeuble]);

  const totalLeaks = useMemo(() => fuites.reduce((acc, fuite) => acc + getLeakCount(fuite), 0), [fuites]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-6 pt-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement des fuites...
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
            {immeuble?.Nom ? `Fuites – ${immeuble.Nom}` : "Fuites"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalLeaks} fuite{totalLeaks > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {fuites.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune fuite signalée pour cet immeuble.
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
                Nombre de fuites
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                N° compteur
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Emplacement
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Fluide
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Nb de jours
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {fuites.map((fuite, index) => {
              const key = fuite.PkFuite ?? fuite.Appareil?.Numero ?? `fuite-${index}`;
              const compteur = fuite.Appareil?.Numero ?? "—";
              const emplacement = fuite.Appareil?.Emplacement ?? "—";
              const rawFluide = fuite.Appareil?.Fluide ?? "";
              const fluide =
                rawFluide === "EC"
                  ? "Eau chaude"
                  : rawFluide === "EF"
                  ? "Eau froide"
                  : rawFluide || "—";
              const nbJours = fuite.Fuite?.NbJours ?? fuite.Fuite?.Duree ?? null;

              return (
                <TableRow key={key} className="align-top">
                  <TableCell className="py-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 rounded-xl bg-blue-50 p-3 dark:bg-blue-500/10">
                        <StatusIconsFuite
                          size={22}
                          className="text-blue-600 dark:text-blue-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {getLeakCount(fuite)}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {fuite.Occupant?.Ref ?? "Réf. client inconnue"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Logement {fuite.Logement?.NumOrdre ?? "—"} –{" "}
                          {fuite.Occupant?.Nom ?? "Occupant inconnu"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Étage {fuite.Logement?.NumEtage ?? "—"} | Bât.{" "}
                          {fuite.Logement?.NumBatiment ?? "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                    {compteur}
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                    {emplacement}
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                    {fluide}
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                    {formatDays(nbJours)}
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
