import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AccountMenu from "../ui/accounts-menu";
import { SidebarNav } from "../ui/sidebar";
import { Separator } from "@/components/ui/separator";

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
          <SidebarTrigger />
          {/*<Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />*/}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
