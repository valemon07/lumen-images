"use client";
import { useState } from "react";
import AlbumPhotosContainer from "@/app/ui/album-photos";
import FilterBar from "@/app/ui/filter-bar";
import { FilterState } from "@/app/lib/types";

export default function AlbumPhotosClient({ albumId }: { albumId: string }) {
  const [filters, setFilters] = useState<FilterState>({
    date: { type: "all" },
    tags: {},
  });

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />
      <AlbumPhotosContainer albumId={albumId} filters={filters} />
    </>
  );
}