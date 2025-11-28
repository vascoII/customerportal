"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useTickets } from "@/lib/hooks/useTickets";
import type { Ticket } from "@/lib/types/api";
import { useExport } from "@/lib/hooks/useExport";

type SortKey =
  | "caseNumber"
  | "refLogement"
  | "nom"
  | "email"
  | "tel"
  | "statut"
  | "date"
  | "lastUpdate";

export default function ListTickets() {
  const {
    ticketsData,
    ticketsIsLoading,
    ticketsError,
  } = useTickets();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  // Excel export placeholder
  const exportExcelFn = async () => {
    throw new Error("L'export Excel des tickets n'est pas encore disponible.");
  };

  const {
    handleExport: handleExportExcel,
    isExporting,
    error: exportError,
    clearError: clearExportError,
  } = useExport(exportExcelFn, {
    errorTitle: "Erreur d'export Excel",
  });

  // Load tickets from query
  useEffect(() => {
    if (ticketsData) {
      setTickets(ticketsData.tickets ?? []);
      setErrorMessage(null);
    }
  }, [ticketsData]);

  // Reset pagination when filters, status or sorting change
  useEffect(() => {
    setPage(1);
  }, [filterText, selectedStatus, sortConfig, tickets.length]);

  const allStatuses = useMemo(() => {
    const set = new Set<string>();

    tickets.forEach((t) => {
      const raw = (t.Statut ?? "").toString().trim();
      if (!raw) return;

      // Regrouper tous les statuts commençant par "Clos" dans un seul onglet
      if (raw.toLowerCase().startsWith("clos")) {
        set.add("Clos");
      } else {
        set.add(raw);
      }
    });

    const list = Array.from(set);
    list.sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
    return ["Tous", ...list];
  }, [tickets]);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const getSortableValue = (ticket: Ticket, key: SortKey) => {
    switch (key) {
      case "caseNumber":
        return ticket.CaseNumber ?? "";
      case "refLogement":
        return ticket.RefLogement ?? "";
      case "nom":
        return ticket.Nom ?? "";
      case "email":
        return ticket.Email ?? "";
      case "tel":
        return ticket.TelFixe ?? ticket.TelMobile ?? "";
      case "statut":
        return ticket.Statut ?? "";
      case "date":
        return ticket.TicketDate ?? "";
      case "lastUpdate":
        return ticket.LastUpdateDate ?? "";
      default:
        return "";
    }
  };

  const displayedTickets = useMemo(() => {
    let data = [...tickets];

    // Onglet par statut (avec fusion des statuts "Clos ...")
    if (selectedStatus !== "Tous") {
      data = data.filter((t) => {
        const raw = (t.Statut ?? "").toString().trim();
        if (selectedStatus === "Clos") {
          return raw.toLowerCase().startsWith("clos");
        }
        return raw === selectedStatus;
      });
    }

    // Filtre texte global
    if (filterText.trim()) {
      const needle = filterText.toLowerCase();
      data = data.filter((t) => {
        const caseNumber = (t.CaseNumber ?? "").toLowerCase();
        const refLogement = (t.RefLogement ?? "").toLowerCase();
        const nom = (t.Nom ?? "").toLowerCase();
        const email = (t.Email ?? "").toLowerCase();
        const tel =
          (t.TelFixe ?? "").toLowerCase() +
          " " +
          (t.TelMobile ?? "").toLowerCase();
        const statut = (t.Statut ?? "").toLowerCase();
        const objet = (t.ObjetRetour ?? "").toLowerCase();

        return (
          caseNumber.includes(needle) ||
          refLogement.includes(needle) ||
          nom.includes(needle) ||
          email.includes(needle) ||
          tel.includes(needle) ||
          statut.includes(needle) ||
          objet.includes(needle)
        );
      });
    }

    // Tri
    if (sortConfig) {
      data.sort((a, b) => {
        const aVal = String(getSortableValue(a, sortConfig.key) ?? "");
        const bVal = String(getSortableValue(b, sortConfig.key) ?? "");
        if (aVal === bVal) return 0;
        const result = aVal.localeCompare(bVal, "fr", {
          numeric: true,
          sensitivity: "base",
        });
        return sortConfig.direction === "asc" ? result : -result;
      });
    }

    return data;
  }, [tickets, filterText, selectedStatus, sortConfig]);

  // Show loading state
  if (ticketsIsLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chargement des tickets...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (errorMessage || ticketsError) {
    const errorMsg =
      errorMessage ||
      (typeof ticketsError === "string"
        ? ticketsError
        : ticketsError?.message) ||
      "Impossible de charger les tickets.";
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
            Liste des Tickets
          </h3>
          {displayedTickets.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {displayedTickets.length} ticket
              {displayedTickets.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="w-full sm:w-52">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrer (statut, n° ticket, logement...)"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => setFilterText("")}
            >
              Réinitialiser filtre
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleExportExcel}
              disabled={isExporting || displayedTickets.length === 0}
            >
              {isExporting ? "Export en cours..." : "Export Excel"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {(errorMessage || exportError) && (
        <div className="mb-4">
          <Alert
            variant="error"
            title="Erreur"
            message={errorMessage ?? exportError?.message ?? ""}
          />
          {exportError && (
            <button
              type="button"
              onClick={clearExportError}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Fermer
            </button>
          )}
        </div>
      )}

      {/* Onglets par statut */}
      {allStatuses.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
          {allStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`rounded-full px-3 py-1 text-xs font-medium border ${
                selectedStatus === status
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Pagination + table */}
      {(() => {
        const totalItems = displayedTickets.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const currentPage = Math.min(page, totalPages);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTickets = displayedTickets.slice(startIndex, endIndex);

        if (totalItems === 0) {
          return (
            <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aucun ticket disponible.
              </p>
            </div>
          );
        }

        return (
          <>
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("caseNumber")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Numéro de ticket</span>
                      {sortConfig?.key === "caseNumber" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("refLogement")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Réf. logement</span>
                      {sortConfig?.key === "refLogement" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("nom")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Nom occupant</span>
                      {sortConfig?.key === "nom" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("email")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Email</span>
                      {sortConfig?.key === "email" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("tel")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Téléphone</span>
                      {sortConfig?.key === "tel" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("statut")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Statut</span>
                      {sortConfig?.key === "statut" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("date")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Date de création</span>
                      {sortConfig?.key === "date" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("lastUpdate")}
                      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Dernière mise à jour</span>
                      {sortConfig?.key === "lastUpdate" && (
                        <span>
                          {sortConfig.direction === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedTickets.map((ticket) => {
                  const caseNumber = ticket.CaseNumber ?? "—";
                  const refLogement = ticket.RefLogement ?? "—";
                  const nom = ticket.Nom ?? "—";
                  const email = ticket.Email ?? "—";
                  const tel = ticket.TelFixe ?? ticket.TelMobile ?? "—";
                  const statut = ticket.Statut ?? "—";
                  const ticketDate = ticket.TicketDate
                    ? new Date(ticket.TicketDate).toLocaleString("fr-FR")
                    : "—";
                  const lastUpdate = ticket.LastUpdateDate
                    ? new Date(ticket.LastUpdateDate).toLocaleString("fr-FR")
                    : "—";

                  return (
                    <TableRow
                      key={caseNumber + String(ticket.CaseId)}
                      className="align-top"
                    >
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {caseNumber}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {refLogement}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {nom}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {email}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {tel}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {statut}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {ticketDate}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-200">
                        {lastUpdate}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Affichage{" "}
                <span className="font-medium">
                  {startIndex + 1}-
                  {Math.min(endIndex, totalItems)}
                </span>{" "}
                sur <span className="font-medium">{totalItems}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Précédent
                </Button>
                <span>
                  Page{" "}
                  <span className="font-medium">
                    {currentPage}
                  </span>{" "}
                  / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Suivant
                </Button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}

