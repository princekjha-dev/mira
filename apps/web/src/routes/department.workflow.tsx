import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Workflow,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Settings2,
} from "lucide-react";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/department/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow & Lifecycle Configurator — Department" },
      { name: "description", content: "Stage gating, automated verification triggers, and supervisor routing rules." },
    ],
  }),
  component: DeptWorkflowPage,
});

function DeptWorkflowPage() {
  const [stages, setStages] = useState([
    { id: 1, name: "Application Ingestion", auto: true, desc: "Aadhaar e-KYC validation & duplicate prevention check" },
    { id: 2, name: "Registry Cross-Verification", auto: true, desc: "Automatic match with Bhulekh Land Records & Revenue data" },
    { id: 3, name: "Field Inspection Dispatch", auto: false, desc: "Route to assigned Field Official (Ravi Kumar) based on GPS boundary" },
    { id: 4, name: "Physical Evidence Corroboration", auto: false, desc: "Dwelling photo geotag validation & citizen acknowledgement" },
    { id: 5, name: "Verification Officer Determination", auto: false, desc: "Statutory finding & reason note recording by Verifier" },
    { id: 6, name: "Benefit Entitlement Generation", auto: true, desc: "Public ledger record generation & DBT payment queue linkage" },
  ]);

  const handleToggleAuto = (id: number) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, auto: !s.auto } : s))
    );
    toast.success("Workflow stage execution mode updated.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow & Verification Lifecycle Configurator"
        desc="Define statutory stages, automated cross-registry triggers, and officer delegation paths."
        crumbs={[{ label: "Department", to: "/department/dashboard" }, { label: "Workflow Config" }]}
      />

      <div className="space-y-4">
        {stages.map((st, i) => (
          <Card key={st.id} className="border-border/80 shadow-xs">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                  {st.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{st.name}</span>
                    <Badge variant={st.auto ? "secondary" : "outline"} className="text-[10px]">
                      {st.auto ? "Automated Pipeline" : "Manual Officer Discretion"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{st.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Auto-Advance:</span>
                  <Switch checked={st.auto} onCheckedChange={() => handleToggleAuto(st.id)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
