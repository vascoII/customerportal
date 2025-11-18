"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFactures } from "@/lib/hooks/useFactures";
import type { Invoice } from "@/lib/types/api";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { handleApiError } from "@/lib/api/client";

export default function ListFactures() {
  const { getFacturesQuery, downloadFacture } = useFactures();
  const [factures, setFactures] = useState<Invoice[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Load factures data
  const {
    data: facturesData,
    isLoading: isLoadingQuery,
    error: facturesError,
  } = getFacturesQuery;

  useEffect(() => {
    if (facturesData) {
      setFactures(facturesData.factures ?? []);
      setErrorMessage(null);
    }
  }, [facturesData]);

  // Handle download
  const handleDownload = async (pkFacture: string) => {
    try {
      setDownloadingId(pkFacture);
      await downloadFacture(pkFacture);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg || "Une erreur s'est produite lors du téléchargement.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Show loading state
  if (isLoadingQuery) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement des factures...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (errorMessage || facturesError) {
    const errorMsg = errorMessage || (typeof facturesError === 'string' ? facturesError : facturesError?.message) || "Impossible de charger les factures.";
    return (
      <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50 px-4 py-6 dark:border-red-900/60 dark:bg-red-950/40 sm:px-6">
        <Alert
          variant="error"
          title="Erreur"
          message={errorMsg}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Liste des Factures
          </h3>
          {factures.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {factures.length} facture{factures.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4">
          <Alert variant="error" title="Erreur" message={errorMessage} />
        </div>
      )}

      {factures.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aucune facture disponible.
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
                Numéro de facture
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Code gestionnaire
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Adresse
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Ville
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Code postal
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Date d&apos;émission
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Montant total HT
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Montant total TTC
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Montant total à payer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Télécharger
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {factures.map((facture) => {
              const pkFacture = facture.pkFacture;
              const numero = facture.numero ?? "—";
              const codeGestio = facture.codeGestio ?? "—";
              const adresse = facture.adresse ?? "—";
              const ville = facture.ville ?? "—";
              const cp = facture.cp ?? "—";
              const dateEdition = facture.dateEditionFormatted ?? facture.dateEdition ?? "—";
              const montantHT = facture.montantTotalHTFormatted ?? "—";
              const montantTTC = facture.montantTotalTTCFormatted ?? "—";
              const montantAPayer = facture.montantTotalAPayerFormatted ?? "—";
              const isDownloading = downloadingId === pkFacture;

              return (
                <TableRow key={pkFacture} className="align-top">
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {numero}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {codeGestio}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {adresse}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {ville}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {cp}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {dateEdition}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {montantHT}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {montantTTC}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                    {montantAPayer}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(pkFacture)}
                        disabled={isDownloading}
                        className="inline-flex items-center gap-2"
                      >
                        <svg
                          className="stroke-current"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 10.6667V2.66667"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.33333 7.33333L8 10L10.6667 7.33333"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.66667 13.3333H13.3333"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {isDownloading ? "Téléchargement..." : "Télécharger"}
                      </Button>
                    </div>
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

