import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/app/ui/footer";
import Mount from "@/app/ui/landing/mount";
import PhotoSlot from "@/app/ui/landing/photo-slot";
import { readingRows, samplePhotos, type SamplePhoto } from "@/app/ui/landing/samples";

// Group the sample photos by the reading labels they share, the same way the
// insights page groups a real collection. Only labels shared by 2+ photos.
function sharedGroups(photos: SamplePhoto[], limit = 2) {
  const byLabel = new Map<string, SamplePhoto[]>();
  for (const p of photos) {
    const r = p.reading;
    const labels = [r.timeOfDay, r.weather, r.mood, r.colorPalette, ...r.composition];
    for (const l of new Set(labels)) {
      byLabel.set(l, [...(byLabel.get(l) ?? []), p]);
    }
  }
  return [...byLabel.entries()]
    .filter(([, ps]) => ps.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, limit);
}

function Tape({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block bg-tape px-3 py-0.5 font-tape text-lg leading-snug text-tape-foreground ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export default function Home() {
  const [lead, ...rest] = samplePhotos;
  const groups = sharedGroups(samplePhotos);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-4 py-5 sm:px-8 lg:px-16">
        <Link href="/" className="text-2xl font-black tracking-tight">
          Lumen
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium sm:gap-8 sm:text-base">
          <a href="#how" className="hidden hover:underline sm:inline">
            How it reads photos
          </a>
          <Link href="/login" className="hover:underline">
            Log in
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* First viewport: a compact headline band, then the table of photos. */}
        <section className="px-4 pt-6 pb-12 sm:px-8 lg:px-16 lg:pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="max-w-[13ch] text-[2.75rem] leading-[0.95] font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Lay out your photos. Lumen reads them.
            </h1>
            <div className="flex flex-col gap-2 lg:items-end lg:pb-2">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup" data-primary-action>
                  Start your lightbox
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Free, and private to you.{" "}
                <Link href="/login" className="font-medium text-foreground underline lg:hidden">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Sample photos with Lumen's readings" className="relative">
          <div className="flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 sm:scroll-px-8 lg:scroll-px-16 pt-6 pb-10 sm:px-8 lg:gap-6 lg:px-16 [scrollbar-width:thin]">
            {samplePhotos.map((p, i) => (
              <div key={p.file} className="relative w-[15rem] shrink-0 snap-start sm:w-[18rem] lg:w-[20rem]">
                {i === 0 && (
                  <Tape className="absolute -top-5 left-4 z-10 -rotate-2">
                    {p.reading.weather} · {p.reading.timeOfDay}
                  </Tape>
                )}
                {i === 2 && (
                  <Tape className="absolute -top-5 left-6 z-10 rotate-1">
                    {p.reading.timeOfDay}
                  </Tape>
                )}
                <Mount label={p.alt} rows={readingRows(p.reading)}>
                  <PhotoSlot
                    photo={p}
                    priority={i < 3}
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 18rem, 15rem"
                  />
                </Mount>
              </div>
            ))}
          </div>
          <p className="px-4 text-sm text-muted-foreground sm:px-8 lg:px-16">
            Hover or tap a photo to turn it over.
          </p>
        </section>

        {/* What Lumen writes on every photo. */}
        <section id="how" className="mt-24 scroll-mt-8 px-4 sm:px-8 lg:mt-32 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div className="grid place-items-center bg-mount p-[6%]">
              <PhotoSlot photo={lead} sizes="(min-width: 1024px) 55vw, 100vw" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl leading-none font-black tracking-[-0.035em] sm:text-5xl">
                Every photo comes back with a reading.
              </h2>
              <p className="mt-5 max-w-[60ch] text-lg text-muted-foreground">
                Upload a JPEG, PNG or WebP and Lumen looks at what is actually in
                the frame. It writes down the same things a careful editor would.
              </p>
              <dl className="mt-8 grid grid-cols-[8rem_1fr] border-t-[1.5px] border-foreground text-base">
                {readingRows(lead.reading).map((r) => (
                  <div key={r.label} className="contents">
                    <dt className="border-b border-border py-2.5 text-muted-foreground">{r.label}</dt>
                    <dd className="border-b border-border py-2.5 font-semibold">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-muted-foreground">Sample reading for the photo shown.</p>
            </div>
          </div>
        </section>

        {/* The table, sorted: grouped by what the photos share. */}
        <section className="mt-24 px-4 sm:px-8 lg:mt-32 lg:px-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl leading-none font-black tracking-[-0.035em] sm:text-5xl">
              Then it sorts the whole table.
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg text-muted-foreground">
              Insights groups your collection by what your photos share, so you
              can see what you keep coming back to: the light you shoot in, the
              moods, the compositions. Open any group to see the photos in it.
            </p>
          </div>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            {groups.map(([label, photos]) => (
              <div key={label}>
                <div className="flex items-baseline justify-between gap-4 border-b-[1.5px] border-foreground pb-3">
                  <Tape className="-rotate-1">{label}</Tape>
                  <span className="text-sm text-muted-foreground" data-numeric>
                    {photos.length} photos
                  </span>
                </div>
                <ul className="mt-5 grid grid-cols-3 gap-3">
                  {photos.map((p) => (
                    <li key={p.file} className="grid aspect-square place-items-center bg-mount p-[9%]">
                      <PhotoSlot
                        photo={p}
                        sizes="(min-width: 768px) 14vw, 30vw"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Close. */}
        <section className="mt-24 border-t-[1.5px] border-foreground px-4 py-16 sm:px-8 lg:mt-32 lg:px-16 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl leading-none font-black tracking-[-0.035em] sm:text-5xl">
                Your photos stay yours.
              </h2>
              <p className="mt-5 max-w-[60ch] text-lg text-muted-foreground">
                Only you can see your collection. Files are stored privately and
                shown through short-lived links. Lumen is free.
              </p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">Start your lightbox</Link>
            </Button>
          </div>
        </section>
      </main>

      <Suspense
        fallback={<div className="h-24" aria-hidden />}
      >
        <Footer />
      </Suspense>
    </div>
  );
}
