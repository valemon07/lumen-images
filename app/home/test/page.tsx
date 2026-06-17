"use client";

import { createTestObject } from "./_insert";
import "@mantine/dropzone/styles.css";
import { Group, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { uploadImage } from "@/app/lib/actions";

export default function Page() {
  return (
    <main className="flex-col justify-center items-center">
      <form
        action={createTestObject}
        className="flex flex-col justify-center items-center"
      >
        <label htmlFor="name">Name of test object</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="enter name"
          className="border-zinc-400 border-x border-y"
        />
        <input
          name="submit"
          value="create new test"
          type="submit"
          className="border-x border-y border-zinc-400 bg-zinc-600"
        />
      </form>
      <Dropzone
        onDrop={(files) => {
          uploadImage(files);
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
