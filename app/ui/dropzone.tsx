"use client";
import {
  UploadIcon,
  Loader2Icon,
  CircleCheckIcon,
  OctagonXIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export type PreviewFile = File & { preview: string };

export type UploadStatus = "uploading" | "success" | "error";

export default function MyDropzone(props: {
  files: PreviewFile[];
  setFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
  statuses?: Record<string, UploadStatus>;
}) {
  const { files, setFiles, statuses = {} } = props;
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map(
          (file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }) as PreviewFile,
        ),
      );
    },
    [setFiles],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 20 * 1024 * 1024,
  });

  const thumbs = files.map((file) => {
    const status = statuses[file.preview];
    return (
      <div key={file.name} className="relative shrink-0">
        <Image
          src={file.preview}
          alt="Uploaded image preview"
          onLoad={() => URL.revokeObjectURL(file.preview)}
          width={50}
          height={50}
          className={`rounded-none object-cover transition-opacity ${status ? "opacity-50" : ""}`}
        />
        {status && (
          <div className="absolute inset-0 flex items-center justify-center">
            {status === "uploading" && (
              <Loader2Icon className="size-4 animate-spin" />
            )}
            {status === "success" && (
              <CircleCheckIcon className="size-4 text-foreground" />
            )}
            {status === "error" && (
              <OctagonXIcon className="size-4 text-destructive" />
            )}
          </div>
        )}
      </div>
    );
  });

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <div
          className={`my-2 flex aspect-[3/2] max-h-80 w-full cursor-pointer flex-col items-center justify-center gap-y-4 border-[1.5px] border-dashed p-6 ${
            isDragActive
              ? "border-foreground bg-mount"
              : "border-input bg-transparent"
          }`}
        >
          <input {...getInputProps()} />
          <UploadIcon />
          <p className="text-center">
            Drag and drop some files here, or click to select files
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground tabular-nums">{files.length} file(s) selected</p>
      <div className="flex flex-row flex-wrap gap-2">{thumbs}</div>
    </div>
  );
}
