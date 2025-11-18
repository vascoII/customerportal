"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useImmeubles } from "@/lib/hooks/useImmeubles";

interface ImmeubleCardProps {
  pkImmeuble: string;
}

// Adresse de secours si l'adresse de l'immeuble n'est pas trouvée
const FALLBACK_ADDRESS = "378 Avenue de la Division Leclerc, 92290 Châtenay-Malabry, France";

// Configuration de la carte
const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 48.8566, // Paris par défaut
  lng: 2.3522,
};

const defaultZoom = 15;

export default function ImmeubleCard({ pkImmeuble }: ImmeubleCardProps) {
  const { getImmeubleQuery } = useImmeubles();
  const { data: immeubleData, isLoading: isImmeubleLoading } = getImmeubleQuery(pkImmeuble);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(false);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: ["places"],
  });

  // Extract immeuble information from API response
  const immeubleInfo = useMemo(() => {
    const immeuble = immeubleData?.immeuble;
    // Handle both nested Immeuble object and direct properties
    const immeubleObj = (immeuble && typeof immeuble === 'object' && 'Immeuble' in immeuble) 
      ? (immeuble as { Immeuble?: Record<string, unknown> }).Immeuble ?? immeuble
      : immeuble;
    
    return {
      nom: immeubleObj?.Nom ?? immeubleObj?.nom ?? "—",
      ref: immeubleObj?.Ref ?? immeubleObj?.ref ?? "—",
      numero: immeubleObj?.Numero ?? immeubleObj?.numero ?? "—",
      adresse1: immeubleObj?.Adresse1 ?? immeubleObj?.adresse1 ?? "—",
      cp: immeubleObj?.Cp ?? immeubleObj?.cp ?? "—",
      ville: immeubleObj?.Ville ?? immeubleObj?.ville ?? "—",
    };
  }, [immeubleData]);

  // Format full address
  const fullAddress = useMemo(() => {
    const parts = [
      immeubleInfo.adresse1 !== "—" ? immeubleInfo.adresse1 : null,
      immeubleInfo.cp !== "—" ? immeubleInfo.cp : null,
      immeubleInfo.ville !== "—" ? immeubleInfo.ville : null,
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(" ") : null;
  }, [immeubleInfo]);

  // Geocode address using Google Geocoding API
  const geocodeAddress = useCallback(async (address: string, useFallback = false) => {
    if (!isLoaded || !window.google?.maps?.Geocoder) {
      return;
    }

    setIsGeocoding(true);
    if (useFallback) {
      setGeocodingError(true);
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({ address });

      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        setMapCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        // Address not found, use fallback
        if (!useFallback) {
          console.warn(`Adresse non trouvée: ${address}. Utilisation de l'adresse de secours: ${FALLBACK_ADDRESS}`);
          await geocodeAddress(FALLBACK_ADDRESS, true);
        }
      }
    } catch (error) {
      console.error("Erreur lors du géocodage:", error);
      if (!useFallback) {
        setGeocodingError(true);
        // Try fallback address
        await geocodeAddress(FALLBACK_ADDRESS, true);
      }
    } finally {
      setIsGeocoding(false);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isImmeubleLoading || !fullAddress || !isLoaded) {
      return;
    }

    geocodeAddress(fullAddress);
  }, [fullAddress, isImmeubleLoading, isLoaded, geocodeAddress]);

  if (isImmeubleLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informations de l&apos;immeuble
          </h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Chargement...</p>
              <p className="text-sm text-gray-800 dark:text-white/90">...</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Localisation de l&apos;immeuble
        </h3>
      </div>

      {/* Google Map */}
      {googleMapsApiKey && (
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          {loadError && (
            <div className="w-full h-[300px] flex items-center justify-center bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">
                Erreur lors du chargement de Google Maps
              </p>
            </div>
          )}
          {!isLoaded && !loadError && (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chargement de la carte...
              </p>
            </div>
          )}
          {isLoaded && !loadError && (
            <>
              {isGeocoding && (
                <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recherche de l&apos;adresse...
                  </p>
                </div>
              )}
              {!isGeocoding && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={defaultZoom}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                  }}
                >
                  <Marker position={mapCenter} />
                </GoogleMap>
              )}
              {geocodingError && (
                <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Adresse non trouvée. Affichage de l&apos;adresse de secours.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xm font-medium">
            Nom: <span className="text-xm font-medium text-gray-500 dark:text-gray-400">{immeubleInfo.nom}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xm font-medium">
            Référence: <span className="text-xm font-medium text-gray-500 dark:text-gray-400">{immeubleInfo.ref}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xm font-medium">
            N° d&apos;immeuble: <span className="text-xm font-medium text-gray-500 dark:text-gray-400">{immeubleInfo.numero}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xm font-medium">
            Adresse: <span className="text-xm font-medium text-gray-500 dark:text-gray-400">{fullAddress || "—"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
