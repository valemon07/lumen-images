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
  Home,
  Image as ImageIcon,
  Sparkles,
  Upload,
} from "lucide-react";

export function SidebarNav() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex justify-center items-center rounded-lg">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="flex aspect-square size-8 rounded-lg items-center justify-center bg-primary">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Lumen Images</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/photos">
                  <div className="flex aspect-square size-8 rounded-lg items-center justify-center">
                    <ImageIcon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span>Photos</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/albums">
                  <div className="flex aspect-square size-8 rounded-lg items-center justify-center">
                    <Album className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span>Albums</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/insights">
                  <div className="flex aspect-square size-8 rounded-lg items-center justify-center">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span>Insights</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" asChild>
                <Link href="/home/upload">
                  <div className="flex aspect-square size-8 rounded-lg items-center justify-center">
                    <Upload className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span>Upload</span>
                  </div>
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
