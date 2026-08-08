"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Album } from "../lib/types";
import { getCurrentUserAlbums } from "../lib/actions";

type AlbumsContextValue = {
  albums: Album[];
  albumsLoading: boolean;
  addAlbums: (newAlbums: Album[]) => void;
};

const AlbumsContext = createContext<AlbumsContextValue | null>(null);

export function AlbumsProvider({ children }: { children: React.ReactNode }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumsLoading, setAlbumsLoading] = useState(true);

  useEffect(() => {
    getCurrentUserAlbums().then((result) => {
      if (result) setAlbums(result);
      setAlbumsLoading(false);
    });
  }, []);

  const addAlbums = useCallback((newAlbums: Album[]) => {
    setAlbums((prev) => [...prev, ...newAlbums]);
  }, []);

  return (
    <AlbumsContext.Provider value={{ albums, albumsLoading, addAlbums }}>
      {children}
    </AlbumsContext.Provider>
  );
}

export function useAlbums() {
  const ctx = useContext(AlbumsContext);
  if (!ctx) throw new Error("useAlbums must be used within AlbumsProvider");
  return ctx;
}
