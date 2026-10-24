import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import {
  Lt as FileText,
  k as ShieldCheck,
  pn as CircleCheck,
} from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import {
  a as CardTitle,
  i as CardHeader,
  n as CardContent,
  r as CardDescription,
  t as Card,
} from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.documents-BxBTxVv_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifierDocumentsPage() {
  const { state } = useApp();
  const [selectedDoc, setSelectedDoc] = (0, import_react.useState)(
    "Aadhaar Card — Rajesh Sharma",
  );
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
        title: "Side-by-Side Document Comparison",
        desc: "Cross-reference citizen document uploads against authoritative state registries and digital repositories.",
        crumbs: [
          {
            label: "Verifier",
            to: "/verifier/dashboard",
          },
          { label: "Documents" },
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "grid gap-6 lg:grid-cols-4",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
            className: "border-border/80 shadow-xs lg:col-span-1",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
                className: "p-4 pb-2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
                    className: "text-sm font-semibold",
                    children: "Available Documents",
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
                    className: "text-xs",
                    children: "Sharma Household (HH-UP-0417-2291)",
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
                className: "p-2 space-y-1",
                children: records.map((r) =>
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedDoc(r.name),
                      className: `w-full rounded-lg p-2.5 text-left text-xs transition-colors ${selectedDoc === r.name ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-foreground"}`,
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "font-semibold truncate",
                          children: r.name,
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className: "text-[10px] opacity-80",
                          children: r.type,
                        }),
                      ],
                    },
                    r.name,
                  ),
                ),
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "space-y-4 lg:col-span-3",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "grid gap-4 md:grid-cols-2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
                    className: "border-border/80 shadow-xs",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
                        className: "p-4 pb-3 border-b bg-muted/30",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          "div",
                          {
                            className: "flex items-center justify-between",
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                "div",
                                {
                                  className: "flex items-center gap-2",
                                  children: [
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                      FileText,
                                      { className: "h-4 w-4 text-primary" },
                                    ),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                      CardTitle,
                                      {
                                        className: "text-sm font-semibold",
                                        children: "Citizen Declared Record",
                                      },
                                    ),
                                  ],
                                },
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                Badge,
                                {
                                  variant: "outline",
                                  className: "text-[10px]",
                                  children: current.docId,
                                },
                              ),
                            ],
                          },
                        ),
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
                        className: "p-4 space-y-3 text-xs",
                        children: Object.entries(current.declared).map(
                          ([k, v]) =>
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                              "div",
                              {
                                className: "border-b pb-2 last:border-0",
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "div",
                                    {
                                      className:
                                        "text-muted-foreground capitalize text-[11px]",
                                      children: k.replace(/([A-Z])/g, " $1"),
                                    },
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "div",
                                    {
                                      className:
                                        "font-medium text-foreground mt-0.5",
                                      children: String(v),
                                    },
                                  ),
                                ],
                              },
                              k,
                            ),
                        ),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
                    className: "border-border/80 shadow-xs",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
                        className: "p-4 pb-3 border-b bg-muted/30",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          "div",
                          {
                            className: "flex items-center justify-between",
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                "div",
                                {
                                  className: "flex items-center gap-2",
                                  children: [
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                      ShieldCheck,
                                      { className: "h-4 w-4 text-emerald-600" },
                                    ),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                      CardTitle,
                                      {
                                        className: "text-sm font-semibold",
                                        children:
                                          "Authoritative Registry Source",
                                      },
                                    ),
                                  ],
                                },
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                Badge,
                                {
                                  variant: "outline",
                                  className: `text-[10px] ${current.registry.status.includes("Mismatch") ? "border-amber-400 bg-amber-500/10 text-amber-700" : "border-teal-400 bg-teal-500/10 text-teal-700"}`,
                                  children: current.registry.status,
                                },
                              ),
                            ],
                          },
                        ),
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
                        className: "p-4 space-y-3 text-xs",
                        children: Object.entries(current.registry).map(
                          ([k, v]) =>
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                              "div",
                              {
                                className: "border-b pb-2 last:border-0",
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "div",
                                    {
                                      className:
                                        "text-muted-foreground capitalize text-[11px]",
                                      children: k.replace(/([A-Z])/g, " $1"),
                                    },
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "div",
                                    {
                                      className:
                                        "font-medium text-foreground mt-0.5",
                                      children: String(v),
                                    },
                                  ),
                                ],
                              },
                              k,
                            ),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
                className: "border-border/80 shadow-xs",
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  CardContent,
                  {
                    className:
                      "p-4 flex flex-wrap items-center justify-between gap-3 text-xs",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        className: "text-muted-foreground",
                        children: [
                          "Document checksum: ",
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                            className:
                              "font-mono text-foreground font-semibold",
                            children: "SHA-256: 7d4a…81b3",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        className: "flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                            size: "sm",
                            variant: "outline",
                            className: "h-8 text-xs",
                            children: "Request Fresh Upload",
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
                            size: "sm",
                            className: "h-8 text-xs",
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                CircleCheck,
                                { className: "mr-1.5 h-3.5 w-3.5" },
                              ),
                              "Mark Document Verified",
                            ],
                          }),
                        ],
                      }),
                    ],
                  },
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
//#endregion
export { VerifierDocumentsPage as component };
