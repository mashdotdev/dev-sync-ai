"use client";

import {
  LayoutDashboard,
  FolderKanban,
  Plug,
  FileText,
  Settings,
  CreditCard,
  LogOut,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/utils/auth-client";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
];

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Sidebar collapsible="icon">
      {/* Brand header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 border-2 border-[#09090f]" />
                </div>
                <div className="flex flex-col gap-0 leading-none">
                  <span className="font-semibold tracking-tight text-sidebar-foreground">
                    DevSync<span className="text-[#6366f1]">AI</span>
                  </span>
                  <span className="text-[11px] text-sidebar-foreground/40">
                    Project Manager
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/30 uppercase tracking-wider text-[10px]">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={active ? "text-[#6366f1]" : "text-sidebar-foreground/60 hover:text-sidebar-foreground"}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Account nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/30 uppercase tracking-wider text-[10px]">
            Account
          </SidebarGroupLabel>
          <SidebarMenu>
            {bottomItems.map((item) => {
              const active = isActive(item.href);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={active ? "text-[#6366f1]" : "text-sidebar-foreground/60 hover:text-sidebar-foreground"}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="text-sidebar-foreground/80 hover:text-sidebar-foreground">
                  <Avatar className="size-7 rounded-lg border border-white/10">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
                    <AvatarFallback className="rounded-lg bg-[#6366f1]/20 text-[#6366f1] text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-0 text-left leading-none">
                    <span className="truncate text-sm font-medium">{user?.name ?? "User"}</span>
                    <span className="truncate text-xs text-sidebar-foreground/40">{user?.email}</span>
                  </div>
                  <span className="ml-auto text-[10px] font-medium bg-[#6366f1]/15 text-[#6366f1] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                    free
                  </span>
                  <ChevronUp className="size-3.5 text-sidebar-foreground/30" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/billing">
                    <CreditCard className="size-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
