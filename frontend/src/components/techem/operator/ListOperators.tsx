"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useOperators } from "@/lib/hooks/useOperators";
import type { Operator } from "@/lib/types/api";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { handleApiError } from "@/lib/api/client";

export default function ListOperators() {
  const { getOperatorsQuery, deleteOperator, isDeleting, deleteError } = useOperators();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Load operators data
  const {
    data: operatorsData,
    isLoading: isLoadingQuery,
    error: operatorsError,
    refetch: refetchOperators,
  } = getOperatorsQuery;

  useEffect(() => {
    if (operatorsData) {
      setOperators(operatorsData.users ?? []);
      setErrorMessage(null);
    }
  }, [operatorsData]);

  // Handle delete confirmation
  const handleDeleteClick = (operator: Operator) => {
    setOperatorToDelete(operator);
    openModal();
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!operatorToDelete?.PKUser) {
      return;
    }

    try {
      await deleteOperator(operatorToDelete.PKUser);
      // Refresh the list
      await refetchOperators();
      closeModal();
      setOperatorToDelete(null);
    } catch (error) {
      console.error("Error deleting operator:", error);
      const errorMessage = handleApiError(error);
      setErrorMessage(
        deleteError || errorMessage || "Une erreur s'est produite lors de la suppression."
      );
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    closeModal();
    setOperatorToDelete(null);
  };

  // Format number with thousands separator
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) {
      return "0";
    }
    return num.toLocaleString('fr-FR');
  };

  // Show loading state
  if (isLoadingQuery) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement des gestionnaires...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (errorMessage || operatorsError) {
    const errorMsg = errorMessage || (typeof operatorsError === 'string' ? operatorsError : operatorsError?.message) || "Impossible de charger les gestionnaires.";
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
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Liste des Gestionnaires
            </h3>
            {operators.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {operators.length} gestionnaire{operators.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/gestionnaire/nouveau">
              <Button
                size="sm"
                variant="primary"
                className="inline-flex items-center gap-2"
              >
                <svg
                  className="stroke-current fill-white"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4.16667V15.8333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.16667 10H15.8333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Nouveau gestionnaire
              </Button>
            </Link>
          </div>
        </div>

        {/* Error message */}
        {deleteError && (
          <div className="mb-4">
            <Alert variant="error" title="Erreur" message={deleteError} />
          </div>
        )}

        {operators.length === 0 ? (
          <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aucun gestionnaire enregistré.
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
                  Nom
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Prénom
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Nombre d&apos;immeubles
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {operators.map((operator) => {
                const pkUser = operator.PKUser;
                const userName = operator.UserName ?? "";
                const firstName = operator.FirstName ?? "";
                const email = operator.EMail ?? operator.LoginID ?? "";
                const nbImmeubles = operator.NbImmeubles ?? 0;

                return (
                  <TableRow key={pkUser} className="align-top">
                    <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                      {userName || "—"}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                      {firstName || "—"}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                      {email || "—"}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                      {formatNumber(nbImmeubles)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/gestionnaire/${pkUser}/edit`}>
                          <Button
                            size="sm"
                            variant="outline"
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
                                d="M8 13.3333H14"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M11 2.33333C11.2652 2.06812 11.6249 1.91919 12 1.91919C12.1857 1.91919 12.3696 1.95528 12.5412 2.02541C12.7128 2.09554 12.8687 2.19835 13 2.32833C13.1313 2.45831 13.2355 2.61288 13.3069 2.78318C13.3783 2.95348 13.4154 3.13605 13.4154 3.32033C13.4154 3.50461 13.3783 3.68718 13.3069 3.85748C13.2355 4.02778 13.1313 4.18235 13 4.31233L4.66667 12.6457L2 13.3333L2.66667 10.6667L11 2.33333Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Editer
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(operator)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-2 text-error-600 hover:text-error-700 hover:border-error-500 dark:text-error-400 dark:hover:text-error-300"
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
                              d="M2 4H3.33333H14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6.66667 7.33333V11.3333"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9.33333 7.33333V11.3333"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Supprimer
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCancelDelete}
        className="max-w-[500px] p-5 lg:p-10"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Confirmer la suppression
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer le gestionnaire{" "}
              <span className="font-medium text-gray-800 dark:text-white/90">
                {operatorToDelete?.FirstName} {operatorToDelete?.UserName}
              </span>
              ? Cette action est irréversible.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-error-500 hover:bg-error-600"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

