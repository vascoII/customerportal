"use client";
import React, { useMemo } from "react";
import { useLogements } from "@/lib/hooks/useLogements";

interface LogementMainCardProps {
  pkLogement: string;
}

export default function LogementMainCard({ pkLogement }: LogementMainCardProps) {
  const { getLogementQuery } = useLogements();
  const { data: logementData, isLoading: isLogementLoading } = getLogementQuery(pkLogement);

  // Extract logement information from API response
  const logementInfo = useMemo(() => {
    const logement = logementData?.logement;
    return {
      nbCompteurs: (logement?.NbAppareils ?? logement?.nbAppareils ?? 0) as number,
      nbCompteursEf: (logement?.NbCompteursEF ?? logement?.nbCompteursEF ?? logement?.NbCompteursEf ?? logement?.nbCompteursEf ?? 0) as number,
      nbCompteursEc: (logement?.NbCompteursEC ?? logement?.nbCompteursEC ?? logement?.NbCompteursEc ?? logement?.nbCompteursEc ?? 0) as number,
      nbCompteursRepart: (logement?.NbCompteursRepart ?? logement?.nbCompteursRepart ?? 0) as number,
      nbCompteursCet: (logement?.NbCompteursCET ?? logement?.nbCompteursCET ?? logement?.NbCompteursCet ?? logement?.nbCompteursCet ?? 0) as number,
    };
  }, [logementData]);

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fr-FR');
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informations du logement 
          </h4>

          {isLogementLoading ? (
            <div className="space-y-6">
              {/* First row - 2 columns */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Chargement...
                    </p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                      ...
                    </p>
                  </div>
                ))}
              </div>
              {/* Second row - 4 columns */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Chargement...
                    </p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                      ...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* First row - 1 column: Nombre d'Appareils */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                  <center>
                    <p className="mb-2 text-2xl  leading-normal text-gray-500 dark:text-gray-400">
                    Nombre d&apos;appareils
                    </p>
                  </center>
                  <center>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {formatNumber(logementInfo.nbCompteurs)}
                </p>  
                  </center>
                </div>
              </div>

              {/* Second row - 4 columns: Eau froide, Eau chaude, Répartiteurs, Compteur d'énergie */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                  <div>
                  <center>
                  <p className="mb-2 text-xl leading-normal text-gray-500 dark:text-gray-400">
                    Eau froide
                  </p>
                  </center>
                  <center>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {formatNumber(logementInfo.nbCompteursEf)}
                  </p>
                  </center>
                </div>

                  <div>
                  <center>
                  <p className="mb-2 text-xl leading-normal text-gray-500 dark:text-gray-400">
                    Eau chaude
                  </p>
                  </center>
                  <center>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {formatNumber(logementInfo.nbCompteursEc)}
                      </p>
                  </center>
                </div>

                <div>
                  <center>
                  <p className="mb-2 text-xl leading-normal text-gray-500 dark:text-gray-400">
                    Répartiteurs
                  </p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {formatNumber(logementInfo.nbCompteursRepart)}
                      </p>
                  </center>
                </div>

                <div>
                  <center>
                  <p className="mb-2 text-xl leading-normal text-gray-500 dark:text-gray-400">
                    Compteur d&apos;énergie
                  </p>
                  <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {formatNumber(logementInfo.nbCompteursCet)}
                  </p>
                  </center>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
