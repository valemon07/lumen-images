import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Camera,
  CloudSun,
  Heart,
  LayoutGrid,
  Palette,
  Sparkles,
  Sun,
  Tags,
} from "lucide-react";
import { CategoryStat, InsightsData } from "../lib/types";
import { cn } from "@/lib/utils";

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: typeof Camera;
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{label}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {sublabel && (
          <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div>
        )}
      </CardContent>
    </Card>
  );
}

function BreakdownCard({
  icon: Icon,
  title,
  stats,
}: {
  icon: typeof Building2;
  title: string;
  stats: CategoryStat[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="capitalize">{stat.label}</span>
              <span className="text-muted-foreground">
                {stat.count} · {stat.percentage}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full bg-primary")}
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
      </CardContent>
    </Card>
  );
}

function RankedListCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Tags;
  title: string;
  items: { label: string; count: number }[];
}) {
  const maxCount = items.length > 0 ? items[0].count : 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-4 text-right text-xs text-muted-foreground">
                  {index + 1}
                </span>
                <span className="capitalize">{item.label}</span>
              </span>
              <span className="text-muted-foreground">{item.count}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
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
      </CardContent>
    </Card>
  );
}

export default function InsightsView({ data }: { data: InsightsData }) {
  const { totalPhotos, taggedPhotos, perCategory, topSubjects, topMoods } =
    data;
  const coverage =
    totalPhotos > 0 ? Math.round((taggedPhotos / totalPhotos) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Camera}
          label="Total Photos"
          value={totalPhotos.toLocaleString()}
        />
        <StatCard
          icon={Sparkles}
          label="Analyzed Photos"
          value={taggedPhotos.toLocaleString()}
          sublabel={`${coverage}% of your library`}
        />
        <StatCard
          icon={Building2}
          label="Indoor Photos"
          value={(
            perCategory.setting.find((s) => s.label === "indoor")?.count ?? 0
          ).toLocaleString()}
          sublabel="from the Setting tag"
        />
        <StatCard
          icon={Sun}
          label="Outdoor Photos"
          value={(
            perCategory.setting.find((s) => s.label === "outdoor")?.count ?? 0
          ).toLocaleString()}
          sublabel="from the Setting tag"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BreakdownCard
          icon={Building2}
          title="Setting"
          stats={perCategory.setting}
        />
        <BreakdownCard
          icon={Sun}
          title="Time of Day"
          stats={perCategory.timeOfDay}
        />
        <BreakdownCard
          icon={CloudSun}
          title="Weather"
          stats={perCategory.weather}
        />
        <BreakdownCard
          icon={Palette}
          title="Color Palette"
          stats={perCategory.colorPalette}
        />
        <BreakdownCard
          icon={LayoutGrid}
          title="Composition"
          stats={perCategory.composition}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RankedListCard icon={Tags} title="Top Subjects" items={topSubjects} />
        <RankedListCard icon={Heart} title="Top Moods" items={topMoods} />
      </div>
    </div>
  );
}
