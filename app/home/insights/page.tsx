import { getUserInsights } from "@/app/lib/actions";
import InsightsView from "@/app/ui/insights-view";

export default async function Page() {
  const insights = await getUserInsights();

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <h1 className="text-3xl font-black leading-none tracking-[-0.035em] sm:text-4xl">Insights</h1>
      </header>
      {insights === null ? (
        <div className="grid aspect-[3/2] w-full place-items-center border-[1.5px] border-dashed border-input bg-transparent p-6 text-center text-muted-foreground">
          No insights available yet.
        </div>
      ) : insights.taggedPhotos === 0 ? (
        <div className="grid aspect-[3/2] w-full place-items-center border-[1.5px] border-dashed border-input bg-transparent p-6 text-center text-muted-foreground">
          No analyzed photos yet. Open a photo and choose Analyze to see insights.
        </div>
      ) : (
        <InsightsView data={insights} />
      )}
    </div>
  );
}
