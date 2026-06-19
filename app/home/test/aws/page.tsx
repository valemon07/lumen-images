"use client";

import { uploadImage } from "@/app/lib/actions";
import {
  ArrowUpTrayIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Group, Text } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import "@mantine/dropzone/styles.css";
import { useState } from "react";

export default function Page() {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (file: File) => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

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

    setUploading(false);
  };

  return (
    <main>
      <h1>Upload a File to S3</h1>
      <Dropzone
        onDrop={(files) => {
          files.map((file) => {
            handleSubmit(file);
          });
        }}
        onReject={(files) => {
          console.log("Rejected files", files);
        }}
        maxSize={10 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <ArrowUpTrayIcon className="top-1/2 h-10 w-10" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <XMarkIcon className="top-1/2 h-10 w-10" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <PhotoIcon className="top-1/2 h-10 w-10" />
          </Dropzone.Idle>
          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>
    </main>
  );
}
