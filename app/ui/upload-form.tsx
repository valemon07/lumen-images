"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import MyDropzone, { type PreviewFile, type UploadStatus } from "./dropzone";
import AlbumUploadChooser from "./album-upload-chooser";
import { getCurrentUserAlbums } from "../lib/actions";
import type { Album } from "../lib/types";

function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const uploadPhoto = async (
  file: PreviewFile,
  albumId?: string | null,
): Promise<{ ok: boolean }> => {
  const { width, height } = await getImageDimensions(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);
  formData.append("fileSize", file.size.toString());
  formData.append("fileType", file.type);
  formData.append("lastModified", file.lastModified.toString());
  formData.append("width", width.toString());
  formData.append("height", height.toString());
  if (albumId) {
    formData.append("albumId", albumId);
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (response.ok) {
    window.dispatchEvent(new CustomEvent("photo-uploaded"));
    return { ok: true };
  } else {
    console.error("Upload Error:", response);
    return { ok: false };
  }
};

export default function UploadForm({
  initialAlbumId,
}: {
  initialAlbumId?: string;
}) {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(
    initialAlbumId ?? null,
  );
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, UploadStatus>>({});

  useEffect(() => {
    getCurrentUserAlbums().then((result) => {
      if (result) {
        setAlbums(result);
      }
      setAlbumsLoading(false);
    });
  }, []);

  const handleFilesChange = (updater: React.SetStateAction<PreviewFile[]>) => {
    setStatuses({});
    setFiles(updater);
  };

  async function handleUpload() {
    if (files.length === 0 || uploading) return;
    setUploading(true);
    setStatuses(
      Object.fromEntries(
        files.map((file) => [file.preview, "uploading" as const]),
      ),
    );
    try {
      const results = await Promise.allSettled(
        files.map((file) => uploadPhoto(file, selectedAlbumId)),
      );
      const nextStatuses: Record<string, UploadStatus> = {};
      results.forEach((result, index) => {
        nextStatuses[files[index].preview] =
          result.status === "fulfilled" && result.value.ok
            ? "success"
            : "error";
      });
      setStatuses(nextStatuses);

      const successCount = Object.values(nextStatuses).filter(
        (status) => status === "success",
      ).length;
      const failureCount = files.length - successCount;
      if (failureCount === 0) {
        toast.success(`Uploaded ${successCount} image(s)`);
      } else {
        toast.error(`${failureCount} upload(s) failed`);
      }

      setTimeout(() => {
        setFiles([]);
        setStatuses({});
      }, 1500);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col mx-4 my-4 gap-x-4 gap-y-8">
      <div className="w-full max-w-sm">
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>Max size: 20MB</CardDescription>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full max-w-sm">
          <label className="text-sm font-medium mb-1.5 block">
            Album (optional)
          </label>
          {albumsLoading ? (
            <div className="h-9 rounded-md border bg-muted animate-pulse" />
          ) : (
            <AlbumUploadChooser
              albums={albums}
              selectedAlbumId={selectedAlbumId}
              onAlbumSelect={setSelectedAlbumId}
            />
          )}
        </div>
        <MyDropzone
          files={files}
          setFiles={handleFilesChange}
          statuses={statuses}
        />
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          {uploading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>
    </div>
  );
}
