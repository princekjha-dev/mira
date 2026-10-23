import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/verifier/documents")({
  head: () => ({
    meta: [
      { title: "Document Comparison Tool — Verifier Workstation" },
      { name: "description", content: "Side-by-side OCR and registry comparison workstation." },
    ],
  }),
  component: VerifierDocumentsPage,
});

function VerifierDocumentsPage() {
  const { state } = useApp();
  const [selectedDoc, setSelectedDoc] = useState("Aadhaar Card — Rajesh Sharma");

  const records = [
    {
      name: "Aadhaar Card — Rajesh Sharma",
      docId: "DOC-UID-9912",
      type: "Proof of Identity & Age",
      declared: {
        name: "Rajesh Kumar Sharma",
        dob: "1968-04-12",
        gender: "Male",
        address: "Village Rampur, Post Chandauli, UP 232104",
      },
      registry: {
        source: "UIDAI e-KYC Vault",
        status: "Match (100% confidence)",
        name: "Rajesh Kumar Sharma",
        dob: "1968-04-12",
        gender: "Male",
        address: "Village Rampur, Chandauli, Uttar Pradesh 232104",
      },
    },
    {
      name: "Annual Income Certificate — Sharma Family",
      docId: "DOC-INC-4021",
      type: "Income Determination",
      declared: {
        income: "₹ 1,20,000 / year",
        issuer: "Tehsildar Chandauli",
        issueDate: "2025-08-14",
      },
      registry: {
        source: "State Revenue Department Database",
        status: "Mismatch Detected",
        income: "₹ 1,48,000 / year (Agricultural + Dairy)",
        issuer: "Tehsildar Chandauli (Digital Sign Verified)",
        issueDate: "2025-08-14",
      },
    },
    {
      name: "Land Registry Deed (Bhulekh Khatauni)",
      docId: "DOC-LND-1048",
      type: "Property & Land Holding",
      declared: {
        plotNumber: "Khasra 412/1",
        area: "0.24 Hectare",
        dwellingType: "Semi-kutcha single story",
      },
      registry: {
        source: "UP Bhulekh Land Records API",
        status: "Verified Consistent",
        plotNumber: "Khasra 412/1",
        area: "0.24 Hectare",
        encumbrance: "Nil / Clear Title",
      },
    },
  ];

  const current = records.find((r) => r.name === selectedDoc) || records[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Side-by-Side Document Comparison"
        desc="Cross-reference citizen document uploads against authoritative state registries and digital repositories."
        crumbs={[{ label: "Verifier", to: "/verifier/dashboard" }, { label: "Documents" }]}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Document Selector Column */}
        <Card className="border-border/80 shadow-xs lg:col-span-1">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold">Available Documents</CardTitle>
            <CardDescription className="text-xs">Sharma Household (HH-UP-0417-2291)</CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-1">
            {records.map((r) => (
              <button
                key={r.name}
                type="button"
                onClick={() => setSelectedDoc(r.name)}
                className={`w-full rounded-lg p-2.5 text-left text-xs transition-colors ${
                  selectedDoc === r.name
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="font-semibold truncate">{r.name}</div>
                <div className="text-[10px] opacity-80">{r.type}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Side-by-side comparison pane */}
        <div className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Applicant Declared Pane */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="p-4 pb-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold">Citizen Declared Record</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {current.docId}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                {Object.entries(current.declared).map(([k, v]) => (
                  <div key={k} className="border-b pb-2 last:border-0">
                    <div className="text-muted-foreground capitalize text-[11px]">{k.replace(/([A-Z])/g, " $1")}</div>
                    <div className="font-medium text-foreground mt-0.5">{String(v)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Authoritative State Registry Pane */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="p-4 pb-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <CardTitle className="text-sm font-semibold">Authoritative Registry Source</CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      current.registry.status.includes("Mismatch")
                        ? "border-amber-400 bg-amber-500/10 text-amber-700"
                        : "border-teal-400 bg-teal-500/10 text-teal-700"
                    }`}
                  >
                    {current.registry.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                {Object.entries(current.registry).map(([k, v]) => (
                  <div key={k} className="border-b pb-2 last:border-0">
                    <div className="text-muted-foreground capitalize text-[11px]">{k.replace(/([A-Z])/g, " $1")}</div>
                    <div className="font-medium text-foreground mt-0.5">{String(v)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Cross-Verification Finding Actions */}
          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-muted-foreground">
                Document checksum: <span className="font-mono text-foreground font-semibold">SHA-256: 7d4a…81b3</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  Request Fresh Upload
                </Button>
                <Button size="sm" className="h-8 text-xs">
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Mark Document Verified
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
