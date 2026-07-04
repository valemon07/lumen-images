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
import { deletePhoto } from "../lib/actions";

export default function PhotoCard(props: {
  photoAndUrl: { photo: Photo; url: string };
}) {
  const { photoAndUrl } = props;
  const { photo, url } = photoAndUrl;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger>
        <Image
          src={url}
          alt={photo.file_name}
          width={250}
          height={250}
          className="rounded-lg w-full block h-auto object-contain hover:saturate-75 hover:brightness-125 transition-all duration-300 ease-in-out"
        />
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <Image
          src={url}
          alt={photo.file_name}
          width={600}
          height={600}
          className="rounded-lg min-w-1/2"
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
                        deletePhoto(photo);
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
