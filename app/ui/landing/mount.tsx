"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A slide mount on the lightbox. Hover (fine pointers) or pressing the mount
 * turns it over to the record Lumen wrote for the photo. This turn is the
 * page's one authored motion; reduced motion swaps it for a cross-fade.
 */
export default function Mount({
  label,
  rows,
  children,
  className,
}: {
  label: string;
  rows: { label: string; value: string }[];
  children: ReactNode;
  className?: string;
}) {
  const [turned, setTurned] = useState(false);
  const recordId = useId();

  return (
    <div
      data-turned={turned}
      className={cn("group/mount relative [perspective:1400px]", className)}
    >
      <div className="grid transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-data-[turned=true]/mount:[transform:rotateY(180deg)] pointer-fine:group-hover/mount:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:[transform:none]!">
        <div className="col-start-1 row-start-1 grid aspect-square place-items-center bg-mount p-[9%] [backface-visibility:hidden] motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:group-data-[turned=true]/mount:opacity-0">
          {children}
        </div>
        <div
          id={recordId}
          aria-hidden={!turned}
          className="col-start-1 row-start-1 flex aspect-square flex-col overflow-hidden border-[1.5px] border-foreground bg-background p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] motion-reduce:[transform:none] motion-reduce:opacity-0 motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:group-data-[turned=true]/mount:opacity-100"
        >
          <p className="mb-3 text-xs font-semibold text-muted-foreground">
            Read by Lumen · sample
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm leading-snug">
            {rows.map((r) => (
              <div key={r.label} className="contents">
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="font-semibold">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={turned}
        aria-controls={recordId}
        onClick={() => setTurned((t) => !t)}
        className="absolute inset-0 cursor-pointer focus-visible:outline-offset-4"
      >
        <span className="sr-only">
          {turned ? `Show the photo: ${label}` : `Show what Lumen read in: ${label}`}
        </span>
      </button>
    </div>
  );
}
