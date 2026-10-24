import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import {
  E as inr,
  F as useApp,
  T as getScheme,
  _ as downloadAcknowledgement,
  a as CITIZEN,
  c as MEMBERS,
  k as nowStamp,
  m as apiRequest,
  o as HOUSEHOLD,
} from "./app-state-7jSiCijd.mjs";
import { r as cn, t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import {
  H as Plus,
  L as Save,
  Lt as FileText,
  Qt as Download,
  W as Pencil,
  pn as CircleCheck,
  vn as Check,
} from "../_libs/lucide-react.mjs";
import {
  c as Pill,
  o as PageHeader,
  r as LevelBadge,
  s as Panel,
  t as Empty,
} from "./ui-lDSlMDlK.mjs";
import { t as Label } from "./label-DubpHrt-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
import {
  a as SelectValue,
  i as SelectTrigger,
  n as SelectContent,
  r as SelectItem,
  t as Select,
} from "./select-Sj_zxMfs.mjs";
import { t as Route } from "./citizen.apply._schemeId-BSxw4sXi.mjs";
import { t as Checkbox } from "./checkbox-wQewKegS.mjs";
import {
  i as formatBytes,
  n as DocumentUploader,
  r as DocumentViewer,
} from "./DocumentViewer-RIeDKuW9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.apply._schemeId-DKSIsuMp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function matchesRequirement(doc, required) {
  const text = `${doc.document_type} ${doc.original_filename}`
    .toLowerCase()
    .replaceAll("_", " ");
  const requirement = required.toLowerCase();
  if (requirement.includes("income")) return text.includes("income");
  if (requirement.includes("aadhaar") || requirement.includes("identity"))
    return text.includes("identity") || text.includes("aadhaar");
  if (requirement.includes("residence") || requirement.includes("address"))
    return text.includes("residence") || text.includes("address");
  if (requirement.includes("bpl"))
    return text.includes("bpl") || text.includes("economic");
  if (requirement.includes("birth")) return text.includes("birth");
  if (requirement.includes("property") || requirement.includes("land"))
    return text.includes("property") || text.includes("land");
  if (requirement.includes("bank")) return text.includes("bank");
  return text.includes(requirement);
}
function categoryFor(requirement) {
  const text = requirement.toLowerCase();
  if (text.includes("income")) return "Income";
  if (text.includes("aadhaar") || text.includes("identity")) return "Identity";
  if (text.includes("residence") || text.includes("address")) return "Address";
  if (text.includes("bpl")) return "BPL / Economic Status";
  if (text.includes("birth")) return "Birth";
  if (text.includes("property")) return "Property";
  if (text.includes("land")) return "Land";
  if (text.includes("bank")) return "Bank";
  return "Scheme-specific";
}
function DocumentPicker({
  session,
  documents,
  docType,
  required,
  value,
  onChange,
  onUploaded,
}) {
  const [showUpload, setShowUpload] = (0, import_react.useState)(false);
  const [preview, setPreview] = (0, import_react.useState)(null);
  const options = (0, import_react.useMemo)(
    () =>
      documents.filter(
        (doc) => doc.status === "READY" && matchesRequirement(doc, docType),
      ),
    [documents, docType],
  );
  const selected = options.find((doc) => doc.id === value?.documentId);
  const choose = (doc) =>
    onChange({
      name: doc.original_filename,
      size: doc.size_bytes,
      url: "",
      result:
        doc.verification_status === "VERIFIED"
          ? "Verified"
          : doc.verification_status === "REJECTED"
            ? "Unreadable document"
            : "Manual verification required",
      documentId: doc.id,
      versionId: doc.id,
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "rounded-xl border bg-white p-4",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
        className: "flex items-start justify-between gap-3",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
                className: "text-sm font-semibold text-slate-900",
                children: [
                  docType,
                  required &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      className: "ml-1 text-red-600",
                      children: "*",
                    }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className: "mt-1 text-xs text-slate-500",
                children:
                  "Choose a secure document already in your library or upload one.",
              }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
            className: "h-5 w-5 text-slate-400",
          }),
        ],
      }),
      selected
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className:
              "mt-3 flex items-center justify-between gap-2 rounded-lg bg-stone-50 p-3",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "min-w-0",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                    className: "truncate text-sm font-medium",
                    children: selected.original_filename,
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
                    className: "mt-0.5 text-xs text-slate-500",
                    children: [
                      formatBytes(selected.size_bytes),
                      " · ",
                      selected.verification_status === "VERIFIED"
                        ? "Verified"
                        : "Review required",
                      " · Version ",
                      selected.version_number || 1,
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => onChange(void 0),
                children: "Remove",
              }),
            ],
          })
        : options.length
          ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
              className: "mt-3 space-y-2",
              children: options.map((doc) =>
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "li",
                  {
                    className:
                      "flex items-center gap-2 rounded-lg border p-2.5",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                        className: "min-w-0 flex-1",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                            className: "truncate text-sm font-medium",
                            children: doc.original_filename,
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
                            className: "text-xs text-slate-500",
                            children: [
                              formatBytes(doc.size_bytes),
                              " · ",
                              new Date(doc.created_at).toLocaleDateString(
                                "en-IN",
                              ),
                              " · ",
                              doc.verification_status === "VERIFIED"
                                ? "Verified"
                                : "Review required",
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        onClick: () => setPreview(doc),
                        children: "View",
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
                        type: "button",
                        size: "sm",
                        variant: "outline",
                        onClick: () => choose(doc),
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
                            className: "mr-1 h-3.5 w-3.5",
                          }),
                          "Use",
                        ],
                      }),
                    ],
                  },
                  doc.id,
                ),
              ),
            })
          : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
              className:
                "mt-3 rounded-lg bg-stone-50 p-3 text-xs text-slate-500",
              children: "No matching document in My Documents yet.",
            }),
      session &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
          className: "mt-3",
          children: showUpload
            ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                className: "space-y-2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    DocumentUploader,
                    {
                      session,
                      documentType: categoryFor(docType),
                      onUploaded: async () => {
                        const match = (await onUploaded()).find((doc) =>
                          matchesRequirement(doc, docType),
                        );
                        if (match) choose(match);
                      },
                      onComplete: () => setShowUpload(false),
                    },
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setShowUpload(false),
                    children: "Close uploader",
                  }),
                ],
              })
            : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => setShowUpload(true),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
                    className: "mr-1.5 h-4 w-4",
                  }),
                  "Upload document",
                ],
              }),
        }),
      preview &&
        session &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentViewer, {
          document: preview,
          session,
          onClose: () => setPreview(null),
          onChanged: () => void onUploaded(),
        }),
    ],
  });
}
var STEPS = [
  "Personal Details",
  "Household Details",
  "Income & Property",
  "Scheme Questions",
  "Documents",
  "Review",
  "Declaration & Submit",
];
var initialForm = {
  name: CITIZEN.name,
  dob: CITIZEN.dob,
  gender: CITIZEN.gender,
  mobile: CITIZEN.mobile,
  email: CITIZEN.email,
  address: CITIZEN.address,
  dependents: "3",
  incomeSource: "Agriculture and daily wage",
  income: String(HOUSEHOLD.annualIncome),
  land: "0.8 ha, Khasra 214 (ancestral)",
  assets: "",
  answers: {},
};
function Apply() {
  const { schemeId } = Route.useParams();
  const s = getScheme(schemeId);
  const { state, set, addAudit, createApp, submitApp } = useApp();
  const key = `udp-draft-${schemeId}`;
  const [step, setStep] = (0, import_react.useState)(0);
  const [f, setF] = (0, import_react.useState)(initialForm);
  const [docs, setDocs] = (0, import_react.useState)({});
  const [libraryDocs, setLibraryDocs] = (0, import_react.useState)([]);
  const [decl, setDecl] = (0, import_react.useState)({
    consent: false,
    accurate: false,
  });
  const [errors, setErrors] = (0, import_react.useState)({});
  const [saved, setSaved] = (0, import_react.useState)("");
  const [done, setDone] = (0, import_react.useState)(null);
  const [submitting, setSubmitting] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    try {
      const d = localStorage.getItem(key);
      if (d) {
        const p = JSON.parse(d);
        setF(p.f);
        setStep(p.step);
        setDocs(p.docs ?? {});
        toast.info("Restored your saved draft");
      }
    } catch {}
  }, [key]);
  (0, import_react.useEffect)(() => {
    if (!state.session?.apiToken) return;
    let active = true;
    apiRequest(state.session, "/api/v1/documents?owner_type=CITIZEN")
      .then(
        (result) =>
          active &&
          setLibraryDocs(result.data.filter((doc) => doc.status === "READY")),
      )
      .catch(() => active && setLibraryDocs([]));
    return () => {
      active = false;
    };
  }, [state.session?.apiToken, state.session?.apiUserId]);
  (0, import_react.useEffect)(() => {
    if (done) return;
    const tm = setTimeout(() => {
      localStorage.setItem(
        key,
        JSON.stringify({
          f,
          step,
          docs,
        }),
      );
      setSaved(
        /* @__PURE__ */ new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 600);
    return () => clearTimeout(tm);
  }, [f, step, docs, key, done]);
  const refreshLibrary = async () => {
    if (!state.session?.apiToken) return [];
    try {
      const next = (
        await apiRequest(state.session, "/api/v1/documents?owner_type=CITIZEN")
      ).data.filter((doc) => doc.status === "READY");
      setLibraryDocs(next);
      return next;
    } catch {
      return libraryDocs;
    }
  };
  if (!s)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
      title: "Scheme not found",
      action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
        asChild: true,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
          to: "/schemes",
          children: "Browse schemes",
        }),
      }),
    });
  const needsIncome = s.incomeMax !== void 0 || s.bplRequired;
  const needsProperty = !!s.property;
  const up = (k, v) =>
    setF({
      ...f,
      [k]: v,
    });
  const validate = (i) => {
    const e = {};
    if (i === 0) {
      if (f.name.trim().length < 3) e.name = "Enter full name";
      if (!/^[\dX]{10}$/.test(f.mobile))
        e.mobile = "Enter a 10-digit mobile number";
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email))
        e.email = "Enter a valid email";
      if (f.address.trim().length < 10) e.address = "Enter full address";
    }
    if (i === 2 && needsIncome && !(Number(f.income) > 0))
      e.income = "Enter annual household income";
    if (i === 3)
      s.questions.forEach((q) => {
        if (!f.answers[q]?.trim()) e[q] = "This answer is required";
      });
    if (i === 4)
      s.documents.forEach((d) => {
        if (!docs[d]) e[d] = "Upload required";
      });
    if (i === 6) {
      if (!decl.consent) e.consent = "Consent is required";
      if (!decl.accurate) e.accurate = "Declaration is required";
    }
    setErrors(e);
    if (Object.keys(e).length)
      toast.error("Please complete the highlighted fields");
    return Object.keys(e).length === 0;
  };
  const next = () => {
    if (validate(step)) setStep(step + 1);
  };
  const submit = async () => {
    if (!validate(6) || submitting) return;
    setSubmitting(true);
    try {
      let schemeUuid = "f5b56b91-2536-4919-9b2e-a0ce136a2c63";
      if (s.id === "sanitation")
        schemeUuid = "dfd0a6d6-de7b-47a5-b1a8-9e825f58efcb";
      else if (s.id === "rural-housing")
        schemeUuid = "8127bd85-d309-4d92-b9a0-bd8660155f18";
      const metadata = {
        applicant_name: f.name,
        income: Number(f.income),
        address: f.address,
        answers: f.answers,
        step: 6,
      };
      let finalApp;
      if (state.session?.apiToken) {
        const draft = await createApp(schemeUuid, metadata);
        finalApp = await submitApp(draft.id);
      } else {
        finalApp = {
          id: `MIRA-2026-${String(Date.now()).slice(-6)}`,
          schemeId: s.id,
          applicant: f.name,
          citizenId: CITIZEN.id,
          householdId: CITIZEN.householdId,
          appliedOn: nowStamp().slice(0, 10),
          updatedOn: nowStamp().slice(0, 10),
          status: "Submitted",
          stage: 1,
          declaredIncome: Number(f.income),
          events: [
            {
              date: nowStamp().slice(0, 16),
              text: "Application submitted",
              by: f.name,
            },
          ],
        };
        set((st) => ({ applications: [finalApp, ...st.applications] }));
      }
      addAudit({
        actor: `${f.name} (${CITIZEN.id})`,
        action: "Application submitted",
        application: finalApp.id,
        prev: "Draft",
        next: "Submitted",
        reason: "Citizen submission",
      });
      localStorage.removeItem(key);
      setDone(finalApp);
      toast.success(
        "Application submitted successfully and saved to official registry.",
      );
    } catch (e) {
      toast.error(e.message || "Failed to submit application. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };
  if (done)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "mx-auto max-w-xl rounded-lg border bg-card p-8 text-center",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
          className: "mx-auto h-12 w-12 text-success",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
          className: "mt-3 text-xl font-semibold text-navy",
          children: "Application submitted",
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
          className: "mx-auto mt-5 max-w-sm space-y-2 text-left text-sm",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex justify-between",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
                  className: "text-muted-foreground",
                  children: "Application ID",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
                  className: "font-mono font-semibold",
                  children: done.id,
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex justify-between",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
                  className: "text-muted-foreground",
                  children: "Submitted on",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
                  children: done.appliedOn,
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "flex justify-between gap-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
                  className: "text-muted-foreground",
                  children: "Next step",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
                  className: "text-right",
                  children:
                    done.status === "Verification Required"
                      ? "Officer verification of flagged items"
                      : "Document check (1–3 working days)",
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className: "mt-6 flex flex-wrap justify-center gap-2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
              asChild: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                to: "/citizen/applications/$id",
                params: { id: done.id },
                children: "Track Application",
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
              variant: "outline",
              onClick: () => downloadAcknowledgement(done, s.name),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
                  className: "mr-1 h-4 w-4",
                }),
                "Download acknowledgement",
              ],
            }),
          ],
        }),
      ],
    });
  const err = (k) =>
    errors[k] &&
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
      className: "mt-1 text-xs text-destructive",
      children: errors[k],
    });
  const field = (k, label, opts = {}) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
          htmlFor: k,
          className: "flex items-center gap-2",
          children: [
            label,
            opts.verified &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
                t: "ok",
                className: "text-[10px]",
                children: "Verified record",
              }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
          id: k,
          type: opts.type ?? "text",
          value: f[k],
          onChange: (e) => up(k, e.target.value),
          className: "mt-1",
          "aria-invalid": !!errors[k],
        }),
        err(k),
      ],
    });
  const reviewSection = (i, rows) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
      className: "rounded-lg border",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
          className:
            "flex items-center justify-between border-b bg-muted/50 px-4 py-2",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
              className: "text-sm font-semibold",
              children: STEPS[i],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
              size: "sm",
              variant: "ghost",
              onClick: () => setStep(i),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
                  className: "mr-1 h-3.5 w-3.5",
                }),
                "Edit",
              ],
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
          className: "grid gap-x-6 gap-y-2 p-4 text-sm sm:grid-cols-2",
          children: rows.map(([k, v]) =>
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
                    className: "text-xs text-muted-foreground",
                    children: k,
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
                    children: v || "—",
                  }),
                ],
              },
              k,
            ),
          ),
        }),
      ],
    });
  const active = MEMBERS.filter((m) => m.membership === "Active");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
        title: `Apply: ${s.name}`,
        desc: s.department,
        crumbs: [
          {
            label: "Schemes",
            to: "/schemes",
          },
          { label: "Apply" },
        ],
        actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, {
          level: s.level,
        }),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
        className: "mb-6 flex gap-1 overflow-x-auto pb-1",
        "aria-label": "Progress",
        children: STEPS.map((st, i) =>
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "li",
            {
              className: "min-w-28 flex-1",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
                onClick: () => i < step && setStep(i),
                disabled: i > step,
                className: cn(
                  "w-full border-t-4 pt-2 text-left text-xs",
                  i < step
                    ? "border-success text-success"
                    : i === step
                      ? "border-gov font-semibold text-navy"
                      : "border-border text-muted-foreground",
                ),
                "aria-current": i === step ? "step" : void 0,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
                    className: "flex items-center gap-1",
                    children: [
                      i < step &&
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
                          className: "h-3 w-3",
                        }),
                      "Step ",
                      i + 1,
                    ],
                  }),
                  st,
                ],
              }),
            },
            st,
          ),
        ),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
        title: `Step ${step + 1} — ${STEPS[step]}`,
        actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
          className: "flex items-center gap-1 text-xs text-muted-foreground",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
              className: "h-3.5 w-3.5",
            }),
            saved ? `Draft saved ${saved}` : "Autosave on",
          ],
        }),
        children: [
          step === 0 &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "grid gap-4 sm:grid-cols-2",
              children: [
                field("name", "Full Name", { verified: true }),
                field("dob", "Date of Birth", {
                  verified: true,
                  type: "date",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
                      children: "Gender",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
                      value: f.gender,
                      onValueChange: (v) => up("gender", v),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          SelectTrigger,
                          {
                            className: "mt-1",
                            children: /* @__PURE__ */ (0,
                            import_jsx_runtime.jsx)(SelectValue, {}),
                          },
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          SelectContent,
                          {
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                SelectItem,
                                {
                                  value: "Female",
                                  children: "Female",
                                },
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                SelectItem,
                                {
                                  value: "Male",
                                  children: "Male",
                                },
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                SelectItem,
                                {
                                  value: "Other",
                                  children: "Other",
                                },
                              ),
                            ],
                          },
                        ),
                      ],
                    }),
                  ],
                }),
                field("mobile", "Mobile Number", { verified: true }),
                field("email", "Email (optional)", { type: "email" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
                      children: "Aadhaar",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                      value: CITIZEN.aadhaarMasked,
                      disabled: true,
                      className: "mt-1 font-mono",
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "sm:col-span-2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
                      htmlFor: "address",
                      children: "Address",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
                      id: "address",
                      value: f.address,
                      onChange: (e) => up("address", e.target.value),
                      className: "mt-1",
                    }),
                    err("address"),
                  ],
                }),
              ],
            }),
          step === 1 &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "space-y-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "grid gap-4 sm:grid-cols-3",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
                          children: "Household ID",
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                          value: HOUSEHOLD.id,
                          disabled: true,
                          className: "mt-1 font-mono",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
                          children: "BPL status",
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                          value: HOUSEHOLD.bpl,
                          disabled: true,
                          className: "mt-1",
                        }),
                      ],
                    }),
                    field("dependents", "Number of dependents", {
                      type: "number",
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "overflow-x-auto rounded-md border",
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "table",
                    {
                      className: "w-full text-sm",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
                          className: "bg-muted/50 text-left text-xs",
                          children: /* @__PURE__ */ (0,
                          import_jsx_runtime.jsxs)("tr", {
                            children: [
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "th",
                                {
                                  className: "p-2",
                                  children: "Member",
                                },
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "th",
                                {
                                  className: "p-2",
                                  children: "Relationship",
                                },
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "th",
                                {
                                  className: "p-2",
                                  children: "Date of birth",
                                },
                              ),
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                "th",
                                {
                                  className: "p-2",
                                  children: "Identity",
                                },
                              ),
                            ],
                          }),
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
                          children: active.map((m) =>
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                              "tr",
                              {
                                className: "border-t",
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "td",
                                    {
                                      className: "p-2",
                                      children: m.name,
                                    },
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "td",
                                    {
                                      className: "p-2",
                                      children: m.relationship,
                                    },
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "td",
                                    {
                                      className: "p-2",
                                      children: m.dob,
                                    },
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    "td",
                                    {
                                      className: "p-2",
                                      children: /* @__PURE__ */ (0,
                                      import_jsx_runtime.jsx)(Pill, {
                                        t:
                                          m.identity === "Verified"
                                            ? "ok"
                                            : "warn",
                                        children: m.identity,
                                      }),
                                    },
                                  ),
                                ],
                              },
                              m.id,
                            ),
                          ),
                        }),
                      ],
                    },
                  ),
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
                  className: "text-xs text-muted-foreground",
                  children: [
                    "Family details come from your verified household record. To change them, use ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                      to: "/citizen/family",
                      className: "text-gov underline",
                      children: "My Family",
                    }),
                    ".",
                  ],
                }),
              ],
            }),
          step === 2 &&
            (!needsIncome && !needsProperty
              ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                  className: "text-sm text-muted-foreground",
                  children:
                    "This scheme does not require income or property details. Continue to the next step.",
                })
              : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className: "grid gap-4 sm:grid-cols-2",
                  children: [
                    needsIncome &&
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        import_jsx_runtime.Fragment,
                        {
                          children: [
                            field("incomeSource", "Income source"),
                            field("income", "Annual household income (₹)", {
                              type: "number",
                            }),
                          ],
                        },
                      ),
                    needsProperty &&
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        import_jsx_runtime.Fragment,
                        {
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                              className: "sm:col-span-2",
                              children: field(
                                "land",
                                "Land / property information",
                              ),
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                              className: "sm:col-span-2",
                              children: field(
                                "assets",
                                "Relevant assets (vehicle, pucca house etc.)",
                              ),
                            }),
                          ],
                        },
                      ),
                  ],
                })),
          step === 3 &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              className: "space-y-4",
              children: s.questions.map((q) =>
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
                        htmlFor: q,
                        children: q,
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                        id: q,
                        value: f.answers[q] ?? "",
                        onChange: (e) =>
                          setF({
                            ...f,
                            answers: {
                              ...f.answers,
                              [q]: e.target.value,
                            },
                          }),
                        className: "mt-1",
                        "aria-invalid": !!errors[q],
                      }),
                      err(q),
                    ],
                  },
                  q,
                ),
              ),
            }),
          step === 4 &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
              className: "grid gap-4 md:grid-cols-2",
              children: s.documents.map((d) =>
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DocumentPicker,
                        {
                          session: state.session,
                          documents: libraryDocs,
                          docType: d,
                          required: true,
                          value: docs[d],
                          onChange: (v) =>
                            setDocs({
                              ...docs,
                              [d]: v,
                            }),
                          onUploaded: refreshLibrary,
                        },
                      ),
                      err(d),
                    ],
                  },
                  d,
                ),
              ),
            }),
          step === 5 &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "space-y-4",
              children: [
                reviewSection(0, [
                  ["Full name", f.name],
                  ["Date of birth", f.dob],
                  ["Gender", f.gender],
                  ["Mobile", f.mobile],
                  ["Email", f.email],
                  ["Address", f.address],
                ]),
                reviewSection(1, [
                  ["Household ID", HOUSEHOLD.id],
                  ["BPL status", HOUSEHOLD.bpl],
                  ["Members", String(active.length)],
                  ["Dependents", f.dependents],
                ]),
                (needsIncome || needsProperty) &&
                  reviewSection(2, [
                    ["Income source", f.incomeSource],
                    ["Annual income", f.income ? inr(Number(f.income)) : ""],
                    ["Land / property", f.land],
                    ["Assets", f.assets],
                  ]),
                reviewSection(
                  3,
                  s.questions.map((q) => [q, f.answers[q] ?? ""]),
                ),
                reviewSection(
                  4,
                  s.documents.map((d) => [
                    d,
                    docs[d]
                      ? `${docs[d].name} — ${docs[d].result}`
                      : "Not uploaded",
                  ]),
                ),
              ],
            }),
          step === 6 &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
              className: "space-y-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
                  className: "flex items-start gap-2 text-sm",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
                      checked: decl.consent,
                      onCheckedChange: (v) =>
                        setDecl({
                          ...decl,
                          consent: !!v,
                        }),
                      className: "mt-0.5",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      children:
                        "I consent to the department accessing my linked citizen, household, income and property records for verifying this application.",
                    }),
                  ],
                }),
                err("consent"),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
                  className: "flex items-start gap-2 text-sm",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
                      checked: decl.accurate,
                      onCheckedChange: (v) =>
                        setDecl({
                          ...decl,
                          accurate: !!v,
                        }),
                      className: "mt-0.5",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                      children:
                        "I declare that the information provided is true and correct to the best of my knowledge. I understand that false information may lead to rejection and recovery of benefits.",
                    }),
                  ],
                }),
                err("accurate"),
              ],
            }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "mt-6 flex justify-between border-t pt-4",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                variant: "outline",
                disabled: step === 0,
                onClick: () => setStep(step - 1),
                children: "Back",
              }),
              step < 6
                ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                    onClick: next,
                    children: "Save & Continue",
                  })
                : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                    onClick: submit,
                    children: "Submit Application",
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}
//#endregion
export { Apply as component };
