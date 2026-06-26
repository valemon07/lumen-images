import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AccountMenu from "../ui/accounts-menu";
import { SidebarNav } from "../ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <main className="flex grow">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
