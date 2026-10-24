import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, ClipboardCheck, Sparkles, Send } from "lucide-react";
import { useApp } from "@/lib/app-state";
import type { Scheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApplicationCTAProps {
  scheme: Scheme;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function ApplicationCTA({ scheme, className, size = "default" }: ApplicationCTAProps) {
  const { state } = useApp();
  const session = state.session;
  const isCitizen = session?.role === "citizen";

  // Check if citizen has already applied to this scheme
  const existingApp = isCitizen
    ? state.applications.find((a) => a.schemeId === scheme.id)
    : null;

  const isApproved = existingApp?.status === "Approved";

  if (isCitizen && existingApp) {
    if (isApproved) {
      return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
          <Button
            size={size}
            asChild
            className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-xs"
          >
            <Link to="/citizen/benefits" search={{ schemeId: scheme.id } as any}>
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              <span>View Active Benefit</span>
              <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size={size}
            asChild
            className="rounded-lg border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Link to="/citizen/applications/$id" params={{ id: existingApp.id }}>
              <span>Application {existingApp.id}</span>
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <Button
          size={size}
          asChild
          className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium shadow-xs"
        >
          <Link to="/citizen/applications/$id" params={{ id: existingApp.id }}>
            <ClipboardCheck className="h-4 w-4 mr-1.5" />
            <span>Track Application ({existingApp.id})</span>
            <ArrowUpRight className="h-3.5 w-3.5 ml-1 opacity-70" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size={size}
          asChild
          className="rounded-lg border-slate-300 dark:border-slate-700"
        >
          <Link to="/eligibility" search={{ scheme: scheme.id }}>
            <span>Review Eligibility</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Not applied or unauthenticated
  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <Button
        size={size}
        asChild
        className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium shadow-xs"
      >
        <Link
          to={isCitizen ? "/citizen/apply/$schemeId" : "/citizen/apply/$schemeId"}
          params={{ schemeId: scheme.id }}
        >
          <Send className="h-4 w-4 mr-1.5" />
          <span>{isCitizen ? "Apply Now" : "Apply for Scheme"}</span>
        </Link>
      </Button>

      <Button
        variant="outline"
        size={size}
        asChild
        className="rounded-lg border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
      >
        <Link to="/eligibility" search={{ scheme: scheme.id }}>
          <Sparkles className="h-4 w-4 mr-1.5 text-gov" />
          <span>{isCitizen ? "Check My Eligibility" : "Check Eligibility"}</span>
        </Link>
      </Button>
    </div>
  );
}
