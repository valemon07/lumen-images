"use client";
import { deleteImage, getAllPresignedImages } from "@/app/lib/actions";
import { authClient } from "@/app/lib/auth-client";
import { Photo } from "../lib/types";
import { useState, useEffect } from "react";
import PhotoCard from "./photo-card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function ImageGrid() {
  const [session, setSession] = useState(null);
  const [imagesData, setImagesData] = useState<{
    images: Photo[];
    urls: string[];
  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | unknown>();
  const [focusedImage, setFocusedImage] = useState<{
    image: Photo;
    url: string;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get session from client-side auth
        const { data: sessionData, error } = await authClient.getSession();
        setSession(sessionData);

        if (!sessionData) {
          setError(new Error("You must be logged in to access this page."));
          setLoading(false);
          return;
        }

        const userId = sessionData.user.id;
        // Call server action to get presigned images
        const images = await getAllPresignedImages(userId);
        setImagesData(images);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col justify-center-items-center h-screen w-screen"></main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col justify-center-center h-screen w-screen">
        <div className="p-4 text-red-500">{error.message}</div>
      </main>
    );
  }

  if (!session) {
    return <div>You must be logged in to access this page.</div>;
  }

  if (!imagesData) return <div>No images found!</div>;
  const { images, urls } = imagesData;

  return (
    <div className="columns-4">
      <div className="flex flex-row flex-wrap gap-4">
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          {images.map((image, i) => (
            <div
              key={image.id}
              onClick={() => {
                setFocusedImage({ image: image, url: urls[i] });
              }}
            >
              <DialogTrigger>
                <PhotoCard
                  src={urls[i]}
                  alt={image.file_name}
                  width={250}
                  height={250}
                  className=""
                />
              </DialogTrigger>
            </div>
          ))}
          <DialogContent className="min-w-fit">
            <Image
              src={focusedImage?.url}
              alt={focusedImage?.image.file_name}
              width={600}
              height={600}
              className="rounded-lg min-w-1/2"
            />
            <DialogFooter>
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
                          if (focusedImage) {
                            deleteImage(focusedImage.image.s3_key);
                            const imageIndex = images.indexOf(
                              focusedImage.image,
                            );
                            images.splice(imageIndex, 1);
                          }
                          setFocusedImage(null);
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
      </div>
    </div>
  );
}
