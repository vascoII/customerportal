import { api, handleApiError } from "@/lib/api/client";

/**
 * Helper function to download a blob file
 */
function downloadBlob(blob: Blob, filename: string, contentType: string): void {
  const url = window.URL.createObjectURL(new Blob([blob], { type: contentType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Custom hook for Interventions (Depannages) API endpoints.
 *
 * Provides functionality to download intervention reports (PDF).
 *
 * Note: This hook is simpler than others as the Intervention API only provides
 * report download functionality. Other intervention-related endpoints are handled
 * by useImmeubles, useLogements, useOccupant, and useGestionParc hooks.
 *
 * @example
 * ```tsx
 * const { getInterventionReport } = useInterventions();
 *
 * // Download intervention report
 * const handleDownload = async () => {
 *   try {
 *     await getInterventionReport("123456");
 *     console.log("Report downloaded successfully");
 *   } catch (error) {
 *     console.error("Download failed:", error);
 *   }
 * };
 * ```
 */
export function useInterventions() {
  /**
   * Downloads the intervention report PDF for a specific intervention.
   * GET /api/interventions/{pkDepannage}/report
   *
   * @param pkDepannage - The intervention ID (depannage ID)
   * @returns Promise that resolves when the download is complete
   * @throws Error if the download fails
   */
  const getInterventionReport = async (
    pkDepannage: string | number
  ): Promise<void> => {
    try {
      const response = await api.get<Blob>(
        `/interventions/${pkDepannage}/report`,
        {
          responseType: "blob", // Important for downloading files
        }
      );

      const contentType =
        response.headers["content-type"] || "application/pdf";
      const filename =
        response.headers["content-disposition"]?.split("filename=")[1]?.replace(/['"]/g, "") ||
        `relevé-intervention-${pkDepannage}-${new Date()
          .toLocaleDateString("fr-FR")
          .replace(/\//g, "-")}.pdf`;

      downloadBlob(response.data, filename, contentType);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  return {
    // Helper functions for downloads
    getInterventionReport,
  };
}

