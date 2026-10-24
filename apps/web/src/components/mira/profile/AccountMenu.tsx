import { Link, useNavigate } from "@tanstack/react-router";
import { User, Bell, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { getRoleConfig } from "@/lib/role-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AccountMenuProps {
  className?: string;
  compact?: boolean;
}

export function AccountMenu({ className, compact = false }: AccountMenuProps) {
  const { state, logout } = useApp();
  const nav = useNavigate();

  const role = state.session?.role || "citizen";
  const roleConfig = getRoleConfig(role);

  const name = state.session?.name || roleConfig.defaultIdentity.name;
  const label = roleConfig.label;

  // Determine user's profile URL according to role
  const profileUrl =
    role === "verifier"
      ? "/verifier/settings"
      : role === "officer"
        ? "/officer/settings"
        : role === "admin"
          ? "/department/settings"
          : role === "auditor"
            ? "/auditor/settings"
            : "/citizen/settings";

  const notificationsUrl =
    role === "officer"
      ? "/officer/notifications"
      : role === "admin"
        ? "/department/notifications"
        : "/citizen/notifications";

  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (n[0] || "U").toUpperCase();
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    nav({ to: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex items-center gap-2.5 rounded-xl border border-transparent p-1 sm:px-2.5 sm:py-1.5 transition-all text-left outline-none hover:bg-slate-100/80 hover:border-slate-200/60 dark:hover:bg-slate-800/80 dark:hover:border-slate-700/60",
            className,
          )}
          aria-label="User account menu"
        >
          {/* Avatar circle */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold shadow-2xs">
            {getInitials(name)}
            {/* Active green status pip */}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
          </div>

          {!compact && (
            <div className="hidden sm:flex flex-col min-w-0 pr-1">
              <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-gov transition-colors">
                {name}
              </span>
              <span className="truncate text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                {label}
              </span>
            </div>
          )}

          <ChevronDown className="hidden sm:block h-3 w-3 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-1.5 rounded-xl border border-slate-200/80 shadow-lg dark:border-slate-800"
      >
        <DropdownMenuLabel className="p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {name}
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400">
              Active
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {roleConfig.label}
          </p>
          {state.session?.department && (
            <p className="text-[10px] text-muted-foreground/80 truncate">
              {state.session.department}
            </p>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          asChild
          className="cursor-pointer text-xs py-2 rounded-lg"
        >
          <Link
            to={profileUrl as "/"}
            className="flex items-center gap-2.5 w-full"
          >
            <User className="h-3.5 w-3.5 text-slate-500" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer text-xs py-2 rounded-lg"
        >
          <Link
            to={notificationsUrl as "/"}
            className="flex items-center gap-2.5 w-full"
          >
            <Bell className="h-3.5 w-3.5 text-slate-500" />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-xs py-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 focus:text-rose-700 rounded-lg flex items-center gap-2.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
