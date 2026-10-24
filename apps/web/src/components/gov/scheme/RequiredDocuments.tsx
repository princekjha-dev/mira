import { Link } from "@tanstack/react-router";
import { FileText, CheckCircle2, Upload, ExternalLink, ShieldCheck } from "lucide-react";
import type { Scheme } from "@/lib/data";
import { useApp } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RequiredDocumentsProps {
  scheme: Scheme;
  className?: string;
}

const DOC_METADATA: Record<string, { authority: string; validMonths?: number; note?: string }> = {
  "Aadhaar Card": {
    authority: "Unique Identification Authority of India (UIDAI)",
    note: "Used for biometric e-KYC and DBT account linking.",
  },
  "Income Certificate": {
    authority: "Tehsildar / Sub-Divisional Magistrate (Revenue Dept)",
    validMonths: 12,
    note: "Must be issued for the current financial year.",
  },
  "BPL / Priority Ration Card": {
    authority: "Department of Food & Civil Supplies (NFSA)",
    note: "Must display household head and all dependent family members.",
  },
  "Residence / Domicile Certificate": {
    authority: "Revenue Department / District Magistrate",
    note: "Confirms permanent residence within the jurisdiction.",
  },
  "Land / Homestead Possession Document": {
    authority: "Sub-Registrar / Revenue Authority (Bhulekh)",
    note: "Khatauni, Khasra, or registered land settlement deed.",
  },
  "Bonafide / Enrollment Certificate from Institution": {
    authority: "Head of Recognised Educational Institution",
    note: "Must certify course name, academic year, and AISHE code.",
  },
  "Mother & Child Protection (MCP) Card": {
    authority: "Primary Health Centre (PHC) / Anganwadi",
    note: "Must contain registration stamp and vaccination schedule.",
  },
  "Death Certificate of Spouse": {
    authority: "Registrar of Births & Deaths / Municipal Corporation",
    note: "Official digital civil registration record.",
  },
  "Bank Account Details": {
    authority: "Scheduled Commercial Bank / India Post Payments Bank",
    note: "Account must be active and seeded with applicant Aadhaar number.",
  },
};

export function RequiredDocuments({ scheme, className }: RequiredDocumentsProps) {
  const { state } = useApp();
  const session = state.session;
  const isCitizen = session?.role === "citizen";

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              Required Documentary Evidence
            </h3>
            <p className="text-xs text-muted-foreground">
              These official documents are required to support your application determination and field inquiry.
            </p>
          </div>

          {isCitizen && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-lg border-slate-300 dark:border-slate-700 text-xs font-semibold h-8"
            >
              <Link to="/citizen/documents" search={{ upload: false }}>
                <FileText className="h-3.5 w-3.5 mr-1 text-gov" />
                <span>Open My Document Vault</span>
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {scheme.documents.map((docName, idx) => {
            const meta = DOC_METADATA[docName] || {
              authority: "Authorized Competent Authority",
              note: "Official signed certificate or digital record.",
            };

            return (
              <div
                key={idx}
                className="rounded-lg border border-border/70 bg-muted/20 p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <FileText className="h-4 w-4 text-gov shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-sm text-foreground block">
                        {docName}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        Issuing Authority: {meta.authority}
                      </span>
                    </div>
                  </div>

                  {meta.note && (
                    <p className="text-[11px] text-muted-foreground pl-6 leading-relaxed">
                      {meta.note}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Mandatory Evidence</span>
                  <span className="text-slate-600 dark:text-slate-400">PDF / JPG / DigiLocker</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
