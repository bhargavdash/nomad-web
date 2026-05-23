"use client";

import { useEffect, useRef, useState } from "react";

export interface PhotonFeature {
  name: string;
  city?: string;
  state?: string;
  country?: string;
  coordinates: [number, number];
}

export function getDisplayLabel(feature: PhotonFeature): string {
  const parts: string[] = [feature.name];
  if (feature.city && feature.city !== feature.name) parts.push(feature.city);
  if (feature.country) parts.push(feature.country);
  return parts.join(", ");
}

export function getSubtitle(feature: PhotonFeature): string {
  const parts: string[] = [];
  if (feature.city && feature.city !== feature.name) parts.push(feature.city);
  else if (feature.state) parts.push(feature.state);
  if (feature.country) parts.push(feature.country);
  return parts.join(", ");
}

export default function usePhotonSearch(query: string) {
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = `https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=5&lang=en`;
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();

        const features: PhotonFeature[] = (data.features ?? []).map(
          (f: {
            geometry: { coordinates: [number, number] };
            properties: {
              name?: string;
              city?: string;
              state?: string;
              country?: string;
            };
          }) => ({
            name: f.properties.name ?? "",
            city: f.properties.city,
            state: f.properties.state,
            country: f.properties.country,
            coordinates: f.geometry.coordinates,
          }),
        );

        setResults(features);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  return { results, loading };
}
