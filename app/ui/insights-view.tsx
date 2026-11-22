import { CategoryStat, InsightsData } from "../lib/types";
import { cn } from "@/lib/utils";

function BreakdownCard({
  title,
  stats,
}: {
  title: string;
  stats: CategoryStat[];
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-4">
      <h2 className="flex items-center gap-2">
        <span className="inline-block -rotate-1 bg-tape px-2.5 py-0.5 font-tape text-lg leading-snug text-tape-foreground">
          {title}
        </span>
      </h2>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{stat.label}</span>
              <span className="text-right text-muted-foreground tabular-nums">
                {stat.count} · {stat.percentage}%
              </span>
            </div>
            <div className="h-2 w-full rounded-none bg-muted">
              <div
                className={cn("h-full rounded-none bg-primary")}
                style={{
                  width: `${Math.max(stat.percentage, stat.count > 0 ? 2 : 0)}%`,
                }}
              />
            </div>
          </div>
        ))}
        {stats.length === 0 && (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        )}
      </div>
    </section>
  );
}

function RankedListCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const maxCount = items.length > 0 ? items[0].count : 0;
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-4">
      <h2 className="flex items-center gap-2">
        <span className="inline-block -rotate-1 bg-tape px-2.5 py-0.5 font-tape text-lg leading-snug text-tape-foreground">
          {title}
        </span>
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-4 text-right text-xs text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span>{item.label}</span>
              </span>
              <span className="text-right text-muted-foreground tabular-nums">{item.count}</span>
            </div>
            <div className="h-2 w-full rounded-none bg-muted">
              <div
                className="h-full rounded-none bg-primary"
                style={{
                  width: `${maxCount > 0 ? Math.max((item.count / maxCount) * 100, 2) : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        )}
      </div>
    </section>
  );
}

export default function InsightsView({ data }: { data: InsightsData }) {
  const { perCategory, topSubjects, topMoods } = data;
  // COUNT(*) comes back from postgres as a string; normalise to numbers.
  const totalPhotos = Number(data.totalPhotos);
  const taggedPhotos = Number(data.taggedPhotos);
  const coverage =
    totalPhotos > 0 ? Math.round((taggedPhotos / totalPhotos) * 100) : 0;
  const count = (label: string) =>
    Number(perCategory.setting.find((s) => s.label === label)?.count ?? 0);

  return (
    <div className="flex w-full flex-col gap-12">
      <p className="max-w-[70ch] text-lg text-muted-foreground tabular-nums">
        Lumen has read{" "}
        <span className="font-semibold text-foreground">
          {taggedPhotos} of your {totalPhotos} photos
        </span>{" "}
        ({coverage}%). {count("outdoor")} were taken outdoors, {count("indoor")}{" "}
        indoors.
      </p>

      <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
        <RankedListCard title="What's in them" items={topSubjects} />
        <RankedListCard title="Moods" items={topMoods} />
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        <BreakdownCard title="Light" stats={perCategory.timeOfDay} />
        <BreakdownCard title="Weather" stats={perCategory.weather} />
        <BreakdownCard title="Composition" stats={perCategory.composition} />
        <BreakdownCard title="Palette" stats={perCategory.colorPalette} />
        <BreakdownCard title="Setting" stats={perCategory.setting} />
      </div>
    </div>
  );
}
