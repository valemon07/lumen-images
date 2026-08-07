"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import UploadForm from "./upload-form";

export default function PhotoUploadButton({
  albumId,
}: {
  albumId?: string;
}) {
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
      <DialogTrigger className="bg-primary hover:brightness-85 transition-all duration-200 ease-in-out rounded-full mx-auto w-10 h-10 flex items-center justify-center">
        <PlusIcon />
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
