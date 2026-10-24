import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SCHEMES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LevelBadge, PageHeader, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/department/schemes/")({
  head: () => ({
    meta: [
      { title: "Manage Schemes — Department" },
      {
        name: "description",
        content:
          "Configure schemes, eligibility basis, documents and workflow.",
      },
      { property: "og:title", content: "Manage Schemes" },
      { property: "og:description", content: "Scheme administration." },
    ],
  }),
  component: () => (
    <div>
      <PageHeader
        title="Manage Schemes"
        actions={
          <Button
            onClick={() =>
              toast.info(
                "New scheme drafts require approval from the Scheme Committee",
                { description: "Use an existing scheme as template (demo)." },
              )
            }
          >
            New scheme draft
          </Button>
        }
      />
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scheme</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Benefit type</TableHead>
              <TableHead>Eligibility basis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {SCHEMES.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.department}
                </TableCell>
                <TableCell>
                  <LevelBadge level={s.level} />
                </TableCell>
                <TableCell className="text-sm">{s.basis.join(" + ")}</TableCell>
                <TableCell>
                  <Pill t="ok">Published</Pill>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/department/schemes/$id" params={{ id: s.id }}>
                      Configure
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
});
