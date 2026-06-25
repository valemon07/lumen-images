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

export function MyDropzone(props: { name?: string; required?: boolean }) {
  const { required, name } = props;
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  async function uploadFiles(files: File[]) {
    await Promise.all(
      files.map((file) => {
        uploadImage(file);
      }),
    );
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
    await uploadFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((v) => {
          dataTransfer.items.add(v);
        });
        hiddenInputRef.current.files = dataTransfer.files;
      }
    },
  });

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <Image
          src={file.preview}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt="Uploaded file thumbnail"
        />
      </div>
    </div>
  ));

  return (
    <div {...getRootProps()}>
      <input
        type="file"
        name={name}
        required={required}
        style={{ opacity: 0 }}
        ref={hiddenInputRef}
      />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default function UploadZone() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const file = formData.get("my-file");
        alert(file.name);
      }}
    >
      <MyDropzone name="my-file" required />
      <Button type="submit">Submit</Button>
    </form>
  );
}
