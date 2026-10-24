import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { nowStamp, useApp } from "@/lib/app-state";
import { CITIZEN, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, PageHeader, Panel, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/citizen/grievances")({
  head: () => ({
    meta: [
      { title: "Grievances — Citizen" },
      {
        name: "description",
        content: "Raise and track grievances about applications and services.",
      },
      { property: "og:title", content: "Grievances" },
      { property: "og:description", content: "Raise and track grievances." },
    ],
  }),
  component: Grievances,
});

const CATS = [
  "Delay in processing",
  "Incorrect rejection / decision",
  "Document verification issue",
  "Family record error",
  "Benefit not received",
  "Other",
];

function Grievances() {
  const { state, set } = useApp();
  const apps = state.applications.filter(
    (a) => a.householdId === CITIZEN.householdId && a.status !== "Draft",
  );
  const [f, setF] = useState({
    appId: apps[0]?.id ?? "",
    category: CATS[0],
    description: "",
  });
  const [file, setFile] = useState<string>();
  const [err, setErr] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.description.trim().length < 20)
      return setErr("Please describe the issue in at least 20 characters");
    setErr("");
    const id = `GRV-2026-${String(1183 + state.grievances.length).padStart(5, "0")}`;
    set((s) => ({
      grievances: [
        { id, ...f, file, date: nowStamp().slice(0, 10), status: "Received" },
        ...s.grievances,
      ],
    }));
    toast.success("Grievance registered", {
      description: `Reference ${id}. Expected response within 7 working days.`,
    });
    setF({ ...f, description: "" });
    setFile(undefined);
  };
  return (
    <div>
      <PageHeader
        title="Raise & Track Grievance"
        desc="Grievances are routed to the department responsible for the application."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Raise Grievance">
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <Label>Application ID</Label>
              <Select
                value={f.appId}
                onValueChange={(v) => setF({ ...f, appId: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {apps.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.id}
                    </SelectItem>
                  ))}
                  <SelectItem value="General">
                    Not related to an application
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Issue category</Label>
              <Select
                value={f.category}
                onValueChange={(v) => setF({ ...f, category: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={5}
                value={f.description}
                onChange={(e) => setF({ ...f, description: e.target.value })}
                className="mt-1"
                aria-invalid={!!err}
              />
              <p className="mt-1 text-xs text-destructive">{err}</p>
            </div>
            <div>
              <Label>Supporting document (optional)</Label>
              <input
                ref={ref}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0]?.name)}
              />
              <div className="mt-1 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => ref.current?.click()}
                >
                  <Paperclip className="mr-1 h-3.5 w-3.5" />
                  {file ? "Change file" : "Attach file"}
                </Button>
                <span className="truncate text-sm text-muted-foreground">
                  {file}
                </span>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Panel>
        <Panel title="Track Grievance">
          {state.grievances.length === 0 ? (
            <Empty title="No grievances raised" />
          ) : (
            <ul className="divide-y">
              {state.grievances.map((g) => (
                <li key={g.id} className="py-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs">{g.id}</span>
                    <Pill
                      t={
                        g.status === "Resolved"
                          ? "ok"
                          : g.status === "In Progress"
                            ? "info"
                            : "neutral"
                      }
                    >
                      {g.status}
                    </Pill>
                  </div>
                  <p className="mt-1 font-medium">{g.category}</p>
                  <p className="text-muted-foreground">{g.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.appId} · {fmtDate(g.date)}
                    {g.file && ` · ${g.file}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
