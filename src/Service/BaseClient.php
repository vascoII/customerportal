<?php

namespace App\Service;

use Exception;
use SimpleXMLElement;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Stopwatch\Stopwatch;
use Zend\Cache\Storage\Adapter\AbstractAdapter;

class BaseClient
{
    private $kernel;
    private $client;
    protected $adminSessionId;
    protected $superLoginID;
    protected $superPassword;
    private $cache;
    private $sessionId;
    private $pkUser;
    private $user;
    private $LoginState;
    private $stopwatch;
    protected $wsdlUrl;

    public function __construct(KernelInterface $kernel, $wsdlUrl, $adminSessionId, AbstractAdapter $cache, $superLoginID, $superPassword, Stopwatch $stopwatch = null)
    {
        $this->kernel = $kernel;
        $this->adminSessionId = $adminSessionId;
        $this->cache = $cache;
        $this->superLoginID = $superLoginID;
        $this->superPassword = $superPassword;
        $this->stopwatch = $stopwatch;
	    $this->wsdlUrl = $wsdlUrl;

        if (empty($wsdlUrl)) {
            throw new RuntimeException('Missing argument 1.');
        }

        if (parse_url($wsdlUrl) === false) {
            throw new RuntimeException('Argument 1 must be a URL.');
        }

        $this->stopwatchStart('\App\Service\BaseClient::__construct wsdl');
        $this->client = new \SoapClient($wsdlUrl, [
            'trace' => 1,
            // 'stream_context' => stream_context_create([
            //     'ssl' => [
            //         'verify_peer'       => false,
            //         'verify_peer_name'  => false,
            //         'allow_self_signed' => true,
            //     ],
            // ]),
            'exception' => true,
        ]);
        $this->stopwatchStop('\App\Service\BaseClient::__construct wsdl');
    }

    protected function stopwatchStart($name)
    {
        if ($this->stopwatch) {
            $this->stopwatch->start($name);
        }
    }

    protected function stopwatchStop($name)
    {
        if ($this->stopwatch) {
            $this->stopwatch->stop($name);
        }
    }

    public function login($username, $password)
    {
        $result = $this->sendRequest('Login', (object) [
            'LoginID' => $username,
            'Password' => $password,
        ], false);

        if (isset($result->Erreur) && !empty($result->Erreur)) {
            throw new RuntimeException($result->Erreur);
        }

        if (empty($result->SessionID)) {
            return false;
        }

        $this->sessionId = $result->SessionID;
        $this->user = $result->User;
        $this->pkUser = $this->user->PKUser;
        $this->LoginState = $this->user->Info;

        return true;
    }

    public function loginFromParam($param)
    {
        $result = $this->sendRequest('LoginFromParam', (object) [
            'SuperLoginID'  => $this->superLoginID,
            'SuperPassword' => $this->superPassword,
            'Param'         => $param,
        ], false);

        if (isset($result->Erreur) && !empty($result->Erreur)) {
            throw new RuntimeException($result->Erreur);
        }

        if (empty($result->SessionID)) {
            return false;
        }

        $this->sessionId = $result->SessionID;
        $this->user = $result->User;
        $this->pkUser = $this->user->PKUser;

        return true;
    }

    public function retrieveSession($sessionId, $userPk)
    {
        $this->sessionId = $sessionId;
        $this->pkUser = $userPk;
    }

    public function logout()
    {
        $result = $this->sendRequest('Logout', (object) [
            'SessionId' => $this->sessionId,
            'PkUser' => $this->pkUser,
        ], false);

        return $result;
    }

    protected function getClient()
    {
        return $this->client;
    }

    public function getSessionId()
    {
        return $this->sessionId;
    }

    public function getPkUser()
    {
        return $this->pkUser;
    }

	
    public function getCurrentUser()
    {
        return $this->user;
    }

