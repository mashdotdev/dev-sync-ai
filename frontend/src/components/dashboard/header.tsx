"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

function getPageInfo(pathname: string): { parent?: string; parentHref?: string; label: string } {
  const segments = pathname.replace("/dashboard", "").split("/").filter(Boolean);

  if (segments.length === 0) return { label: "Overview" };

  const map: Record<string, string> = {
    projects: "Projects",
    integrations: "Integrations",
    reports: "Reports",
    settings: "Settings",
    billing: "Billing",
    new: "New Project",
  };

  if (segments.length === 1) {
    return { label: map[segments[0]] ?? segments[0] };
  }

  if (segments[0] === "projects" && segments[1] === "new") {
    return { parent: "Projects", parentHref: "/dashboard/projects", label: "New Project" };
  }

  if (segments[0] === "projects" && segments[1]) {
    return { parent: "Projects", parentHref: "/dashboard/projects", label: "Project Detail" };
  }

  return { label: map[segments[0]] ?? segments[0] };
}

export function DashboardHeader() {
  const pathname = usePathname();
  const { parent, parentHref, label } = getPageInfo(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/70 backdrop-blur-md px-4 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1 text-foreground/60 hover:text-foreground hover:bg-white/5" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
      <Breadcrumb>
        <BreadcrumbList>
          {parent && parentHref ? (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={parentHref}
                  className="text-foreground/50 hover:text-foreground transition-colors"
                >
                  {parent}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-foreground/30" />
            </>
          ) : null}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
