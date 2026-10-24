import { useState } from "react";
import {
  PenSquare,
  Search,
  RotateCw,
  ArrowUpDown,
  Archive,
  Star,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MailFilter } from "./MailFilter";
import { type MailFilterState, type SortOrder } from "./types";
import { cn } from "@/lib/utils";

interface MailToolbarProps {
  onComposeClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: MailFilterState;
  onFilterChange: (filter: MailFilterState) => void;
  sortOrder: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  onRefresh: () => void;
  selectedThreadId?: string | null;
  isSelectedStarred?: boolean;
  onToggleStar?: () => void;
  onArchive?: () => void;
  availableApplications?: string[];
  searchRef?: React.RefObject<HTMLInputElement | null>;
  isReadOnly?: boolean;
}

export function MailToolbar({
  onComposeClick,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
  onRefresh,
  selectedThreadId,
  isSelectedStarred = false,
  onToggleStar,
  onArchive,
  availableApplications,
  searchRef,
  isReadOnly = false,
}: MailToolbarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Mail synchronised with state ledger");
    }, 450);
  };

  const getSortLabel = (order: SortOrder) => {
    switch (order) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "unread_first":
        return "Unread First";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2.5 backdrop-blur-md">
      {/* Left section: Refined Compose & Contextual Quick Actions */}
      <div className="flex items-center gap-2">
        {!isReadOnly && (
          <Button
            onClick={onComposeClick}
            className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 shadow-2xs transition-all active:scale-95"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Compose</span>
          </Button>
        )}

        {selectedThreadId && (
          <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2 ml-1">
            {onToggleStar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleStar}
                className="h-8 w-8 text-slate-500 hover:text-amber-500 rounded-lg"
                title={isSelectedStarred ? "Unstar" : "Star message"}
              >
                <Star
                  className={cn(
                    "h-3.5 w-3.5",
                    isSelectedStarred && "fill-amber-400 text-amber-500"
                  )}
                />
              </Button>
            )}
            {onArchive && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onArchive}
                className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg"
                title="Archive thread"
              >
                <Archive className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right section: Search bar, Filter, Sort, Refresh */}
      <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:max-w-md justify-end">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <Input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search communications… (/)"
            className="h-8 pl-8 pr-7 text-xs bg-slate-50/70 border-slate-200/80 rounded-lg focus-visible:bg-white dark:bg-slate-800/60 dark:border-slate-700/60 dark:focus-visible:bg-slate-800"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Popover */}
        <MailFilter
          filter={filter}
          onChange={onFilterChange}
          availableApplications={availableApplications}
        />

        {/* Sort Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs text-slate-600 dark:text-slate-300 gap-1 rounded-lg"
              title="Sort messages"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{getSortLabel(sortOrder)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 text-xs">
            <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground uppercase font-mono">
              Sort By
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(["newest", "oldest", "unread_first"] as SortOrder[]).map((order) => (
              <DropdownMenuItem
                key={order}
                onClick={() => onSortChange(order)}
                className="flex items-center justify-between text-xs cursor-pointer"
              >
                <span>{getSortLabel(order)}</span>
                {sortOrder === order && (
                  <span className="text-gov font-bold">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefreshClick}
          className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg"
          title="Refresh messages"
        >
          <RotateCw
            className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-gov")}
          />
        </Button>
      </div>
    </div>
  );
}
