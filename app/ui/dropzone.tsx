"use client";
import { Card, CardContent } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export type PreviewFile = File & { preview: string };

export default function MyDropzone(props: {
  files: PreviewFile[];
  setFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
}) {
  const { files, setFiles } = props;
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
    return (
      <Image
        key={file.name}
        src={file.preview}
        alt="Uploaded image preview"
        onLoad={() => URL.revokeObjectURL(file.preview)}
        width={50}
        height={50}
      />
    );
  });

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <Card className="cursor-pointer">
          <CardContent className="flex flex-col justify-center items-center gap-y-4">
            <input {...getInputProps()} />
            <UploadIcon />
            <p className="text-center">Drag and drop some files here, or click to select files</p>
          </CardContent>
        </Card>
      </div>
      <p>{files.length} file(s) selected</p>
      <div className="flex flex-row">{thumbs}</div>
    </div>
  );
}
