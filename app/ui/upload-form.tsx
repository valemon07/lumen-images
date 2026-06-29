"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MyDropzone from "./dropzone";

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
      body: JSON.stringify({
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        lastModified: new Date(file.lastModified),
      }),
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

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);

  async function handleUpload() {
    if (files.length === 0) return;
    await Promise.all(
      files.map((file) => {
        uploadImage(file);
      }),
    );
    setFiles([]);
  }

  return (
    <Card>
      <CardHeader className="w-full max-w-sm">
        <CardTitle>Upload Files to AWS</CardTitle>
        <CardDescription>Max size: 10MB</CardDescription>
      </CardHeader>
      <CardContent>
        <MyDropzone files={files} setFiles={setFiles} />
        <Button onClick={handleUpload}>Upload Images</Button>
      </CardContent>
    </Card>
  );
}
