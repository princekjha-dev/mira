import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp, i as CATEGORY_IMAGE } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Lt as FileText, Pn as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as LevelBadge } from "./ui-lDSlMDlK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SchemeCard-CWS-eln7.js
var import_jsx_runtime = require_jsx_runtime();
function SchemeCard({ s }) {
  const { t } = useApp();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
    className:
      "tactile-card group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-all duration-200",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className:
          "relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
            src: CATEGORY_IMAGE[s.category],
            alt: "",
            loading: "lazy",
            width: 1024,
            height: 656,
            className:
              "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className:
              "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60",
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className:
              "absolute bottom-2.5 left-3 flex flex-wrap items-center gap-1.5",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, {
                level: s.level,
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className:
                  "rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-slate-800 dark:text-slate-200 border border-black/5",
                children: s.category,
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex flex-1 flex-col p-4 sm:p-5",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
            className:
              "font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight leading-snug",
            children: s.name,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className: "text-xs text-muted-foreground mt-0.5 font-medium",
            children: s.department,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
            className:
              "mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2",
            children: s.description,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className:
              "mt-3.5 space-y-1.5 rounded-xl bg-slate-50/70 dark:bg-slate-850/60 p-3 border border-slate-100 dark:border-slate-800/80 text-xs",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className:
                  "font-semibold text-slate-800 dark:text-slate-200 text-[11px] uppercase font-mono tracking-wider",
                children: "Key Criteria",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
                className:
                  "space-y-1 text-[11px] text-muted-foreground leading-normal",
                children: s.eligibility.slice(0, 2).map((e) =>
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "li",
                    {
                      className: "flex items-start gap-1.5",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                          className: "text-gov font-bold",
                          children: "·",
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                          children: e,
                        }),
                      ],
                    },
                    e,
                  ),
                ),
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
                className:
                  "mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1 border-t border-slate-200/50 dark:border-slate-700/50",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
                    className: "h-3 w-3 shrink-0 text-slate-400",
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                    className: "truncate",
                    children: s.documents.join(", "),
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "mt-auto flex flex-wrap items-center gap-2 pt-4",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                size: "sm",
                variant: "outline",
                className: "tactile-btn text-xs h-8 px-2.5 rounded-lg flex-1",
                asChild: true,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                  to: "/schemes/$id",
                  params: { id: s.id },
                  children: "Details",
                }),
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                size: "sm",
                variant: "outline",
                className: "tactile-btn text-xs h-8 px-2.5 rounded-lg flex-1",
                asChild: true,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                  to: "/eligibility",
                  search: { scheme: s.id },
                  children: "Eligibility",
                }),
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                size: "sm",
                className:
                  "tactile-btn text-xs h-8 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 shadow-2xs font-semibold gap-1",
                asChild: true,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
                  to: "/citizen/apply/$schemeId",
                  params: { schemeId: s.id },
                  children: [
                    "Apply",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
                      className: "h-3 w-3",
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
//#endregion
export { SchemeCard as t };
