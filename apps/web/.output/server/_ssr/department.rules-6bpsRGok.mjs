import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.rules-6bpsRGok.js
var $$splitComponentImporter = () => import("./department.rules-rjN9_aZD.mjs");
var Route = createFileRoute("/department/rules")({
	validateSearch: (s) => ({ scheme: typeof s.scheme === "string" ? s.scheme : void 0 }),
	head: () => ({ meta: [
		{ title: "Eligibility Rules — Department" },
		{
			name: "description",
			content: "Visual, versioned eligibility rule builder."
		},
		{
			property: "og:title",
			content: "Eligibility Rules"
		},
		{
			property: "og:description",
			content: "Scheme rule builder."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
