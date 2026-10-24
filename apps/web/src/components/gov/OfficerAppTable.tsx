import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import type { Application } from "@/lib/data";
import { STATUSES, getScheme, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Empty, StatusBadge } from "./ui";

export function OfficerAppTable({
  apps,
  statusFilter = true,
}: {
  apps: Application[];
  statusFilter?: boolean;
}) {
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const list = apps.filter(
    (a) =>
      (st === "all" || a.status === st) &&
      (!q ||
        (a.id + a.applicant + (getScheme(a.schemeId)?.name ?? ""))
          .toLowerCase()
          .includes(q.toLowerCase())),
  );
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by ID, applicant or scheme"
          className="max-w-xs"
          aria-label="Filter"
        />
        {statusFilter && (
          <Select value={st} onValueChange={setSt}>
            <SelectTrigger className="w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.filter((s) => s !== "Draft").map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {list.length === 0 ? (
        <Empty title="No applications in this view" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell>{a.applicant}</TableCell>
                  <TableCell className="min-w-48">
                    {getScheme(a.schemeId)?.name}
                  </TableCell>
                  <TableCell>{fmtDate(a.appliedOn)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {a.duplicate && (
                        <span title="Duplicate alert">
                          <AlertOctagon className="h-4 w-4 text-destructive" />
                        </span>
                      )}
                      {a.mismatch && (
                        <span title="Data mismatch">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge s={a.status} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" asChild>
                      <Link
                        to="/officer/applications/$id"
                        params={{ id: a.id }}
                      >
                        Review
                      </Link>
                    </Button>
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
