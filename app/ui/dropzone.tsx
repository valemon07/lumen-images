"use client";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function MyDropzone(props: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const { files, setFiles } = props;
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
    [setFiles],
  );
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
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
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <p>Drag and drop some files here, or click to select files</p>
      <p>{files.length} files selected</p>
      {thumbs}
    </div>
  );
}