    protected function sendRequest($name, $request, $useCache = true, $useCurl = false)
    {
        $this->stopwatchStart('\App\Service\BaseClient::sendRequest');

        $params = [$request];
        $response = null;
        if ($this->kernel->isDebug() && !in_array($name, ['GetReport', 'GetFile'])) {
            // echo '<!-- SOAP '.$name.' : '.json_encode($params).'-->'.chr(10);
        }
        if ($useCache) {
            $requestCache = clone $request;
            unset($requestCache->SessionID);
            $originalNamespace = $this->cache->getOptions()->getNamespace();
            if (isset($request->PkUser)) {
                $this->cache->getOptions()->setNamespace($originalNamespace . '-' . $request->PkUser);
            }

            $key = md5($name . json_encode($requestCache));
            $cacheItem = $this->cache->getItem($key);
            if ($cacheItem !== null) {
                if ($cacheItem->isHit()) {
                    $response = json_decode($cacheItem->get());
                }
                if (is_null($response)) {
                    $response = $this->getClient()->__soapCall($name, $params);
                    $originalNamespace = $this->cache->getOptions()->getNamespace();
                    $cacheItem->set(json_encode($response));
                    $this->cache->setItem($key, json_encode($response));
                    $this->cache->getOptions()->setNamespace($originalNamespace);
                }
            }

            $this->cache->getOptions()->setNamespace($originalNamespace);
        }

        if (is_null($response)) {
            if ($useCurl) {
                if ($name == 'getOccupants4Chgt') {
					if ($request['isNew'] == false){
										$isnew = 'false';
					}else{
						$isnew = true;
					}
                    $body = '<getOccupants4Chgt xmlns="http://tempuri.org/">
                                <SessionID>' .$request['SessionID'] .'</SessionID>
                                <PkUser>' .$request['PkUser'] .'</PkUser>
                                <PkImmeuble>' .$request['PkImmeuble'] .'</PkImmeuble>
                                <PkOccupant>' .$request['PkOccupant'] .'</PkOccupant>
                                <isNew>' .$isnew.'</isNew>
                            </getOccupants4Chgt>';
                } else {
					if ($request->isNew == false){
										$isnew = 'false';
					}else{
						$isnew = true;
					}
                    $occupantsXml =
                        '<occupant4Chgt>' .
                            '<PkOccupant>' . $request->occupants->occupant4Chgt->PkOccupant . '</PkOccupant>' .
                            '<newEmail>' . $request->occupants->occupant4Chgt->newEmail . '</newEmail>';
						if (isset($request->occupants->occupant4Chgt->newTelmobile)){
                            $occupantsXml = $occupantsXml . '<newTelmobile>' . $request->occupants->occupant4Chgt->newTelmobile . '</newTelmobile>' ;
						}
						if (isset($request->occupants->occupant4Chgt->newDateArrivee)){
                            $occupantsXml = $occupantsXml .'<newDateArrivee>' . $request->occupants->occupant4Chgt->newDateArrivee . '</newDateArrivee>';
						}
						if (isset($request->occupants->occupant4Chgt->newNom)){
                            $occupantsXml = $occupantsXml .'<newNom>' . htmlspecialchars($request->occupants->occupant4Chgt->newNom) . '</newNom>' ;
						}
						$occupantsXml = $occupantsXml .'<isNew>' . $isnew . '</isNew>'.
                        '</occupant4Chgt>';
						
                    $body = '<setOccupants4Chgt xmlns="http://tempuri.org/">
                                <SessionID>' .$request->SessionID .'</SessionID>
                                <PkUser>' .$request->PkUser .'</PkUser>
                                <occupants>' .$occupantsXml .'</occupants>
                                <isNew>' .$isnew.'</isNew>
                            </setOccupants4Chgt>';
                }
				
				
                $curl = curl_init();
                curl_setopt_array($curl, array(
                  CURLOPT_URL => $this->wsdlUrl,
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => '',
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 0,
                  CURLOPT_FOLLOWLOCATION => true,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => 'POST',
                  CURLOPT_POSTFIELDS =>'<?xml version="1.0" encoding="utf-8"?>
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                        <soap:Body>
                            '. $body .'
                        </soap:Body>
                    </soap:Envelope>',
                  CURLOPT_HTTPHEADER => array(
                    'Content-Type: text/xml',
                    'Cookie: TS01a97c06=01b6789f767663ca1fd8e59ef4f32dca2d46c439fac0e0fef02cd4e0f6b00e48444a63d59139963f06de8138ff06d9cd1eab1e0ff7'
                  ),
                ));
                $response = curl_exec($curl);
                curl_close($curl);

					$xml = new SimpleXMLElement($response);

					$namespaces = $xml->getNamespaces(true);
					$xml->registerXPathNamespace('d', $namespaces['']);
					if ($name == 'getOccupants4Chgt') {
						$result = $xml->xpath('//d:getOccupants4ChgtResult');
					} else {
						$result = $xml->xpath('//d:setOccupants4ChgtResult');
					}
					
					if (!empty($result[0])){
					$occupants = $this->simpleXmlToArray(
						$result[0]->occupant4Chgt
					);
					$this->stopwatchStop('\App\Service\BaseClient::sendRequest');
					return $occupants;
					}else{
						
						return ;
					}
					
            } else {
				$response = $this->getClient()->__soapCall($name, $params);
            }
        }

        $resultName = $name . 'Result';
		

        if (!isset($response->{$resultName})) {
			throw new RuntimeException($name . ' fail.'.$errresponse);
        }

        $result = $response->{$resultName};

        if (isset($result->Erreur) && !empty($result->Erreur)) {
            if (in_array($this->kernel->getEnvironment(), ['dev', 'test'])) {
                throw new RuntimeException($result->Erreur . ' ::: ' . print_r($request, true));
            } else {
                throw new RuntimeException($result->Erreur);
            }
        }

        $this->stopwatchStop('\App\Service\BaseClient::sendRequest');

        return $result;
    }

    private function simpleXmlToArray($xmlElement) {
        $array = [];
        foreach ($xmlElement->children() as $node) {
            $value = $node->count() ? $this->simpleXmlToArray($node) : trim((string)$node);
            if ($value === "") {
                $value = "";
            }
            $array[$node->getName()] = $value;
        }
        return $array;
    }

    private function handleError($fault)
    {
        $errorMessage = $fault->getMessage();
        echo "<script>
                if (window.confirm('SOAP Fault: $errorMessage')) {
                    window.close();
                }
            </script>";

    }

    public function clearUserCache($pkUser)
    {
        $namespace = $this->cache->getOptions()->getNamespace() . '-' . $pkUser;
        $this->cache->clearByNamespace($namespace);
        $this->cache->optimize();
    }

    public function updateCGUFromPKUser($cgu = '')
    {
        $request = (object) [
            'SuperLoginID' => $this->superLoginID,
            'SuperPassword' => $this->superPassword,
            'PKUser' => $this->getPkUser(),
            'CGU' => $cgu,
        ];

        $result = $this->sendRequest('UpdateCGUFromPKUser', $request, false);

        if (isset($result->Erreur) && !empty($result->Erreur)) {
            return false;
        }
        return true;
    }


    public function updateEmailFromPKUser($email = '')
    {
        $request = (object) [
            'SuperLoginID' => $this->superLoginID,
            'SuperPassword' => $this->superPassword,
            'PKUser' => $this->getPkUser(),
            'Email' => $email,
        ];

        $result = $this->sendRequest('UpdateEmailFromPKUser', $request, false);

        if (isset($result->Erreur) && !empty($result->Erreur)) {
            return false;
        }
        return true;
    }
}
