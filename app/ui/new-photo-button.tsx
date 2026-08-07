"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import UploadForm from "./upload-form";
import { Button } from "@/components/ui/button";

export default function NewPhotoButton({ albumId }: { albumId?: string }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (uploading && !next) return;
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Upload Photos
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={!uploading}
        onEscapeKeyDown={(e) => {
          if (uploading) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (uploading) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (uploading) e.preventDefault();
        }}
      >
        <UploadForm initialAlbumId={albumId} onUploadingChange={setUploading} />
      </DialogContent>
    </Dialog>
  );
}
