"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Photo } from "../lib/types";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PhotoCard(props: {
  photoAndUrl: { photo: Photo; url: string };
  onDelete: (photo: Photo) => void;
}) {
  const { photoAndUrl, onDelete } = props;
  const { photo, url } = photoAndUrl;
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imgWidth = photo.width ?? 3;
  const imgHeight = photo.height ?? 2;
  const aspectRatio = imgWidth / imgHeight;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <button className="relative w-full overflow-hidden rounded-lg bg-muted text-left cursor-pointer block">
          <div style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }} />
          <Image
            src={url}
            alt={photo.file_name}
            fill
            className={`rounded-lg object-cover transition-opacity duration-300 hover:saturate-75 hover:brightness-125 ${loaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <Image
          src={url}
          alt={photo.file_name}
          width={imgWidth}
          height={imgHeight}
          className="rounded-lg min-w-1/2 max-h-[80vh] w-auto h-auto object-contain"
        />
        <DialogFooter className="flex flex-col">
          <Accordion type="single" collapsible>
            <AccordionItem value="metadata">
              <AccordionTrigger>View Metadata...</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <div>
                    <strong>File Name:</strong> {photo.file_name}
                  </div>
                  <div>
                    <strong>File Size:</strong>{" "}
                    {(photo.file_size / 1000000).toFixed(2)} MB
                  </div>
                  <div>
                    <strong>File Type:</strong> {photo.file_type}
                  </div>
                  <div>
                    <strong>Dimensions:</strong>{" "}
                    {photo.width && photo.height
                      ? `${photo.width} x ${photo.height}`
                      : "Unknown"}
                  </div>
                  <div>
                    <strong>Last Modified:</strong>{" "}
                    {new Date(photo.last_modified || "").toLocaleString()}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete Image?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the image. Double check
                  you&apos;re deleting the right image!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant={"outline"}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      if (photo) {
                        onDelete(photo);
                      }
                      setModalOpen(false);
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}