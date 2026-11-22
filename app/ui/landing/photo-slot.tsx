import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SamplePhoto } from "./samples";

function hasPhoto(file: string) {
  return fs.existsSync(path.join(process.cwd(), "public", "landing", file));
}

/**
 * The photo inside a slide mount. Renders the user's own landing photo when
 * it exists in `public/landing/`, otherwise an empty window naming the file
 * it is waiting for.
 */
export default function PhotoSlot({
  photo,
  sizes,
  priority = false,
  className,
}: {
  photo: SamplePhoto;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  // Inside a square mount: landscape fills the width, portrait the height.
  const ratio =
    photo.orientation === "portrait"
      ? "aspect-[2/3] h-full w-auto"
      : "aspect-[3/2] w-full";

  if (hasPhoto(photo.file)) {
    return (
      <div className={cn("relative bg-foreground/80", ratio, className)}>
        <Image
          src={`/landing/${photo.file}`}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={photo.alt}
      className={cn(
        "flex items-end overflow-hidden bg-[oklch(0.34_0.004_106)] p-2 text-[0.6875rem] leading-tight break-all text-[oklch(0.88_0.004_106)]",
        ratio,
        className,
      )}
    >
      <span>public/landing/{photo.file}</span>
    </div>
  );
}
