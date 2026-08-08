"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAlbum } from "../lib/actions";
import { useAlbums } from "./albums-provider";

export default function NewAlbumButton() {
  const router = useRouter();
  const { addAlbums } = useAlbums();
  const [albumName, setAlbumName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit() {
    if (!albumName.trim()) return;
    const result = await createAlbum(albumName);
    if (result) addAlbums(result);
    setAlbumName("");
    setIsOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New Album
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Album Name..."
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
