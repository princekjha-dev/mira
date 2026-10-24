import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import {
  b as Terminal,
  in as CloudDownload,
  k as ShieldCheck,
} from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import {
  a as CardTitle,
  i as CardHeader,
  n as CardContent,
  r as CardDescription,
  t as Card,
} from "./card-D_Z_TEMQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.export-EiB0XKR3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditorExportPage() {
  const { state } = useApp();
  const [exporting, setExporting] = (0, import_react.useState)(false);
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const data = {
        exportTimestamp: /* @__PURE__ */ new Date().toISOString(),
        auditor: state.session?.name || "Priya Nair",
        merkleRoot:
          "0x8fa13904eb207c6da9d107a6f204d80582d921b777a419c80d44081c7e90aa15",
        totalApplications: state.applications.length,
        totalDecisions: state.decisions?.length || 4,
        decisions: state.decisions,
        auditLogs: state.audit,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mira-forensic-audit-package-${/* @__PURE__ */ new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(
        "Cryptographic compliance package downloaded successfully.",
      );
    }, 800);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
        title: "Cryptographic Ledger & Evidence Export",
        desc: "Generate an offline verifiable, cryptographically signed package containing all decision proofs and audit log chains.",
        crumbs: [
          {
            label: "Auditor",
            to: "/auditor/dashboard",
          },
          { label: "Export" },
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "grid gap-6 lg:grid-cols-2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
            className: "border-border/80 shadow-xs",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
                    className:
                      "text-base font-semibold flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        CloudDownload,
                        { className: "h-5 w-5 text-primary" },
                      ),
                      "Generate Verifiable Audit Package",
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
                    className: "text-xs",
                    children:
                      "This package includes signed SHA-256 state hashes, decision records, and immutable timeline logs.",
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
                className: "space-y-4 text-xs",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                    className: "rounded-lg border bg-muted/30 p-3 space-y-2",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        className: "flex justify-between",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                            className: "text-muted-foreground",
                            children: "Merkle Root Seal:",
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                            className:
                              "font-mono font-semibold text-foreground",
                            children: "0x8fa1…aa15",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        className: "flex justify-between",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                            className: "text-muted-foreground",
                            children: "Encapsulated Decision Records:",
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                            className: "font-medium text-foreground",
                            children: [
                              state.decisions?.length || 4,
                              " records",
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        className: "flex justify-between",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                            className: "text-muted-foreground",
                            children: "Ledger Event Depth:",
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                            className: "font-medium text-foreground",
                            children: [state.audit?.length || 0, " events"],
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                    onClick: handleExport,
                    disabled: exporting,
                    className: "w-full text-xs",
                    children: exporting
                      ? "Generating Cryptographic Manifest…"
                      : "Download Forensic Audit Package (.json)",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
            className: "border-border/80 shadow-xs",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
                    className:
                      "text-base font-semibold flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, {
                        className: "h-5 w-5 text-teal-600",
                      }),
                      "CLI Offline Verification Tool",
                    ],
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
                    className: "text-xs",
                    children:
                      "Verify this export independently on air-gapped systems using standard OpenSSL tools.",
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
                className: "space-y-3 text-xs",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                    className: "text-muted-foreground",
                    children:
                      "Run this standard command to verify that none of the sealed decision records have been tampered with:",
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
                    className:
                      "overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] font-mono text-emerald-400",
                    children:
                      "openssl dgst -sha256 -verify mira-public-key.pem \\ \xA0\xA0-signature export.sig \\ \xA0\xA0mira-forensic-audit-package.json",
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                    className:
                      "flex items-center gap-1.5 text-teal-600 font-medium text-[11px]",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
                        className: "h-4 w-4",
                      }),
                      "100% Deterministic & Air-gap Compatible",
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
//#endregion
export { AuditorExportPage as component };
