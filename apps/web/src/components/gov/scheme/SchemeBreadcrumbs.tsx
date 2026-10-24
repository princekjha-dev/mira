import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { useApp } from "@/lib/app-state";
import type { Scheme } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SchemeBreadcrumbsProps {
  scheme?: Scheme | null;
  currentSection?: string;
  className?: string;
}

export function SchemeBreadcrumbs({
  scheme,
  currentSection,
  className,
}: SchemeBreadcrumbsProps) {
  const { state } = useApp();
  const isCitizen = state.session?.role === "citizen";

  const rootCrumb = isCitizen
    ? { label: "Citizen Workspace", to: "/citizen/dashboard" }
    : { label: "Home", to: "/" };

  const catalogueCrumb = {
    label: isCitizen ? "Schemes & Benefits" : "Schemes",
    to: "/schemes",
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground font-medium mb-4",
        className
      )}
    >
      <Link
        to={rootCrumb.to as "/"}
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>{rootCrumb.label}</span>
      </Link>

      <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />

      <Link
        to={catalogueCrumb.to}
        className="hover:text-foreground transition-colors"
      >
        {catalogueCrumb.label}
      </Link>

      {scheme && (
        <>
          <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />
          <Link
            to="/schemes/$id"
            params={{ id: scheme.id }}
            className={cn(
              "hover:text-foreground transition-colors truncate max-w-[200px] sm:max-w-[320px]",
              !currentSection && "text-foreground font-semibold"
            )}
          >
            {scheme.name}
          </Link>
        </>
      )}

      {currentSection && (
        <>
          <ChevronRight className="h-3 w-3 opacity-50 shrink-0" />
          <span className="text-foreground font-semibold truncate">
            {currentSection}
          </span>
        </>
      )}
    </nav>
  );
}
