import { cn } from "@/lib/utils";

export type SchemeTabKey =
  | "overview"
  | "eligibility"
  | "benefits"
  | "documents"
  | "process";

interface SchemeNavigationProps {
  activeTab: SchemeTabKey;
  onTabChange: (tab: SchemeTabKey) => void;
  className?: string;
}

const TABS: { id: SchemeTabKey; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility Criteria" },
  { id: "benefits", label: "Benefits & Entitlements" },
  { id: "documents", label: "Required Documents" },
  { id: "process", label: "How to Apply" },
];

export function SchemeNavigation({
  activeTab,
  onTabChange,
  className,
}: SchemeNavigationProps) {
  return (
    <div
      className={cn(
        "border-b border-border/80 bg-background/95 backdrop-blur-md sticky top-0 z-20",
        className
      )}
    >
      <nav
        aria-label="Scheme Sections"
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-1 sm:px-0"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative shrink-0 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-150",
                isActive
                  ? "text-foreground font-semibold bg-muted/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
