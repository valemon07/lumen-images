import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUserPhotos, getUserInsights } from "@/app/lib/actions";
import MountImage from "@/app/ui/mount-image";

const RECENT = 8;

function Tape({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block -rotate-1 bg-tape px-2.5 py-0.5 font-tape text-lg leading-snug text-tape-foreground">
      {children}
    </span>
  );
}

export default async function Page() {
  const [photoData, insights] = await Promise.all([
    getCurrentUserPhotos(),
    getUserInsights(),
  ]);

  const photos = photoData?.photos ?? [];
  const urls = photoData?.urls ?? [];
  const recent = photos.slice(0, RECENT).map((photo, i) => ({ photo, url: urls[i] }));
  // COUNT(*) comes back from postgres as a string; normalise to numbers.
  const total = Number(insights?.totalPhotos ?? photos.length);
  const tagged = Number(insights?.taggedPhotos ?? 0);

  // What this person keeps shooting: the top label in each reading Lumen
  // keeps, taken from their own insights. Nothing here is invented.
  const habits = insights
    ? [
        { category: "Subject", top: insights.topSubjects[0] },
        { category: "Mood", top: insights.topMoods[0] },
        { category: "Light", top: insights.perCategory.timeOfDay[0] },
        { category: "Weather", top: insights.perCategory.weather[0] },
        { category: "Composition", top: insights.perCategory.composition[0] },
      ].filter((h) => h.top)
    : [];

  return (
    <div className="flex w-full min-w-0 flex-col px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl leading-[0.95] font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Your lightbox
          </h1>
          <p className="mt-3 text-base text-muted-foreground tabular-nums">
            {total === 0
              ? "Nothing on the table yet."
              : `${total} ${total === 1 ? "photo" : "photos"} on the table · ${tagged} read by Lumen`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/home/upload">Upload photos</Link>
          </Button>
          {total > 0 && (
            <Button asChild size="lg" variant="outline">
              <Link href="/home/photos">All photos</Link>
            </Button>
          )}
        </div>
      </section>

      {recent.length === 0 ? (
        <section className="mt-10 grid aspect-[3/1] min-h-56 w-full place-items-center border-[1.5px] border-dashed border-input p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="max-w-[40ch] text-lg">
              Lay your first photos out here. Lumen reads each one for its
              subjects, light, mood and composition.
            </p>
            <Button asChild>
              <Link href="/home/upload">Upload photos</Link>
            </Button>
          </div>
        </section>
      ) : (
        <section aria-labelledby="recent-heading" className="mt-10">
          <div className="flex items-baseline justify-between gap-4 border-b-[1.5px] border-foreground pb-3">
            <h2 id="recent-heading" className="text-xl font-bold tracking-tight">
              Latest on the table
            </h2>
            <Link href="/home/photos" className="text-sm font-medium hover:underline">
              See all
            </Link>
          </div>
          <ul className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12">
            {recent.map(({ photo, url }) => (
              <li key={photo.photo_id} className="w-52 shrink-0 snap-start sm:w-60">
                <Link
                  href="/home/photos"
                  aria-label={`${photo.file_name}, open photos`}
                  className="grid aspect-square place-items-center bg-mount p-[9%] transition-colors hover:bg-[color-mix(in_oklch,var(--mount),var(--foreground)_10%)]"
                >
                  <MountImage src={url} alt={photo.file_name} sizes="15rem" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {habits.length > 0 && (
        <section aria-labelledby="habits-heading" className="mt-14">
          <div className="flex items-baseline justify-between gap-4 border-b-[1.5px] border-foreground pb-3">
            <h2 id="habits-heading" className="text-xl font-bold tracking-tight">
              What you keep shooting
            </h2>
            <Link href="/home/insights" className="text-sm font-medium hover:underline">
              All insights
            </Link>
          </div>
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {habits.map(({ category, top }) => (
              <div key={category} className="flex flex-col items-start gap-2">
                <dt className="text-sm text-muted-foreground">{category}</dt>
                <dd className="flex flex-col items-start gap-1.5">
                  <Tape>{top!.label}</Tape>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {Number(top!.count)} {Number(top!.count) === 1 ? "photo" : "photos"}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {total > 0 && tagged < total && (
        <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground tabular-nums">
          {total - tagged} {total - tagged === 1 ? "photo hasn't" : "photos haven't"} been
          read yet. Open one in{" "}
          <Link href="/home/photos" className="font-medium text-foreground underline">
            Photos
          </Link>{" "}
          and choose Analyze.
        </p>
      )}
    </div>
  );
}
