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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {parent && parentHref ? (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={parentHref}>{parent}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          ) : null}
          <BreadcrumbItem>
            <BreadcrumbPage>{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
