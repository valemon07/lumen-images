"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useCallback, useState, useRef, HTMLProps } from "react";
import { useDropzone } from "react-dropzone";

const uploadImage = async (file: File) => {
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    },
  );

  if (response.ok) {
    const { url, fields } = await response.json();

    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("file", file);

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.ok) {
      alert("Upload successful!");
    } else {
      console.error("S3 Upload Error:", uploadResponse);
      alert("Upload failed.");
    }
  } else {
    alert("Failed to get pre-signed URL.");
  }
};

export default function MyDropzone(props: {files: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>>}) {
  const {files, setFiles} = props
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
    acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    ),
  );
  }, [setFiles])
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({onDrop});
  
    const thumbs = files.map((file) => {
      return <Image key={file.name} src={file.preview} alt="Uploaded image preview" onLoad={() => URL.revokeObjectURL(file.preview)} width={50} height={50}/>
    })
  
  return (<div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <p>{files.length} files selected</p>
        {thumbs}
      </div>)
}
