"use client";
import { useRef } from "react";
import { uploadImage } from "../lib/actions";

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
    <form className="flex flex-col gap-4">
      <label>
        <span>Upload a file</span>
        <input type="file" name="file" ref={fileInput} />
      </label>
      <button type="submit" onClick={uploadFile}>
        Submit
      </button>
    </form>
  );
}
