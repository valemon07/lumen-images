"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Check, ChevronDown, FolderIcon } from "lucide-react";
import { createAlbum } from "../lib/actions";
import { useAlbums } from "./albums-provider";

export default function AlbumUploadChooser({
  selectedAlbumId,
  onAlbumSelect,
}: {
  selectedAlbumId: string | null;
  onAlbumSelect: (albumId: string | null) => void;
}) {
  const { albums, albumsLoading, addAlbums } = useAlbums();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedAlbum = albums.find((a) => a.album_id === selectedAlbumId);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setShowCreate(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredAlbums = albums.filter((a) =>
    a.album_name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleCreateAlbum() {
    if (!newAlbumName.trim()) return;
    setIsCreating(true);
    try {
      const result = await createAlbum(newAlbumName.trim());
      if (result) {
        addAlbums(result);
        onAlbumSelect(result[0].album_id);
      }
      setNewAlbumName("");
      setShowCreate(false);
      setSearch("");
    } catch (e) {
      console.error("Failed to create album", e);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        disabled={albumsLoading}
      >
        <span className="flex items-center gap-2 truncate">
          <FolderIcon className="size-4 shrink-0" />
          {albumsLoading
            ? "Loading albums..."
            : selectedAlbum
              ? selectedAlbum.album_name
              : "No album selected"}
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full border border-border bg-popover text-popover-foreground shadow-[0_12px_32px_-16px_rgb(0_0_0/0.35)] p-1 rounded-sm">
          {!showCreate ? (
            <>
              {/* Search */}
              <div className="p-2">
                <Input
                  ref={searchInputRef}
                  placeholder="Search albums..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8"
                />
              </div>

              {/* Album list */}
              <div className="max-h-48 overflow-y-auto">
                {/* "None" option */}
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    onAlbumSelect(null);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  type="button"
                >
                  <span className="flex-1 text-left text-muted-foreground">
                    None
                  </span>
                  {selectedAlbumId === null && <Check className="size-4" />}
                </button>

                {filteredAlbums.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No matching albums
                  </p>
                ) : (
                  filteredAlbums.map((album) => (
                    <button
                      key={album.album_id}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        onAlbumSelect(album.album_id);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      type="button"
                    >
                      <FolderIcon className="size-4 shrink-0" />
                      <span className="flex-1 text-left truncate">
                        {album.album_name}
                      </span>
                      {selectedAlbumId === album.album_id && (
                        <Check className="size-4 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Separator */}
              <div className="border-t" />

              {/* Create new album */}
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  setShowCreate(true);
                  setSearch("");
                }}
                type="button"
              >
                <PlusIcon className="size-4 shrink-0" />
                <span>Create new album</span>
              </button>
            </>
          ) : (
            <>
              {/* Create album form */}
              <div className="p-2 flex flex-col gap-2">
                <Input
                  placeholder="Album name..."
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateAlbum();
                    if (e.key === "Escape") {
                      setShowCreate(false);
                      setNewAlbumName("");
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateAlbum}
                    disabled={!newAlbumName.trim() || isCreating}
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowCreate(false);
                      setNewAlbumName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
