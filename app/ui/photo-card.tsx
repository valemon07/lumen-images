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
import { Skeleton } from "@/components/ui/skeleton";

export default function PhotoCard(props: {
  photoAndUrl: { photo: Photo; url: string };
  onDelete: (photo: Photo) => void;
}) {
  const { photoAndUrl, onDelete } = props;
  const { photo, url } = photoAndUrl;
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dialogLoaded, setDialogLoaded] = useState(false);

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
            quality={85}
            className={`rounded-lg object-cover transition-opacity duration-300 hover:saturate-75 hover:brightness-125 ${loaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] min-w-fit flex-col overflow-y-auto sm:max-w-3xl">
        <div className="relative mx-auto overflow-hidden rounded-lg bg-muted">
          {!dialogLoaded && (
            <Skeleton className="absolute inset-0 rounded-lg" />
          )}
          <Image
            src={url}
            alt={photo.file_name}
            width={imgWidth}
            height={imgHeight}
            quality={90}
            sizes="(max-width: 640px) calc(100vw - 3rem), 768px"
            className={`h-auto w-auto max-h-[65vh] max-w-full rounded-lg object-contain transition-opacity duration-300 ${dialogLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setDialogLoaded(true)}
          />
        </div>
        <DialogFooter className="flex shrink-0 flex-col">
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
