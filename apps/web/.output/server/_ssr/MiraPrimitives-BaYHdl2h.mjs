import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as cn } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import {
  _ as TriangleAlert,
  an as Clock,
  dn as CircleQuestionMark,
  gn as ChevronRight,
  pn as CircleCheck,
  un as CircleX,
} from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MiraPrimitives-BaYHdl2h.js
var import_jsx_runtime = require_jsx_runtime();
function MiraPageHeader({
  title,
  description,
  context,
  breadcrumbs,
  actions,
  badge,
  className,
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: cn("space-y-1.5 pb-2", className),
    children: [
      breadcrumbs &&
        breadcrumbs.length > 0 &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
          "aria-label": "Breadcrumb",
          className: "flex items-center gap-1.5 text-xs text-muted-foreground",
          children: breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "flex items-center gap-1.5",
                children: [
                  idx > 0 &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
                      className: "h-3 w-3 text-muted-foreground/60",
                    }),
                  crumb.to && !isLast
                    ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                        to: crumb.to,
                        className: "hover:text-foreground transition-colors",
                        children: crumb.label,
                      })
                    : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                        className: cn(
                          isLast ? "font-medium text-foreground" : "",
                        ),
                        children: crumb.label,
                      }),
                ],
              },
              idx,
            );
          }),
        }),
      context &&
        !breadcrumbs &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          className:
            "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase",
          children: context,
        }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className:
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-0.5",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "space-y-1 min-w-0",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "flex items-center gap-2.5 flex-wrap",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
                    className:
                      "text-xl sm:text-2xl font-bold tracking-tight text-foreground",
                    children: title,
                  }),
                  badge,
                ],
              }),
              description &&
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className:
                    "text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl",
                  children: description,
                }),
            ],
          }),
          actions &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              className: "flex items-center gap-2 shrink-0",
              children: actions,
            }),
        ],
      }),
    ],
  });
}
function MiraSectionHeader({ title, description, action, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: cn("flex items-center justify-between gap-4 pb-2", className),
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
            className: "text-sm font-semibold text-foreground tracking-tight",
            children: title,
          }),
          description &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
              className: "text-xs text-muted-foreground mt-0.5",
              children: description,
            }),
        ],
      }),
      action &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          children: action,
        }),
    ],
  });
}
function MiraCard({
  children,
  className,
  variant = "standard",
  interactive = false,
  ...props
}) {
  const isInteractive = interactive || variant === "interactive";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: cn(
      {
        standard:
          "rounded-2xl border border-slate-200/80 bg-card text-card-foreground shadow-2xs dark:border-slate-800",
        elevated:
          "rounded-2xl border border-slate-200/70 bg-card text-card-foreground shadow-sm dark:border-slate-800 dark:shadow-slate-950/40",
        interactive:
          "rounded-2xl border border-slate-200/80 bg-card text-card-foreground shadow-2xs hover:border-slate-300 hover:shadow-xs active:scale-[0.99] cursor-pointer transition-all duration-150 dark:border-slate-800 dark:hover:border-slate-700",
        glass:
          "rounded-2xl border border-slate-200/60 bg-card/85 backdrop-blur-md text-card-foreground shadow-xs dark:border-slate-800/80 dark:bg-card/75",
        compact:
          "rounded-xl border border-slate-200/70 bg-card text-card-foreground shadow-2xs p-3 text-xs dark:border-slate-800",
        feature:
          "rounded-3xl border border-slate-200/80 bg-gradient-to-b from-card to-secondary/30 text-card-foreground shadow-md dark:border-slate-800 dark:from-card dark:to-card/50",
      }[variant],
      isInteractive &&
        variant !== "interactive" &&
        "hover:border-slate-300 hover:shadow-xs active:scale-[0.99] cursor-pointer transition-all duration-150 dark:hover:border-slate-700",
      className,
    ),
    ...props,
    children,
  });
}
function MiraStatCard({ title, value, subtext, icon: Icon, trend, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
    className: cn("p-4.5 sm:p-5", className),
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-center justify-between text-muted-foreground",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
            className:
              "text-xs font-medium tracking-tight text-muted-foreground",
            children: title,
          }),
          Icon &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
              className: "h-4 w-4 text-muted-foreground shrink-0",
            }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className: "mt-2 text-2xl font-bold tracking-tight text-foreground",
        children: value,
      }),
      (subtext || trend) &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className: "mt-1 flex items-center gap-1.5 text-[11px]",
          children: [
            trend &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: cn(
                  "font-semibold",
                  trend.tone === "positive"
                    ? "text-teal-600 dark:text-teal-400"
                    : trend.tone === "warning"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground",
                ),
                children: trend.label,
              }),
            subtext &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "text-muted-foreground",
                children: subtext,
              }),
          ],
        }),
    ],
  });
}
function MiraStatus({ status, className }) {
  const norm = (status || "").toLowerCase().trim();
  if (norm === "verified" || norm === "approved" || norm === "completed")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-700 dark:border-teal-400/20 dark:bg-teal-500/15 dark:text-teal-300",
        className,
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
          className: "h-3 w-3",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
          children: status,
        }),
      ],
    });
  if (
    norm.includes("mismatch") ||
    norm.includes("evidence") ||
    norm.includes("action") ||
    norm === "verification required"
  )
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-300",
        className,
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
          className: "h-3 w-3",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
          children: status,
        }),
      ],
    });
  if (norm.includes("review") || norm === "submitted" || norm === "in progress")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/15 dark:text-blue-300",
        className,
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
          className: "h-3 w-3",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
          children: status,
        }),
      ],
    });
  if (norm === "rejected")
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-500/15 dark:text-red-300",
        className,
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, {
          className: "h-3 w-3",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
          children: status,
        }),
      ],
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
    className: cn(
      "inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
      className,
    ),
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
      children: status,
    }),
  });
}
function MiraBadge({
  children,
  tone = "neutral",
  variant = "solid",
  size = "md",
  className,
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
    className: cn(
      "inline-flex items-center gap-1 rounded-md border",
      size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
      variant === "outline"
        ? "bg-transparent"
        : {
            neutral: "border-border bg-muted/60 text-muted-foreground",
            primary:
              "border-primary/20 bg-primary/10 text-primary font-semibold",
            teal: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold",
            amber:
              "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold",
            red: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 font-semibold",
            blue: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold",
          }[tone],
      className,
    ),
    children,
  });
}
function MiraEmptyState({
  title,
  description,
  icon: Icon = CircleQuestionMark,
  action,
  className,
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: cn(
      "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 sm:p-12 text-center",
      className,
    ),
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className:
          "flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
          className: "h-5 w-5",
        }),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
        className: "mt-3 text-sm font-semibold text-foreground",
        children: title,
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
        className:
          "mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed",
        children: description,
      }),
      action &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          className: "mt-4",
          children: action,
        }),
    ],
  });
}
//#endregion
export {
  MiraSectionHeader as a,
  MiraPageHeader as i,
  MiraCard as n,
  MiraStatCard as o,
  MiraEmptyState as r,
  MiraStatus as s,
  MiraBadge as t,
};
