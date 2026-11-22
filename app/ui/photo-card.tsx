"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
import { Trash2Icon, SearchIcon, Loader2Icon, FolderIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  refreshPresignedUrl,
  getPhotoTags,
  updatePhotoAlbum,
} from "../lib/actions";
import AlbumUploadChooser from "./album-upload-chooser";

const MAX_RETRIES = 3;

// The record Lumen writes on every photo, in the same order and wording the
// landing page shows on a turned-over mount.
const READING_ORDER: { category: string; label: string }[] = [
  { category: "subjects", label: "Subjects" },
  { category: "setting", label: "Setting" },
  { category: "timeOfDay", label: "Time of day" },
  { category: "weather", label: "Weather" },
  { category: "mood", label: "Mood" },
  { category: "composition", label: "Composition" },
  { category: "colorPalette", label: "Palette" },
];

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
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [albumId, setAlbumId] = useState<string | null>(photo.album_id ?? null);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const attemptsRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  // The grid image's already-loaded URL, shown in the dialog until the larger
  // version arrives so the lift never lands on an empty mount.
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);
  const [lifting, setLifting] = useState(false);
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

  const handleAlbumSelect = async (newAlbumId: string | null) => {
    const result = await updatePhotoAlbum(photo.photo_id, newAlbumId);
    if (result) {
      setAlbumId(newAlbumId);
      setAlbumDialogOpen(false);
      toast.success(
        newAlbumId ? "Photo added to album" : "Photo removed from album",
      );
      window.dispatchEvent(new CustomEvent("photo-album-changed"));
    } else {
      toast.error("Failed to update album");
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
    if (modalOpen && !tags && !tagsLoading) {
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
  }, [modalOpen, photo.photo_id, tags, tagsLoading]);

  const imgWidth = photo.width ?? 3;
  const imgHeight = photo.height ?? 2;
  const aspectRatio = imgWidth / imgHeight;

  // Opening a photo lifts its mount off the table into the dialog: the one
  // orchestrated transition in the app. Falls back to an instant open where
  // View Transitions are unsupported or reduced motion is requested.
  const mountName = `mount-${photo.photo_id}`;
  const handleOpenChange = (open: boolean) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };
    const src = thumbRef.current?.currentSrc || null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trigger = triggerRef.current;
    if (!open || reduce || !doc.startViewTransition || !trigger) {
      if (open) setThumbSrc(src);
      setModalOpen(open);
      return;
    }
    // Only the opened card carries the name, and only for the old snapshot;
    // the dialog mount takes it over for the new one.
    trigger.style.viewTransitionName = mountName;
    const transition = doc.startViewTransition(() => {
      trigger.style.viewTransitionName = "";
      flushSync(() => {
        setThumbSrc(src);
        setLifting(true);
        setModalOpen(true);
      });
    });
    transition.finished.finally(() => setLifting(false));
  };

  const readingRows = tags
    ? READING_ORDER.map(({ category, label }) => ({
        label,
        value: tags
          .filter((t) => t.category === category)
          .map((t) => t.label)
          .join(", "),
      })).filter((r) => r.value)
    : [];

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          ref={triggerRef}
          className="grid aspect-square w-full cursor-pointer place-items-center bg-mount p-[6%] text-left hover:bg-[color-mix(in_oklch,var(--mount),var(--foreground)_10%)]">
          <div className="relative size-full">
          {failed ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              Failed to load
            </div>
          ) : (
            <Image
              ref={thumbRef}
              src={currentUrl}
              key={currentUrl}
              alt={photo.file_name}
              fill
              quality={85}
              className={`object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={handleError}
            />
          )}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-fit sm:max-w-3xl flex max-h-[90vh] flex-col overflow-y-auto data-open:animate-none">
        <div
          className="relative max-h-[80vh] overflow-hidden bg-mount p-[4%]"
          style={{
            aspectRatio: `${aspectRatio}`,
            viewTransitionName: lifting ? mountName : undefined,
          }}
        >
          {!dialogLoaded && !failed && !thumbSrc && (
            <Skeleton className="absolute inset-0" />
          )}
          <div className="absolute inset-[4%]">
          {!dialogLoaded && !failed && thumbSrc && (
            // eslint-disable-next-line @next/next/no-img-element -- the grid's already-decoded image, held until the large one loads
            <img
              src={thumbSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full object-contain"
            />
          )}
          {failed ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
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
        </div>
        <DialogFooter className="flex flex-col sm:flex-col">
          <section aria-labelledby={`reading-${photo.photo_id}`} className="w-full">
            <h2
              id={`reading-${photo.photo_id}`}
              className="border-b-[1.5px] border-foreground pb-2 text-base font-bold tracking-tight"
            >
              What Lumen read
            </h2>
            {tagsLoading || (!tags && modalOpen) ? (
              <div className="mt-3 flex flex-col gap-2" aria-busy="true">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ) : readingRows.length > 0 ? (
              <dl className="grid grid-cols-[8rem_1fr] text-sm">
                {readingRows.map((r) => (
                  <div key={r.label} className="contents">
                    <dt className="border-b border-border py-2 text-muted-foreground">{r.label}</dt>
                    <dd className="border-b border-border py-2 font-semibold">{r.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Lumen hasn&apos;t read this photo yet. Choose Analyze below.
              </p>
            )}
          </section>
          <Accordion type="single" collapsible>
            <AccordionItem value="metadata">
              <AccordionTrigger>File details</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <div>
                    <strong>File name:</strong> {photo.file_name}
                  </div>
                  <div>
                    <strong>File size:</strong>{" "}
                    <span className="tabular-nums">{(photo.file_size / 1000000).toFixed(2)}</span> MB
                  </div>
                  <div>
                    <strong>File type:</strong> {photo.file_type}
                  </div>
                  <div>
                    <strong>Dimensions:</strong>{" "}
                    {photo.width && photo.height
                      ? `${photo.width} x ${photo.height}`
                      : "Unknown"}
                  </div>
                  <div>
                    <strong>Last modified:</strong>{" "}
                    {new Date(photo.last_modified || "").toLocaleString()}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex flex-row items-start gap-2 self-start">
            <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderIcon className="mr-2 h-4 w-4" />
                  {albumId ? "Album" : "Add to album"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose album</DialogTitle>
                </DialogHeader>
                <AlbumUploadChooser
                  selectedAlbumId={albumId}
                  onAlbumSelect={handleAlbumSelect}
                />
              </DialogContent>
            </Dialog>
            {(!tags || tags.length === 0) && (
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
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="rounded-none bg-transparent text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes the photo and everything Lumen read in it.
                    It can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant={"outline"}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      if (photo) {
                        onDelete(photo);
                      }
                      setModalOpen(false);
                    }}
                  >
                    Delete photo
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
