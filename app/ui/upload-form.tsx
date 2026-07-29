"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MyDropzone from "./dropzone";

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
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

const uploadPhoto = async (file: File) => {
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const { width, height } = await getImageDimensions(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);
  formData.append("fileSize", file.size.toString());
  formData.append("fileType", file.type);
  formData.append("lastModified", file.lastModified.toString());
  formData.append("width", width.toString());
  formData.append("height", height.toString());

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (response.ok) {
    window.dispatchEvent(new CustomEvent("photo-uploaded"));
  } else {
    console.error("Upload Error:", response);
    alert("Upload failed.");
  }
};

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);

  async function handleUpload() {
    if (files.length === 0) return;
    await Promise.all(
      files.map((file) => {
        uploadPhoto(file);
      }),
    );
    setFiles([]);
  }

  return (
    <div className="flex flex-col mx-4 my-4 gap-x-4 gap-y-8">
      <div className="w-full max-w-sm">
        <CardTitle>Upload Files to AWS</CardTitle>
        <CardDescription>Max size: 10MB</CardDescription>
      </div>
      <div>
        <MyDropzone files={files} setFiles={setFiles} />
        <Button onClick={handleUpload}>Upload Images</Button>
      </div>
    </div>
  );
}
