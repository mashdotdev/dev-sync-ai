"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function ReportsPage() {
  const trpc = useTRPC();
  const { data: reports, isLoading } = useQuery(trpc.reports.list.queryOptions({}));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm">
          AI-generated weekly reports across all your projects.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : !reports?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="size-10 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <p className="font-medium">No reports yet</p>
              <p className="text-sm text-muted-foreground">
                Reports are generated automatically after weekly syncs.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg border bg-muted shrink-0">
                      <FileText className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle className="text-base">
                        Weekly Report — {format(new Date(report.generatedAt), "MMMM d, yyyy")}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {report.project.name}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDistanceToNow(new Date(report.generatedAt), { addSuffix: true })}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <Download className="size-3" data-icon="inline-start" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                  {report.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
