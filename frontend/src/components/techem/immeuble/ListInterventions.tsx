"use client";

import { useEffect, useState } from "react";
import StatusIconsAlerte from "@/components/techem/images/StatusIconsAlerte";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImmeubles } from "@/lib/hooks/useImmeubles";
import type { Building, DepannageRecord } from "@/lib/types/api";

interface ListInterventionsProps {
  pkImmeuble: string;
}

const formatDate = (value?: string): string => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getStatusClasses = (statut?: string): string => {
  if (!statut) {
    return "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300";
  }

  if (statut.toLowerCase() === "realise") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (statut.toLowerCase() === "nonrealise") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }

  return "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300";
};

const getInterventionNumber = (depannage: DepannageRecord): string => {
  const numero =
    depannage.Depannage?.Numero ??
    depannage.Depannage?.WorkOrderNumber ??
    "";
  return numero;
};

export default function ListInterventions({
  pkImmeuble,
}: ListInterventionsProps) {
  const { getInterventions } = useImmeubles();
  const [depannages, setDepannages] = useState<DepannageRecord[]>([]);
  const [immeuble, setImmeuble] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInterventions = async () => {
      if (!pkImmeuble) {
        setErrorMessage("Identifiant d'immeuble manquant");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getInterventions(pkImmeuble);
        if (!isMounted) {
          return;
        }

        setDepannages(response.depannages ?? []);
        setImmeuble(response.immeuble ?? null);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error loading interventions:", error);
        if (isMounted) {
          setErrorMessage("Impossible de charger les dépannages.");
          setDepannages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInterventions();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkImmeuble]);

  const renderInterventionInfo = (depannage: DepannageRecord) => {
    const numero = getInterventionNumber(depannage);
    const refClient = depannage.Occupant?.Ref ?? "—";
    const etage = depannage.Logement?.NumEtage ?? "—";
    const numeroLogement = depannage.Logement?.NumOrdre ?? "—";
    const occupant = depannage.Occupant?.Nom ?? "—";

    return (
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
        {numero && (
          <p className="text-gray-900 font-semibold dark:text-white">
            N° intervention : <span>{numero}</span>
          </p>
        )}
        <p>
          Référence client :{" "}
          <span className="text-gray-900 dark:text-white">{refClient}</span>
        </p>
        <p>
          Étage :{" "}
          <span className="text-gray-900 dark:text-white">{etage}</span>
        </p>
        <p>
          N° logement :{" "}
          <span className="text-gray-900 dark:text-white">
            {numeroLogement}
          </span>
        </p>
        <p className="text-gray-900 font-medium dark:text-white">{occupant}</p>
      </div>
    );
  };

  const renderObservation = (depannage: DepannageRecord) => {
    const statut = depannage.Depannage?.Statut;
    const compteRendu = depannage.Depannage?.CompteRendu;

    return (
      <div className="space-y-2">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
            statut
          )}`}
        >
          {statut ?? "—"}
        </span>
        {compteRendu && (
          <p className="text-sm text-gray-600 whitespace-pre-line dark:text-gray-300">
            {compteRendu}
          </p>
        )}
      </div>
    );
  };

  const renderMotif = (depannage: DepannageRecord) => {
    const motif =
      depannage.Depannage?.MotifAbrege ?? depannage.Depannage?.Motif ?? "—";
    return (
      <p className="text-sm text-gray-600 whitespace-pre-line dark:text-gray-300">
        {motif}
      </p>
    );
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-6 pt-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement des dépannages...
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
            {immeuble?.Nom ? `Dépannages – ${immeuble.Nom}` : "Dépannages"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {depannages.length} dépannage{depannages.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {depannages.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucun dépannage enregistré pour cet immeuble.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Intervention
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Motif
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Observation
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {depannages.map((depannage, index) => {
              const key = getInterventionNumber(depannage) || `depannage-${index}`;
              return (
                <TableRow key={key} className="align-top">
                  <TableCell className="py-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10">
                        <StatusIconsAlerte
                          size={22}
                          className="text-amber-600 dark:text-amber-300"
                        />
                      </div>
                      {renderInterventionInfo(depannage)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top text-sm text-gray-700 dark:text-gray-200">
                    {formatDate(depannage.Depannage?.Date)}
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    {renderMotif(depannage)}
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    {renderObservation(depannage)}
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
