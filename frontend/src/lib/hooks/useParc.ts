import { useQuery } from "@tanstack/react-query";
import { api, extractApiData, handleApiError } from "@/lib/api/client";
import { getStaleTimeUntilMidnight } from "@/lib/utils/cache";
import type { ChantierData } from "@/lib/types/api";

/**
 * Response from /api/parc endpoint
 */
export interface ParcApiResponse {
  board: {
    nbImmeubles?: number;
    nbImmeublesTelereleve?: number;
    nbImmeublesTransfertFichiers?: number;
    nbCompteursARelever?: number;
    nbCompteursReleves?: number;
    nbLogements?: number;
    nbCompteurs?: number;
    nbCompteursEc?: number;
    nbCompteursEf?: number;
    nbCompteursRepart?: number;
    nbCompteursCet?: number;
    nbCompteursCapteur?: number;
    nbCompteursElect?: number;
    nbCompteursGaz?: number;
    nbFuites?: number;
    degresFuites?: number;
    nbDepannages?: number;
    degresDepannages?: number;
    nbDysfonctionnements?: number;
    degresDysfonctionnements?: number;
    nbAnomalies?: number;
    degresAnomalies?: number;
    nbChantiers?: number;
    nbCompteursPoses?: number;
    nbCompteursCommandes?: number;
    pcImmeublesTelereleve?: number;
    pcImmeublesTransfertFichiers?: number;
    [key: string]: any;
  };
  chantier: ChantierData;
  demo?: boolean;
}

/**
 * Custom hook for Parc API endpoints
 *
 * Provides parc-related API calls including:
 * - Parc dashboard data (board statistics, chantier)
 *
 * @example
 * ```tsx
 * const { parcData, isParcLoading, parcError } = useParc();
 *
 * // Access parc data
 * const pcImmeublesTelereleve = parcData?.board?.pcImmeublesTelereleve;
 * ```
 */
export function useParc() {
  /**
   * Get parc dashboard data query
   * GET /api/parc
   */
  const parcQuery = useQuery({
    queryKey: ["parc"],
    queryFn: async (): Promise<ParcApiResponse> => {
      const response = await api.get<{ success: boolean; data: ParcApiResponse }>("/parc");
      return extractApiData<ParcApiResponse>(response);
    },
    retry: false,
    staleTime: getStaleTimeUntilMidnight(), // Cache until midnight (SOAP data updated once per night at 2 AM)
  });

  return {
    parcData: parcQuery.data,
    isParcLoading: parcQuery.isLoading,
    parcError: parcQuery.error ? handleApiError(parcQuery.error) : null,
  };
}

