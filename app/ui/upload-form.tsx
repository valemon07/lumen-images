"use client";
import { useRef } from "react";
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

export default function UploadForm() {
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    evt.preventDefault();

    const file = fileInput?.current?.files?.[0];
    if (!file) {
      console.log("err");
      return "Error!";
    }
    await uploadImage(file);
  }

  return (
    <Card>
      <CardHeader className="w-full max-w-sm">
        <CardTitle>Upload Files to AWS</CardTitle>
        <CardDescription>Max size: 10MB</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <input type="file" name="file" ref={fileInput} />
          <Button type="submit" onClick={uploadFile}>
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
