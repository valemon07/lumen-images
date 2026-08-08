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
          <main className="flex grow">
            <SidebarTrigger className="absolute my-4" />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AlbumsProvider>
  );
}
