"use client";
import { useCallback, useEffect, useRef } from "react";
import { getCurrentUserPhotos } from "@/app/lib/actions";
import { Photo, FilterState } from "../lib/types";
import PhotoGrid from "./photo-grid";
import { SkeletonImage } from "./skeletons";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

import { useState } from "react";

interface PhotoGridContainerProps {
  filters: FilterState;
}

export default function PhotoGridContainer({ filters }: PhotoGridContainerProps) {
  const [data, setData] = useState<{
    photos: Photo[];
    urls: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const debouncedFilters = useDebounce(filters, 200);
  const cancelledRef = useRef(false);

  const loadPhotos = useCallback(async (currentFilters: FilterState) => {
    cancelledRef.current = false;
    setLoading(true);
    const result = await getCurrentUserPhotos(currentFilters);
    if (!cancelledRef.current) {
      setData(result);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPhotos(debouncedFilters);
    return () => {
      cancelledRef.current = true;
    };
  }, [debouncedFilters, loadPhotos]);

  useEffect(() => {
    const handler = () => loadPhotos(debouncedFilters);
    window.addEventListener("photo-uploaded", handler);
    return () => window.removeEventListener("photo-uploaded", handler);
  }, [loadPhotos, debouncedFilters]);

  if (loading) {
    return (
      <div className="w-full columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 *:break-inside-avoid *:mb-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonImage key={i} />
        ))}
      </div>
    );
  }

  if (!data) return <div>No images found!</div>;
  return <PhotoGrid photosData={data} onFiltersChange={() => {}} currentFilters={filters} />;
}