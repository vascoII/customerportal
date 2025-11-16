import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api, extractApiData, handleApiError } from "@/lib/api/client";
import { getStaleTimeUntilMidnight } from "@/lib/utils/cache";
import type {
  Housing,
  InterventionDetails,
  Intervention,
  AnomalyListResponse,
  LeakListResponse,
  DysfunctionListResponse,
  FilterValues,
  Subcontractor,
  User,
  ConsumptionTab,
} from "@/lib/types/api";

/**
 * Response from /api/occupant endpoint
 */
export interface OccupantLogementResponse {
  logement: Housing;
  consoTabs: ConsumptionTab;
  soustraitants: Subcontractor[];
}

/**
 * Response from /api/occupant/simulateur endpoint
 */
export interface OccupantSimulatorResponse {
  logement: Housing;
  consoTabs: ConsumptionTab;
}

/**
 * Response from /api/occupant/interventions/{pkIntervention}
 */
export interface OccupantInterventionResponse {
  logement: Housing;
  depannage: InterventionDetails;
}

/**
 * Response from /api/occupant/interventions
 */
export interface OccupantInterventionsListResponse {
  logement: Housing;
  depannages: Intervention[];
  filters: FilterValues;
}

/**
 * Response from /api/occupant/my-account
 */
export interface OccupantMyAccountResponse {
  logement: Housing;
  consoTabs: ConsumptionTab;
  rgpdcheckboxvalue: string; // 'true' or 'false'
}

/**
 * Response from /api/occupant/alertes
 */
export interface OccupantAlertesResponse {
  logement: Housing;
  consoTabs: ConsumptionTab;
  user: User;
}

/**
 * Parameters for updating alerts
 */
export interface UpdateAlertesParams {
  SEUIL_CONSO_ACTIF?: boolean; // Will be converted to 'O' or 'N'
  [key: string]: any;
}

/**
 * Helper function to download a blob file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Custom hook for Occupant API endpoints
 *
 * Provides all occupant-related API calls including:
 * - Occupant logement details
 * - Simulator data
 * - Interventions, leaks, anomalies, dysfunctions
 * - Reports (PDF downloads)
 * - Exports (CSV downloads)
 * - Account management
 * - Alerts configuration
 *
 * @example
 * ```tsx
 * const { getOccupantLogement, getInterventions, exportAnomalies, updateAlertes } = useOccupant();
 *
 * // Get occupant logement
 * const logement = await getOccupantLogement();
 *
 * // Get interventions
 * const interventions = await getInterventions();
 *
 * // Export anomalies
 * await exportAnomalies();
 *
 * // Update alerts
 * await updateAlertes({ SEUIL_CONSO_ACTIF: true });
 * ```
 */
