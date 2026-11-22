import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import AccountMenu from "./accounts-menu";
import Link from "next/link";
import {
  Album,
  Image as ImageIcon,
  Sparkles,
  Upload,
} from "lucide-react";

export function SidebarNav() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <span className="text-xl font-black tracking-tight">Lumen</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/photos">
                  <ImageIcon className="size-4" />
                  <span className="text-sm font-medium">Photos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/albums">
                  <Album className="size-4" />
                  <span className="text-sm font-medium">Albums</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/insights">
                  <Sparkles className="size-4" />
                  <span className="text-sm font-medium">Insights</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">Other</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/upload">
                  <Upload className="size-4" />
                  <span className="text-sm font-medium">Upload</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AccountMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
