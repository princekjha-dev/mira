import { Download } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { SCHEMES, STATUSES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Panel } from "./ui";

export function Reports() {
  const { state } = useApp();
  const apps = state.applications.filter((a) => a.status !== "Draft");
  const shown = STATUSES.filter((s) => s !== "Draft");
  const rows = SCHEMES.map((s) => ({ s, counts: shown.map((st) => apps.filter((a) => a.schemeId === s.id && a.status === st).length) })).filter((r) => r.counts.some(Boolean));
  const exportCsv = () => {
    const csv = [["Scheme", ...shown].join(","), ...rows.map((r) => [`"${r.s.name}"`, ...r.counts].join(","))].join("\n");
    const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); l.download = "applications-by-status.csv"; l.click();
  };
  return (
    <Panel title="Applications by scheme and status" actions={<Button size="sm" variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" />Export CSV</Button>}>
      <div className="overflow-x-auto"><Table>
        <TableHeader><TableRow><TableHead>Scheme</TableHead>{shown.map((s) => <TableHead key={s} className="text-center text-xs">{s}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{rows.map((r) => <TableRow key={r.s.id}><TableCell className="font-medium">{r.s.name}</TableCell>{r.counts.map((c, i) => <TableCell key={i} className="text-center">{c || "—"}</TableCell>)}</TableRow>)}</TableBody>
      </Table></div>
      <p className="mt-3 text-xs text-muted-foreground">Counts are computed live from current demo records.</p>
    </Panel>
  );
}