export function useOccupant() {
  const queryClient = useQueryClient();

  /**
   * Get current occupant's logement query
   * GET /api/occupant
   */
  const getOccupantLogementQuery = useQuery({
    queryKey: ["occupant", "logement"],
    queryFn: async (): Promise<OccupantLogementResponse> => {
      const response = await api.get<OccupantLogementResponse>("/occupant");
      return extractApiData<OccupantLogementResponse>(response);
    },
    retry: false,
    staleTime: getStaleTimeUntilMidnight(), // Cache until midnight (SOAP data updated once per night at 2 AM)
  });

  /**
   * Get current occupant's logement
   * @returns Promise with occupant logement data
   */
  const getOccupantLogement = async (): Promise<OccupantLogementResponse> => {
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "logement"],
      queryFn: async (): Promise<OccupantLogementResponse> => {
        const response = await api.get<OccupantLogementResponse>("/occupant");
        return extractApiData<OccupantLogementResponse>(response);
      },
      retry: false,
      staleTime: getStaleTimeUntilMidnight(),
    });
    return result;
  };

  /**
   * Get simulator data query
   * GET /api/occupant/simulateur
   */
  const getSimulatorQuery = useQuery({
    queryKey: ["occupant", "simulateur"],
    queryFn: async (): Promise<OccupantSimulatorResponse> => {
      const response = await api.get<OccupantSimulatorResponse>(
        "/occupant/simulateur"
      );
      return extractApiData<OccupantSimulatorResponse>(response);
    },
    retry: false,
    staleTime: getStaleTimeUntilMidnight(), // Cache until midnight (SOAP data updated once per night at 2 AM)
    enabled: false, // Disabled by default
  });

  /**
   * Get simulator data
   * @returns Promise with simulator data
   */
  const getSimulator = async (): Promise<OccupantSimulatorResponse> => {
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "simulateur"],
      queryFn: async (): Promise<OccupantSimulatorResponse> => {
        const response = await api.get<OccupantSimulatorResponse>(
          "/occupant/simulateur"
        );
        return extractApiData<OccupantSimulatorResponse>(response);
      },
      retry: false,
      staleTime: getStaleTimeUntilMidnight(),
    });
    return result;
  };

  /**
   * Get intervention details query
   * GET /api/occupant/interventions/{pkIntervention}
   * @param pkIntervention - Intervention ID
   */
  const getInterventionQuery = (pkIntervention: string | number) => {
    return useQuery({
      queryKey: ["occupant", "interventions", pkIntervention],
      queryFn: async (): Promise<OccupantInterventionResponse> => {
        const response = await api.get<OccupantInterventionResponse>(
          `/occupant/interventions/${pkIntervention}`
        );
        return extractApiData<OccupantInterventionResponse>(response);
      },
      enabled: !!pkIntervention,
      retry: false,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Get intervention details
   * @param pkIntervention - Intervention ID
   * @returns Promise with intervention details
   */
  const getIntervention = async (
    pkIntervention: string | number
  ): Promise<OccupantInterventionResponse> => {
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "interventions", pkIntervention],
      queryFn: async (): Promise<OccupantInterventionResponse> => {
        const response = await api.get<OccupantInterventionResponse>(
          `/occupant/interventions/${pkIntervention}`
        );
        return extractApiData<OccupantInterventionResponse>(response);
      },
      retry: false,
      staleTime: 5 * 60 * 1000,
    });
    return result;
  };

  /**
   * Get interventions list query
   * GET /api/occupant/interventions
   */
  const getInterventionsQuery = useQuery({
    queryKey: ["occupant", "interventions"],
    queryFn: async (): Promise<OccupantInterventionsListResponse> => {
      const response = await api.get<OccupantInterventionsListResponse>(
        "/occupant/interventions"
      );
      return extractApiData<OccupantInterventionsListResponse>(response);
    },
    retry: false,
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Get interventions list
   * @returns Promise with interventions list
   */
  const getInterventions = async (): Promise<OccupantInterventionsListResponse> => {
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "interventions"],
      queryFn: async (): Promise<OccupantInterventionsListResponse> => {
        const response = await api.get<OccupantInterventionsListResponse>(
          "/occupant/interventions"
        );
        return extractApiData<OccupantInterventionsListResponse>(response);
      },
      retry: false,
      staleTime: 2 * 60 * 1000,
    });
    return result;
  };

  /**
   * Get leaks list query
   * GET /api/occupant/fuites
   * @param appareil - Optional device ID
   */
  const getFuitesQuery = (appareil?: string) => {
    return useQuery({
      queryKey: ["occupant", "fuites", appareil],
      queryFn: async (): Promise<LeakListResponse> => {
        const params = appareil ? { appareil } : {};
        const response = await api.get<LeakListResponse>("/occupant/fuites", {
          params,
        });
        return extractApiData<LeakListResponse>(response);
      },
      retry: false,
      staleTime: getStaleTimeUntilMidnight(), // Cache until midnight (SOAP data updated once per night at 2 AM)
    });
  };

  /**
   * Get leaks list
   * @param appareil - Optional device ID
   * @returns Promise with leaks list
   */
  const getFuites = async (appareil?: string): Promise<LeakListResponse> => {
    const params = appareil ? { appareil } : {};
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "fuites", appareil],
      queryFn: async (): Promise<LeakListResponse> => {
        const response = await api.get<LeakListResponse>("/occupant/fuites", {
          params,
        });
        return extractApiData<LeakListResponse>(response);
      },
      retry: false,
      staleTime: getStaleTimeUntilMidnight(),
    });
    return result;
  };

  /**
   * Get dysfunctions list query
   * GET /api/occupant/dysfonctionnements
   */
  const getDysfonctionnementsQuery = useQuery({
    queryKey: ["occupant", "dysfonctionnements"],
    queryFn: async (): Promise<DysfunctionListResponse> => {
      const response = await api.get<DysfunctionListResponse>(
        "/occupant/dysfonctionnements"
      );
      return extractApiData<DysfunctionListResponse>(response);
    },
    retry: false,
    staleTime: getStaleTimeUntilMidnight(), // Cache until midnight (SOAP data updated once per night at 2 AM)
  });

  /**
   * Get dysfunctions list
   * @returns Promise with dysfunctions list
   */
  const getDysfonctionnements = async (): Promise<DysfunctionListResponse> => {
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "dysfonctionnements"],
      queryFn: async (): Promise<DysfunctionListResponse> => {
        const response = await api.get<DysfunctionListResponse>(
          "/occupant/dysfonctionnements"
        );
        return extractApiData<DysfunctionListResponse>(response);
      },
      retry: false,
      staleTime: getStaleTimeUntilMidnight(),
    });
    return result;
  };

  /**
   * Get anomalies list query
   * GET /api/occupant/anomalies
   * @param appareil - Optional device ID
   */
  const getAnomaliesQuery = (appareil?: string) => {
    return useQuery({
      queryKey: ["occupant", "anomalies", appareil],
      queryFn: async (): Promise<AnomalyListResponse> => {
        const params = appareil ? { appareil } : {};
        const response = await api.get<AnomalyListResponse>(
          "/occupant/anomalies",
          { params }
        );
        return extractApiData<AnomalyListResponse>(response);
      },
      retry: false,
      staleTime: getStaleTimeUntilMidnight(), // Cache until midnight (SOAP data updated once per night at 2 AM)
    });
  };

  /**
   * Get anomalies list
   * @param appareil - Optional device ID
   * @returns Promise with anomalies list
   */
  const getAnomalies = async (
    appareil?: string
  ): Promise<AnomalyListResponse> => {
    const params = appareil ? { appareil } : {};
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "anomalies", appareil],
      queryFn: async (): Promise<AnomalyListResponse> => {
        const response = await api.get<AnomalyListResponse>(
          "/occupant/anomalies",
          { params }
        );
        return extractApiData<AnomalyListResponse>(response);
      },
      retry: false,
      staleTime: getStaleTimeUntilMidnight(),
    });
    return result;
  };

  /**
   * Export anomalies to CSV
   * GET /api/occupant/anomalies/export
   * Downloads the file automatically
   * @returns Promise that resolves when download is complete
   */
  const exportAnomalies = async (): Promise<void> => {
    try {
      const response = await api.get("/occupant/anomalies/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      downloadBlob(blob, "export-anomalies.csv");
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(`Failed to export anomalies: ${errorMessage}`);
    }
  };

  /**
   * Export leaks to CSV
   * GET /api/occupant/fuites/export
   * Downloads the file automatically
   * @returns Promise that resolves when download is complete
   */
  const exportFuites = async (): Promise<void> => {
    try {
      const response = await api.get("/occupant/fuites/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      downloadBlob(blob, "export-fuites.csv");
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(`Failed to export leaks: ${errorMessage}`);
    }
  };

  /**
   * Export interventions to CSV
   * GET /api/occupant/interventions/export
   * Downloads the file automatically
   * @returns Promise that resolves when download is complete
   */
  const exportInterventions = async (): Promise<void> => {
    try {
      const response = await api.get("/occupant/interventions/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      downloadBlob(blob, "export-depannages.csv");
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(`Failed to export interventions: ${errorMessage}`);
    }
  };

  /**
   * Export dysfunctions to CSV
   * GET /api/occupant/dysfonctionnements/export
   * Downloads the file automatically
   * @returns Promise that resolves when download is complete
   */
  const exportDysfonctionnements = async (): Promise<void> => {
    try {
      const response = await api.get("/occupant/dysfonctionnements/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      downloadBlob(blob, "export-autres-dysfonctionnemnts.csv");
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(`Failed to export dysfunctions: ${errorMessage}`);
    }
  };

  /**
   * Get water report (PDF)
   * GET /api/occupant/{pkOccupant}/releve-eau
   * Downloads the file automatically
   * @param pkOccupant - Occupant ID
   * @returns Promise that resolves when download is complete
   */
  const getEauReleve = async (
    pkOccupant: string | number
  ): Promise<void> => {
    try {
      const response = await api.get(
        `/occupant/${pkOccupant}/releve-eau`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `relevé-${dateStr}.pdf`;

      downloadBlob(blob, filename);
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(`Failed to download water report: ${errorMessage}`);
    }
  };

  /**
   * Get repartition report (PDF)
   * GET /api/occupant/{pkOccupant}/releve-repart/{pkImmeuble}
   * Downloads the file automatically
   * @param pkOccupant - Occupant ID
   * @param pkImmeuble - Building ID
   * @returns Promise that resolves when download is complete
   */
  const getRepartReleve = async (
    pkOccupant: string | number,
    pkImmeuble: string | number
  ): Promise<void> => {
    try {
      const response = await api.get(
        `/occupant/${pkOccupant}/releve-repart/${pkImmeuble}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `relevé-${dateStr}.pdf`;

      downloadBlob(blob, filename);
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(
        `Failed to download repartition report: ${errorMessage}`
      );
    }
  };

  /**
   * Get note report (PDF)
   * GET /api/occupant/{pkOccupant}/releve-note/{pkImmeuble}/{energie}
   * Downloads the file automatically
   * @param pkOccupant - Occupant ID
   * @param pkImmeuble - Building ID
   * @param energie - Energy type ('CHAUFFAGE' or 'EAU')
   * @returns Promise that resolves when download is complete
   */
  const getNoteReleve = async (
    pkOccupant: string | number,
    pkImmeuble: string | number,
    energie: "CHAUFFAGE" | "EAU"
  ): Promise<void> => {
    try {
      const response = await api.get(
        `/occupant/${pkOccupant}/releve-note/${pkImmeuble}/${energie}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `relevé-${dateStr}.pdf`;

      downloadBlob(blob, filename);
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(`Failed to download note report: ${errorMessage}`);
    }
  };

  /**
   * Get my account information query
   * GET /api/occupant/my-account
   */
  const getMyAccountQuery = useQuery({
    queryKey: ["occupant", "my-account"],
    queryFn: async (): Promise<OccupantMyAccountResponse> => {
      const response = await api.get<OccupantMyAccountResponse>(
        "/occupant/my-account"
      );
      return extractApiData<OccupantMyAccountResponse>(response);
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Get my account information
   * @returns Promise with account information
   */
  const getMyAccount = async (): Promise<OccupantMyAccountResponse> => {
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "my-account"],
      queryFn: async (): Promise<OccupantMyAccountResponse> => {
        const response = await api.get<OccupantMyAccountResponse>(
          "/occupant/my-account"
        );
        return extractApiData<OccupantMyAccountResponse>(response);
      },
      retry: false,
      staleTime: 5 * 60 * 1000,
    });
    return result;
  };

  /**
   * Get or update alerts mutation
   * GET/POST /api/occupant/alertes
   * @param params - Optional alert parameters for update
   */
  const alertesMutation = useMutation({
    mutationFn: async (
      params?: UpdateAlertesParams
    ): Promise<OccupantAlertesResponse> => {
      // If params provided, it's a POST request (update)
      if (params) {
        // Convert SEUIL_CONSO_ACTIF boolean to 'O' or 'N'
        const data: any = { ...params };
        if (typeof data.SEUIL_CONSO_ACTIF === "boolean") {
          data.SEUIL_CONSO_ACTIF = data.SEUIL_CONSO_ACTIF ? "O" : "N";
        }

        const response = await api.post<OccupantAlertesResponse>(
          "/occupant/alertes",
          data
        );
        return extractApiData<OccupantAlertesResponse>(response);
      } else {
        // GET request (fetch)
        const response = await api.get<OccupantAlertesResponse>(
          "/occupant/alertes"
        );
        return extractApiData<OccupantAlertesResponse>(response);
      }
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["occupant", "logement"] });
      queryClient.invalidateQueries({ queryKey: ["occupant", "my-account"] });
    },
  });

  /**
   * Get alerts configuration
   * @returns Promise with alerts data
   */
  const getAlertes = async (): Promise<OccupantAlertesResponse> => {
    const result = await queryClient.fetchQuery({
      queryKey: ["occupant", "alertes"],
      queryFn: async (): Promise<OccupantAlertesResponse> => {
        const response = await api.get<OccupantAlertesResponse>(
          "/occupant/alertes"
        );
        return extractApiData<OccupantAlertesResponse>(response);
      },
      retry: false,
      staleTime: 2 * 60 * 1000,
    });
    return result;
  };

  /**
   * Update alerts configuration
   * @param params - Alert parameters
   * @returns Promise with updated alerts data
   */
  const updateAlertes = async (
    params: UpdateAlertesParams
  ): Promise<OccupantAlertesResponse> => {
    return alertesMutation.mutateAsync(params);
  };

  /**
   * Get alerts query
   * GET /api/occupant/alertes
   */
  const getAlertesQuery = useQuery({
    queryKey: ["occupant", "alertes"],
    queryFn: async (): Promise<OccupantAlertesResponse> => {
      const response = await api.get<OccupantAlertesResponse>(
        "/occupant/alertes"
      );
      return extractApiData<OccupantAlertesResponse>(response);
    },
    retry: false,
    staleTime: 2 * 60 * 1000,
  });

  return {
    // Query functions (async functions that refetch)
    getOccupantLogement,
    getSimulator,
    getIntervention,
    getInterventions,
    getFuites,
    getAnomalies,
    getDysfonctionnements,
    getMyAccount,
    getAlertes,

    // Mutation functions
    updateAlertes,

    // Export/Download functions
    exportAnomalies,
    exportFuites,
    exportInterventions,
    exportDysfonctionnements,
    getEauReleve,
    getRepartReleve,
    getNoteReleve,

    // Mutation states
    isUpdatingAlertes: alertesMutation.isPending,

    // Mutation errors
    updateAlertesError: alertesMutation.error
      ? handleApiError(alertesMutation.error)
      : null,

    // Query states (from reactive queries)
    occupantLogementData: getOccupantLogementQuery.data,
    occupantLogementIsLoading: getOccupantLogementQuery.isLoading,
    occupantLogementError: getOccupantLogementQuery.error
      ? handleApiError(getOccupantLogementQuery.error)
      : null,

    simulatorData: getSimulatorQuery.data,
    simulatorIsLoading: getSimulatorQuery.isLoading,
    simulatorError: getSimulatorQuery.error
      ? handleApiError(getSimulatorQuery.error)
      : null,

    interventionsData: getInterventionsQuery.data,
    interventionsIsLoading: getInterventionsQuery.isLoading,
    interventionsError: getInterventionsQuery.error
      ? handleApiError(getInterventionsQuery.error)
      : null,

    dysfonctionnementsData: getDysfonctionnementsQuery.data,
    dysfonctionnementsIsLoading: getDysfonctionnementsQuery.isLoading,
    dysfonctionnementsError: getDysfonctionnementsQuery.error
      ? handleApiError(getDysfonctionnementsQuery.error)
      : null,

    myAccountData: getMyAccountQuery.data,
    myAccountIsLoading: getMyAccountQuery.isLoading,
    myAccountError: getMyAccountQuery.error
      ? handleApiError(getMyAccountQuery.error)
      : null,

    alertesData: getAlertesQuery.data,
    alertesIsLoading: getAlertesQuery.isLoading,
    alertesError: getAlertesQuery.error
      ? handleApiError(getAlertesQuery.error)
      : null,

    // Query hooks for reactive usage (with parameters)
    getInterventionQuery,
    getFuitesQuery,
    getAnomaliesQuery,

    // Direct access to mutations/queries for advanced usage
    alertesMutation,
    getOccupantLogementQuery,
    getSimulatorQuery,
    getInterventionsQuery,
    getDysfonctionnementsQuery,
    getMyAccountQuery,
    getAlertesQuery,
  };
}

