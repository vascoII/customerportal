<?php

namespace App\Controller;

use DateTime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Service\GetReportParams;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\Client;

/**
 * Class TableauBordClientController
 * @package App\Controller
 */
class TableauBordClientController extends  AbstractTechemController
{

    #[Route('/parc', name: 'TechemCoreBundle_TableauBordClient_index', requirements: ['_locale' => 'en|fr'])]
    public function indexAction(Request $request)
    {
        $client = $this->getClient();
        if (is_null($client)) {
            return $this->redirectToRoute('logout');
        }
		

        $board = $client->getMyTableauBordClient();

        // Variables récupérées du webservice
        $installed = $board->NbCompteursPoses;
        $total     = $board->NbCompteursCommandes;
        $remaining = $total - $installed;
        if ($total > 0) {
            $installed_percent = (int) (100 * $installed) / $total;
            $remaining_percent = (int) (100 * $remaining) / $total;
        } else {
            $installed_percent = 100;
            $remaining_percent = 0;
        }

        $date = null;

        $chantier = [
            'installed'         => $installed,
            'installed_percent' => $installed_percent,
            'remaining'         => $remaining,
            'remaining_percent' => $remaining_percent,
            'total'             => $total,
            'date'              => $date,
        ];

        $locals = [
            'board'    => $board,
            'chantier' => $chantier,
        ];
		if (file_exists('./../demo.txt')){
			$locals['demo'] = 'demo';
			$locals['board']->PcImmeublesTransfertFichiers = '100' ;
		}


        return $this->render('TableauBordClient/index.html.twig', $locals);
    }

    #[Route('/parc/intervention', name: 'TechemCoreBundle_TableauBordClient_intervention')]
    public function interventionAction(Request $request)
    {
        $client = $this->getClient();
        if (is_null($client)) {
            return $this->redirectToRoute('logout');
        }

        $docType   = $request->query->get('doc-type');
        $dateBegin = $request->query->get('date-begin');
        $dateEnd   = $request->query->get('date-end');

        if ($this->validateDate($dateBegin, 'd/m/Y') && $this->validateDate($dateEnd, 'd/m/Y')) {
            $params         = new GetReportParams();
            $params->PKUSER = $client->getPkUser();
            $params->DATE1  = $dateBegin;
            $params->DATE2  = $dateEnd;

            if ($docType == 'synthese-inte') {
                $report = $client->getReport('LIVRET_INTER_SYNTHESE', $params);
            } elseif ($docType == 'detail-inte') {
                $report = $client->getReport('LIVRET_INTER_DETAIL', $params);
            } elseif ($docType == 'detail-excel-inte') {
                $report = $client->getExcel('LIVRET_INTER_LISTE', $params);
            } else {

                throw new NotFoundHttpException();
            }

            if (empty($report)) {
                throw new NotFoundHttpException();
            }

            $response = new Response($report);
            if ($docType == 'detail-excel-inte') {
                $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                $response->headers->set(
                    'Content-Disposition',
                    'inline; filename=' . $docType . '-' . $dateBegin . '-' . $dateEnd . '.xlsx'
                );
            } else {
                $response->headers->set('Content-Type', 'application/pdf');
                $response->headers->set(
                    'Content-Disposition',
                    'inline; filename=' . $docType . '-' . $dateBegin . '-' . $dateEnd . '.pdf'
                );
            }

            $response->headers->set('Content-Transfer-Encoding', 'binary');
            $response->headers->set('Expires', 0);
            $response->headers->set('Cache-Control', 'no-cache');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Content-Length', strlen($report));

            return $response;
        } else {
            throw new NotFoundHttpException();
        }
    }

    public function validateDate($date, $format = 'Y-m-d H:i:s')
    {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }
}
