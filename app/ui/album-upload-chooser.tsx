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

export default function AlbumUploadChooser(props: { albums: Album[] }) {
  const { albums } = props;
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
            <p>Create New</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
