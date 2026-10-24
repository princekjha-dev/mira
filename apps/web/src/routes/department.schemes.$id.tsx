import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { getScheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, PageHeader, Panel } from "@/components/gov/ui";

export const Route = createFileRoute("/department/schemes/$id")({
  head: () => ({
    meta: [
      { title: "Configure Scheme — Department" },
      {
        name: "description",
        content: "Scheme eligibility basis, required documents and workflow.",
      },
      { property: "og:title", content: "Configure Scheme" },
      { property: "og:description", content: "Scheme configuration." },
    ],
  }),
  component: Cfg,
});

const WF = [
  "Application Submitted",
  "Documents Checked",
  "Eligibility Verified",
  "Duplicate Check",
  "Officer Review",
  "Decision",
  "Benefit / Disbursement",
];

function Cfg() {
  const { id } = Route.useParams();
  const { state, addAudit } = useApp();
  const s = getScheme(id);
  const [basis, setBasis] = useState<string[]>(s?.basis ?? []);
  const [docs, setDocs] = useState<string[]>(s?.documents ?? []);
  const [newDoc, setNewDoc] = useState("");
  const [wf, setWf] = useState(WF.map((w) => ({ w, on: true })));
  if (!s)
    return (
      <Empty
        title="Scheme not found"
        action={
          <Button asChild>
            <Link to="/department/schemes">Back</Link>
          </Button>
        }
      />
    );
  const save = (what: string) => {
    addAudit({
      actor: `${state.session?.name} (${state.session?.id})`,
      action: `Scheme configuration updated: ${what}`,
      application: s.id,
      prev: "—",
      next: what,
      reason: "Admin change",
    });
    toast.success(`${what} saved`, {
      description: "Change recorded in audit log.",
    });
  };
  return (
    <div>
      <PageHeader
        title={s.name}
        desc={s.department}
        crumbs={[
          { label: "Manage Schemes", to: "/department/schemes" },
          { label: s.name },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link to="/department/rules" search={{ scheme: s.id }}>
              Edit eligibility rules
            </Link>
          </Button>
        }
      />
      <Tabs defaultValue="basis">
        <TabsList>
          <TabsTrigger value="basis">Eligibility basis</TabsTrigger>
          <TabsTrigger value="docs">Required Documents</TabsTrigger>
          <TabsTrigger value="wf">Application Workflow</TabsTrigger>
        </TabsList>
        <TabsContent value="basis">
          <Panel title="Eligibility is assessed on">
            <div className="space-y-3">
              {(["Individual", "Household", "Property"] as const).map((b) => (
                <label key={b} className="flex items-start gap-2 text-sm">
                  <Checkbox
                    checked={basis.includes(b)}
                    onCheckedChange={(v) =>
                      setBasis(v ? [...basis, b] : basis.filter((x) => x !== b))
                    }
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-medium">{b}</span>
                    <span className="block text-xs text-muted-foreground">
                      {b === "Individual"
                        ? "Applicant's own attributes (age, gender, enrolment)"
                        : b === "Household"
                          ? "Household income, BPL status, and one-benefit-per-household checks"
                          : "Land and house ownership across all household members"}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <Button
              className="mt-4"
              disabled={!basis.length}
              onClick={() => save(`Eligibility basis: ${basis.join(" + ")}`)}
            >
              Save
            </Button>
          </Panel>
        </TabsContent>
        <TabsContent value="docs">
          <Panel title="Required documents">
            <ul className="space-y-2">
              {docs.map((d) => (
                <li
                  key={d}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  {d}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove ${d}`}
                    onClick={() => setDocs(docs.filter((x) => x !== d))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (newDoc.trim()) {
                  setDocs([...docs, newDoc.trim()]);
                  setNewDoc("");
                }
              }}
            >
              <Input
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                placeholder="Add document type"
              />
              <Button type="submit" variant="outline">
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </form>
            <Button className="mt-4" onClick={() => save("Required documents")}>
              Save
            </Button>
          </Panel>
        </TabsContent>
        <TabsContent value="wf">
          <Panel title="Application workflow">
            <ol className="space-y-1">
              {wf.map((x, i) => (
                <li key={x.w}>
                  <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
                    <span>
                      <span className="mr-2 font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </span>
                      {x.w}
                    </span>
                    <label className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={x.on}
                        disabled={[
                          "Application Submitted",
                          "Officer Review",
                          "Decision",
                        ].includes(x.w)}
                        onCheckedChange={(v) =>
                          setWf(
                            wf.map((y, j) => (j === i ? { ...y, on: !!v } : y)),
                          )
                        }
                      />
                      Enabled
                    </label>
                  </div>
                  {i < wf.length - 1 && (
                    <ArrowDown className="mx-auto my-0.5 h-3 w-3 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              Officer Review and Decision are mandatory: the platform never
              issues automatic decisions.
            </p>
            <Button
              className="mt-4"
              onClick={() => save("Application workflow")}
            >
              Save
            </Button>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
