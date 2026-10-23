import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as nowStamp, M as useApp, a as CITIZEN, x as fmtDate } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { H as Paperclip } from "../_libs/lucide-react.mjs";
import { c as Pill, o as PageHeader, s as Panel, t as Empty } from "./ui-C30c-cKm.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.grievances-DqrjmeQ4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATS = [
	"Delay in processing",
	"Incorrect rejection / decision",
	"Document verification issue",
	"Family record error",
	"Benefit not received",
	"Other"
];
function Grievances() {
	const { state, set } = useApp();
	const apps = state.applications.filter((a) => a.householdId === CITIZEN.householdId && a.status !== "Draft");
	const [f, setF] = (0, import_react.useState)({
		appId: apps[0]?.id ?? "",
		category: CATS[0],
		description: ""
	});
	const [file, setFile] = (0, import_react.useState)();
	const [err, setErr] = (0, import_react.useState)("");
	const ref = (0, import_react.useRef)(null);
	const submit = (e) => {
		e.preventDefault();
		if (f.description.trim().length < 20) return setErr("Please describe the issue in at least 20 characters");
		setErr("");
		const id = `GRV-2026-${String(1183 + state.grievances.length).padStart(5, "0")}`;
		set((s) => ({ grievances: [{
			id,
			...f,
			file,
			date: nowStamp().slice(0, 10),
			status: "Received"
		}, ...s.grievances] }));
		toast.success("Grievance registered", { description: `Reference ${id}. Expected response within 7 working days.` });
		setF({
			...f,
			description: ""
		});
		setFile(void 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Raise & Track Grievance",
		desc: "Grievances are routed to the department responsible for the application."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Raise Grievance",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-4",
				noValidate: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Application ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: f.appId,
						onValueChange: (v) => setF({
							...f,
							appId: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [apps.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: a.id,
							children: a.id
						}, a.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "General",
							children: "Not related to an application"
						})] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Issue category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: f.category,
						onValueChange: (v) => setF({
							...f,
							category: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c,
							children: c
						}, c)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "desc",
							children: "Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "desc",
							rows: 5,
							value: f.description,
							onChange: (e) => setF({
								...f,
								description: e.target.value
							}),
							className: "mt-1",
							"aria-invalid": !!err
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: err
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supporting document (optional)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref,
							type: "file",
							accept: "application/pdf,image/*",
							className: "hidden",
							onChange: (e) => setFile(e.target.files?.[0]?.name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => ref.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "mr-1 h-3.5 w-3.5" }), file ? "Change file" : "Attach file"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm text-muted-foreground",
								children: file
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Submit"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Track Grievance",
			children: state.grievances.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: "No grievances raised" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: state.grievances.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: g.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								t: g.status === "Resolved" ? "ok" : g.status === "In Progress" ? "info" : "neutral",
								children: g.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: g.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: g.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								g.appId,
								" · ",
								fmtDate(g.date),
								g.file && ` · ${g.file}`
							]
						})
					]
				}, g.id))
			})
		})]
	})] });
}
//#endregion
export { Grievances as component };
