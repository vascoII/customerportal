"use client";

import { useEffect, useMemo, useState } from "react";
import StatusIconsDysfonctionnement from "@/components/techem/images/StatusIconsDysfonctionnement";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImmeubles } from "@/lib/hooks/useImmeubles";
import type { Building, Dysfunction } from "@/lib/types/api";

interface ListDysfonctionnementsProps {
  pkImmeuble: string;
}

const formatDays = (value?: number | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${value} jour${value > 1 ? "s" : ""}`;
};

const getDysfunctionCount = (dysfonctionnement: Dysfunction): number => {
  // For dysfunctions, we typically count 1 per record
  return 1;
};

export default function ListDysfonctionnements({ pkImmeuble }: ListDysfonctionnementsProps) {
  const { getDysfonctionnements } = useImmeubles();
  const [dysfonctionnements, setDysfonctionnements] = useState<Dysfunction[]>([]);
  const [immeuble, setImmeuble] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDysfonctionnements = async () => {
      try {
        setIsLoading(true);
        const response = await getDysfonctionnements(pkImmeuble);
        if (!isMounted) {
          return;
        }

        setDysfonctionnements(response.dysfonctionnements ?? []);
        setImmeuble(response.immeuble ?? null);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error loading dysfonctionnements:", error);
        if (isMounted) {
          setErrorMessage("Impossible de charger les alarmes techniques.");
          setDysfonctionnements([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (pkImmeuble) {
      loadDysfonctionnements();
    } else {
      setErrorMessage("Identifiant d'immeuble manquant.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkImmeuble]);

  const totalDysfonctionnements = useMemo(
    () => dysfonctionnements.reduce((acc, dys) => acc + getDysfunctionCount(dys), 0),
    [dysfonctionnements]
  );

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-6 pt-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement des alarmes techniques...
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
            {immeuble?.Nom ? `Alarmes techniques – ${immeuble.Nom}` : "Alarmes techniques"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalDysfonctionnements} alarme{totalDysfonctionnements > 1 ? "s" : ""} technique{totalDysfonctionnements > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {dysfonctionnements.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune alarme technique signalée pour cet immeuble.
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
                Nombre d&apos;Alarmes techniques
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                N°COMPTEUR
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                EMPLAÇEMENT
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                FLUIDE
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                TYPE D&apos;ALARME
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                NB DE JOURS
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {dysfonctionnements.map((dysfonctionnement, index) => {
              const key = dysfonctionnement.PkDysfonctionnement ?? dysfonctionnement.Appareil?.Numero ?? `dysfonctionnement-${index}`;
              const compteur = dysfonctionnement.Appareil?.Numero ?? "—";
              const emplacement = dysfonctionnement.Appareil?.Emplacement ?? "—";
              const rawFluide = dysfonctionnement.Appareil?.Fluide ?? "";
              const fluide =
                rawFluide === "EC"
                  ? "Eau chaude"
                  : rawFluide === "EF"
                  ? "Eau froide"
                  : rawFluide || "—";
              const typeAlarme = dysfonctionnement.Dysfonctionnement?.Type ?? dysfonctionnement.TypeDysfonctionnement ?? "—";
              const nbJours = dysfonctionnement.Dysfonctionnement?.NbJours ?? dysfonctionnement.Dysfonctionnement?.Duree ?? null;

              return (
                <TableRow key={key} className="align-top">
                  <TableCell className="py-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 rounded-xl bg-red-50 p-3 dark:bg-red-500/10">
                        <StatusIconsDysfonctionnement
                          size={22}
                          className="text-red-600 dark:text-red-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {getDysfunctionCount(dysfonctionnement)}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {dysfonctionnement.Occupant?.Ref ?? "Réf. client inconnue"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Logement {dysfonctionnement.Logement?.NumOrdre ?? "—"} –{" "}
                          {dysfonctionnement.Occupant?.Nom ?? "Occupant inconnu"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Étage {dysfonctionnement.Logement?.NumEtage ?? "—"} | Bât.{" "}
                          {dysfonctionnement.Logement?.NumBatiment ?? "—"}
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
                    {typeAlarme}
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
