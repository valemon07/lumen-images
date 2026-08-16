import { Separator } from "@/components/ui/separator";
import { getUserInsights } from "@/app/lib/actions";
import InsightsView from "@/app/ui/insights-view";

export default async function Page() {
  const insights = await getUserInsights();

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between my-4 mx-8">
        <div className="text-2xl font-medium">Insights</div>
      </div>
      <Separator />
      <main className="flex flex-col w-auto h-auto m-8">
        {insights === null ? (
          <div className="text-muted-foreground">No insights available.</div>
        ) : insights.taggedPhotos === 0 ? (
          <div className="text-muted-foreground">
            Analyze some photos to see insights about your library.
          </div>
        ) : (
          <InsightsView data={insights} />
        )}
      </main>
    </div>
  );
}