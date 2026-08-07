"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Photo, Tag } from "../lib/types";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Trash2Icon, SearchIcon, Loader2Icon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { refreshPresignedUrl, getPhotoTags } from "../lib/actions";

const MAX_RETRIES = 3;

export default function PhotoCard(props: {
  photoAndUrl: { photo: Photo; url: string };
  onDelete: (photo: Photo) => void;
}) {
  const { photoAndUrl, onDelete } = props;
  const { photo, url } = photoAndUrl;
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dialogLoaded, setDialogLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [failed, setFailed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const attemptsRef = useRef(0);
  const retryingRef = useRef(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: photo.photo_id }),
      });
      if (res.ok) {
        toast.success("Image analyzed");
      } else {
        const err = await res.json().catch(() => ({}));
        alert("Failed to analyze image: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      alert("Failed to analyze image: " + error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleError = useCallback(async () => {
    if (retryingRef.current) return;
    if (attemptsRef.current >= MAX_RETRIES) {
      setFailed(true);
      return;
    }
    attemptsRef.current += 1;
    retryingRef.current = true;
    try {
      const freshUrl = await refreshPresignedUrl(photo.s3_key);
      if (!freshUrl) {
        setFailed(true);
        return;
      }
      setLoaded(false);
      setDialogLoaded(false);
      setCurrentUrl(freshUrl);
    } catch {
      setFailed(true);
    } finally {
      retryingRef.current = false;
    }
  }, [photo.s3_key]);

  useEffect(() => {
    if (modalOpen && tags.length === 0 && !tagsLoading) {
      const fetchTags = async () => {
        setTagsLoading(true);
        try {
          const photoTags = await getPhotoTags(photo.photo_id);
          setTags(photoTags);
        } catch (error) {
          console.error("Failed to fetch tags:", error);
        } finally {
          setTagsLoading(false);
        }
      };
      fetchTags();
    }
  }, [modalOpen, photo.photo_id, tags.length, tagsLoading]);

  const imgWidth = photo.width ?? 3;
  const imgHeight = photo.height ?? 2;
  const aspectRatio = imgWidth / imgHeight;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <button className="relative w-full overflow-hidden rounded-lg bg-muted text-left cursor-pointer block">
          <div style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }} />
          {failed ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
              Failed to load
            </div>
          ) : (
            <Image
              src={currentUrl}
              key={currentUrl}
              alt={photo.file_name}
              fill
              quality={85}
              className={`rounded-lg object-cover transition-opacity duration-300 hover:saturate-75 hover:brightness-125 ${loaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={handleError}
            />
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-fit sm:max-w-3xl flex max-h-[90vh] flex-col overflow-y-auto">
        <div
          className="relative max-h-[80vh] overflow-hidden rounded-lg"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          {!dialogLoaded && !failed && (
            <Skeleton className="absolute inset-0 rounded-lg" />
          )}
          {failed ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted text-muted-foreground">
              Failed to load
            </div>
          ) : (
            <Image
              src={currentUrl}
              key={currentUrl}
              alt={photo.file_name}
              fill
              quality={90}
              sizes="(max-width: 640px) calc(100vw - 3rem), 768px"
              className={`object-contain transition-opacity duration-300 ${dialogLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setDialogLoaded(true)}
              onError={handleError}
            />
          )}
        </div>
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
          {tags.length > 0 && (
            <Accordion type="single" collapsible>
              <AccordionItem value="tags">
                <AccordionTrigger>View Tags...</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2">
                    {Object.entries(
                      tags.reduce((acc, tag) => {
                        acc[tag.category] = [
                          ...(acc[tag.category] || []),
                          tag.label,
                        ];
                        return acc;
                      }, {} as Record<string, string[]>),
                    ).map(([category, labels]) => (
                      <div key={category}>
                        <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong>{" "}
                        {labels.join(", ")}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="mr-2 h-4 w-4" />
              )}
              Analyze
            </Button>
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
