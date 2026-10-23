import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { downloadAcknowledgement, useApp } from "@/lib/app-state";
import { STATUSES, getScheme, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, PageHeader, StatusBadge } from "@/components/gov/ui";

export const Route = createFileRoute("/citizen/applications/")({
  head: () => ({
    meta: [
      { title: "My Applications — Citizen" },
      {
        name: "description",
        content:
          "All scheme applications for your household with current stage.",
      },
      { property: "og:title", content: "My Applications" },
      { property: "og:description", content: "Track all your applications." },
    ],
  }),
  component: Apps,
});

function Apps() {
  const { state } = useApp();
  const [status, setStatus] = useState("all");
  const list = state.applications.filter(
    (a) => status === "all" || a.status === status,
  );
  return (
    <div>
      <PageHeader
        title="My Applications"
        desc="Applications made by you or for members of your household."
        actions={
          <Button asChild>
            <Link to="/schemes">New application</Link>
          </Button>
        }
      />
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status</span>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {list.length === 0 ? (
        <Empty
          title="No applications with this status"
          action={
            <Button variant="outline" onClick={() => setStatus("all")}>
              Show all
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="min-w-48">
                    {getScheme(a.schemeId)?.name}
                  </TableCell>
                  <TableCell>{a.applicant}</TableCell>
                  <TableCell>{fmtDate(a.appliedOn)}</TableCell>
                  <TableCell>
                    <StatusBadge s={a.status} />
                  </TableCell>
                  <TableCell>{fmtDate(a.updatedOn)}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button size="sm" variant="outline" asChild>
                      <Link
                        to="/citizen/applications/$id"
                        params={{ id: a.id }}
                      >
                        {a.status === "Draft" ? "Continue" : "View Details"}
                      </Link>
                    </Button>
                    {a.status !== "Draft" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Download acknowledgement"
                        onClick={() =>
                          downloadAcknowledgement(
                            a,
                            getScheme(a.schemeId)?.name ?? "",
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
