"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** A photo inside a slide mount, with a pulsing window until it loads. */
export default function MountImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className="relative block size-full">
      {!loaded && (
        <span
          aria-hidden
          className="absolute inset-[12%] animate-pulse bg-foreground/10 motion-reduce:animate-none"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-contain transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </span>
  );
}
