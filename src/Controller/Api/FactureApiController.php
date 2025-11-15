<?php

namespace App\Controller\Api;

use App\Service\Client;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * API Controller for Factures (Invoices)
 * 
 * @Route("/api/factures", name="api_facture_")
 */
class FactureApiController extends AbstractApiController
{
  /**
   * Get list of invoices
   * 
   * @Route("", name="list", methods={"GET"})
   */
  public function list(Request $request): JsonResponse
  {
    $client = $this->getAuthenticatedClient();
    if ($client instanceof JsonResponse) {
      return $client;
    }

    try {
      $factures = $client->getFactures();

      if (empty($factures)) {
        return $this->success([], 'No invoices found');
      }

      $listFactures = (array) $factures->ListeFactures;
      if (isset($listFactures['facture'])) {
        $listFactures = $listFactures['facture'];
      }

      // Normalize data for API
      $normalizedFactures = [];
      foreach ($listFactures as $facture) {
        $normalizedFactures[] = [
          'pkFacture' => $facture->PKFacture ?? null,
          'numero' => $facture->Numero ?? null,
          'dateEdition' => isset($facture->DateEdition)
            ? date('Y-m-d', strtotime($facture->DateEdition))
            : null,
          'dateEditionFormatted' => isset($facture->DateEdition)
            ? date('d/m/Y', strtotime($facture->DateEdition))
            : null,
          'montantTotalHT' => $facture->MontantTotalHT ?? null,
          'montantTotalHTFormatted' => isset($facture->MontantTotalHT)
            ? number_format($facture->MontantTotalHT, 2, ',', ' ') . ' €'
            : null,
          'montantTotalTTC' => $facture->MontantTotalTTC ?? null,
          'montantTotalTTCFormatted' => isset($facture->MontantTotalTTC)
            ? number_format($facture->MontantTotalTTC, 2, ',', ' ') . ' €'
            : null,
          'montantTotalAPayer' => $facture->MontantTotalAPayer ?? null,
          'montantTotalAPayerFormatted' => isset($facture->MontantTotalAPayer)
            ? number_format($facture->MontantTotalAPayer, 2, ',', ' ') . ' €'
            : null,
        ];
      }

      return $this->success([
        'factures' => $normalizedFactures,
        'count' => count($normalizedFactures),
      ]);
    } catch (\Exception $e) {
      return $this->error('Error retrieving invoices: ' . $e->getMessage(), 500);
    }
  }

  /**
   * Get invoice details
   * 
   * @Route("/{pkFacture}", name="show", methods={"GET"})
   */
  public function show(int $pkFacture): JsonResponse
  {
    $client = $this->getAuthenticatedClient();
    if ($client instanceof JsonResponse) {
      return $client;
    }

    try {
      $factures = $client->getFactures();

      if (empty($factures)) {
        return $this->notFound('Invoice not found');
      }

      $listFactures = (array) $factures->ListeFactures;
      if (isset($listFactures['facture'])) {
        $listFactures = $listFactures['facture'];
      }

      // Find the specific invoice
      $facture = null;
      foreach ($listFactures as $f) {
        if (isset($f->PKFacture) && $f->PKFacture == $pkFacture) {
          $facture = $f;
          break;
        }
      }

      if (!$facture) {
        return $this->notFound('Invoice not found');
      }

      $normalizedFacture = [
        'pkFacture' => $facture->PKFacture ?? null,
        'numero' => $facture->Numero ?? null,
        'dateEdition' => isset($facture->DateEdition)
          ? date('Y-m-d', strtotime($facture->DateEdition))
          : null,
        'dateEditionFormatted' => isset($facture->DateEdition)
          ? date('d/m/Y', strtotime($facture->DateEdition))
          : null,
        'montantTotalHT' => $facture->MontantTotalHT ?? null,
        'montantTotalHTFormatted' => isset($facture->MontantTotalHT)
          ? number_format($facture->MontantTotalHT, 2, ',', ' ') . ' €'
          : null,
        'montantTotalTTC' => $facture->MontantTotalTTC ?? null,
        'montantTotalTTCFormatted' => isset($facture->MontantTotalTTC)
          ? number_format($facture->MontantTotalTTC, 2, ',', ' ') . ' €'
          : null,
        'montantTotalAPayer' => $facture->MontantTotalAPayer ?? null,
        'montantTotalAPayerFormatted' => isset($facture->MontantTotalAPayer)
          ? number_format($facture->MontantTotalAPayer, 2, ',', ' ') . ' €'
          : null,
      ];

      return $this->success($normalizedFacture);
    } catch (\Exception $e) {
      return $this->error('Error retrieving invoice: ' . $e->getMessage(), 500);
    }
  }

  /**
   * Download invoice PDF
   * 
   * @Route("/{pkFacture}/download", name="download", methods={"GET"})
   */
  public function download(int $pkFacture): Response|JsonResponse
  {
    $client = $this->getAuthenticatedClient();
    if ($client instanceof JsonResponse) {
      return $client;
    }

    try {
      $report = $client->getReportFacture($pkFacture);

      $response = new Response($report);
      $response->headers->set('Content-Type', 'application/pdf');
      $response->headers->set('Content-Disposition', 'inline; filename=facture-' . $pkFacture . '-' . date('d-m-Y') . '.pdf');
      $response->headers->set('Content-Transfer-Encoding', 'binary');
      $response->headers->set('Expires', 0);
      $response->headers->set('Cache-Control', 'no-cache');
      $response->headers->set('Pragma', 'no-cache');
      $response->headers->set('Content-Length', strlen($report));

      return $response;
    } catch (\Exception $e) {
      return $this->error('Error downloading invoice: ' . $e->getMessage(), 500);
    }
  }
}
