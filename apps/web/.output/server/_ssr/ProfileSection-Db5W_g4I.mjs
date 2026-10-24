import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as cn } from "./button-BT328xhy.mjs";
import { gn as ChevronRight } from "../_libs/lucide-react.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function ProfileRow({
  icon: Icon,
  title,
  description,
  value,
  action,
  onClick,
  isLast = false,
  destructive = false,
}) {
  const isClickable = !!onClick;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    onClick,
    role: isClickable ? "button" : void 0,
    tabIndex: isClickable ? 0 : void 0,
    onKeyDown: (e) => {
      if (isClickable && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    },
    className: cn(
      "flex items-center justify-between gap-4 px-4 py-3 text-xs transition-colors",
      !isLast && "border-b border-slate-100 dark:border-slate-800/70",
      isClickable &&
        "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer select-none",
      destructive && "text-rose-600 dark:text-rose-400",
    ),
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-center gap-3 min-w-0",
        children: [
          Icon &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              className: cn(
                "flex h-7 w-7 items-center justify-center rounded-lg shrink-0",
                destructive
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
              ),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
                className: "h-3.5 w-3.5",
              }),
            }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "min-w-0",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className: cn(
                  "font-medium truncate",
                  destructive
                    ? "text-rose-600 dark:text-rose-400 font-semibold"
                    : "text-slate-900 dark:text-slate-100",
                ),
                children: title,
              }),
              description &&
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className:
                    "text-[11px] text-muted-foreground truncate leading-tight mt-0.5",
                  children: description,
                }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-center gap-2 shrink-0",
        children: [
          value &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
              className:
                "text-xs text-slate-600 dark:text-slate-400 font-medium",
              children: value,
            }),
          action,
          isClickable &&
            !action &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
              className: "h-4 w-4 text-slate-300 dark:text-slate-600",
            }),
        ],
      }),
    ],
  });
}
function ProfileSection({ title, description, children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: cn("space-y-1.5", className),
    children: [
      title &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className: "px-1 space-y-0.5",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
              className:
                "text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono",
              children: title,
            }),
            description &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className: "text-[11px] text-muted-foreground",
                children: description,
              }),
          ],
        }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
        className:
          "rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/70",
        children,
      }),
    ],
  });
}
//#endregion
export { ProfileSection as n, ProfileRow as t };
