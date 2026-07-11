"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Album } from "../lib/types";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createAlbum } from "../lib/actions";

export default function AlbumUploadChooser(props: { albumsFromDb: Album[]}) {
  const { albumsFromDb } = props;
  const [albumName, setAlbumName] = useState("");
  const [albumError, setAlbumError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newAlbums, setNewAlbums] = useState<Album[]>([]);

  const albums = albumsFromDb.concat(newAlbums);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Albums...</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {albums &&
          albums.map((album, i) => {
            return (
              <DropdownMenuCheckboxItem key={i}>
                {album.album_name}
              </DropdownMenuCheckboxItem>
            );
          })}
        {!(albums.length == 0) && <DropdownMenuSeparator />}
        <DropdownMenuItem asChild>
          <div>
            <PlusIcon />
            <Dialog>
              <DialogTrigger>Create New Album</DialogTrigger>
              <DialogContent>
                <DialogHeader>Create New Album</DialogHeader>
                <Input placeholder="Album Name..." onChange={(e) => {
                  setAlbumName(e.target.value)
                }
                } />
                <Button onClick={() => {
                  setIsCreating(true);
                  try {
                    createAlbum(albumName);
                  } catch (e) {
                    setAlbumError(e);
                  }

                  setIsCreating(false);
                }}>Submit</Button>
              </DialogContent>
            </Dialog>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
