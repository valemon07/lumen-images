import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "../ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <main className="flex grow">
          <SidebarTrigger className="absolute my-4" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
