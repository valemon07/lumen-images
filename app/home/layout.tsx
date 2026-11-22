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
        <SidebarInset>
          <main className="relative flex grow pt-14 md:pt-0">
            <SidebarTrigger className="absolute my-4" />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AlbumsProvider>
  );
}
