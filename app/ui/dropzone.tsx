"use client";
import { Card, CardContent } from "@/components/ui/card";
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
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
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
          className={`rounded-md object-cover transition-opacity ${status ? "opacity-50" : ""}`}
        />
        {status && (
          <div className="absolute inset-0 flex items-center justify-center">
            {status === "uploading" && (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            )}
            {status === "success" && (
              <CircleCheckIcon className="h-4 w-4 text-emerald-500" />
            )}
            {status === "error" && (
              <OctagonXIcon className="h-4 w-4 text-destructive" />
            )}
          </div>
        )}
      </div>
    );
  });

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <Card className="cursor-pointer my-2">
          <CardContent className="flex flex-col justify-center items-center gap-y-4">
            <input {...getInputProps()} />
            <UploadIcon />
            <p className="text-center">
              Drag and drop some files here, or click to select files
            </p>
          </CardContent>
        </Card>
      </div>
      <p>{files.length} file(s) selected</p>
      <div className="flex flex-row flex-wrap gap-2">{thumbs}</div>
    </div>
  );
}
