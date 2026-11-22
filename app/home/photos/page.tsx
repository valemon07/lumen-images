"use client";
import { useState } from "react";
import NewPhotoButton from "@/app/ui/new-photo-button";
import PhotoGridContainer from "@/app/ui/photo-grid-container";
import FilterBar from "@/app/ui/filter-bar";
import { FilterState } from "@/app/lib/types";

export default function Page() {
  const [filters, setFilters] = useState<FilterState>({
    date: { type: "all" },
    tags: {},
  });

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <h1 className="text-3xl font-black leading-none tracking-[-0.035em] sm:text-4xl">Photos</h1>
        <NewPhotoButton />
      </header>
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="flex w-full flex-col">
        <PhotoGridContainer filters={filters} />
      </div>
    </div>
  );
}