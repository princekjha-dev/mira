import { useState } from "react";
import { Download, Lock } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Empty } from "./ui";

export function AuditTable() {
  const { state } = useApp();
  const [q, setQ] = useState("");
  const list = state.audit.filter(
    (a) =>
      !q || Object.values(a).join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  const exportCsv = () => {
    const rows = [
      [
        "ID",
        "Timestamp",
        "User / Officer",
        "Action",
        "Application",
        "Previous state",
        "New state",
        "Reason",
      ],
      ...list.map((a) => [
        a.id,
        a.ts,
        a.actor,
        a.action,
        a.application,
        a.prev,
        a.next,
        a.reason,
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
          .join("\n"),
      ],
      { type: "text/csv" },
    );
    const l = document.createElement("a");
    l.href = URL.createObjectURL(blob);
    l.download = "audit-log.csv";
    l.click();
  };
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by user, action, application…"
          className="max-w-sm"
          aria-label="Filter audit log"
        />
        <Button variant="outline" onClick={exportCsv}>
          <Download className="mr-1 h-4 w-4" />
          Export CSV
        </Button>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Append-only record · entries cannot be edited or deleted
        </span>
      </div>
      {list.length === 0 ? (
        <Empty title="No audit entries match" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User / Officer</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Application / Record</TableHead>
                <TableHead>Previous state</TableHead>
                <TableHead>New state</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap font-mono text-xs">
                    {a.ts}
                  </TableCell>
                  <TableCell className="text-sm">{a.actor}</TableCell>
                  <TableCell className="font-medium">{a.action}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {a.application}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.prev}
                  </TableCell>
                  <TableCell className="text-sm">{a.next}</TableCell>
                  <TableCell className="min-w-48 text-sm text-muted-foreground">
                    {a.reason}
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
