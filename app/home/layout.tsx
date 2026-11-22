import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "../ui/sidebar";
import { AlbumsProvider } from "../ui/albums-provider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlbumsProvider>
      <SidebarProvider>
        <SidebarNav />
        <SidebarInset className="min-w-0 overflow-x-clip">
          <main className="relative flex min-w-0 grow pt-14 lg:pt-0">
            <SidebarTrigger className="absolute top-3 left-2 z-10" />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AlbumsProvider>
  );
}
