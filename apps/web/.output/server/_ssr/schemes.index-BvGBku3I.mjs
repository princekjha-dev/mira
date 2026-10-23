import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemes.index-BvGBku3I.js
var $$splitComponentImporter = () => import("./schemes.index-Bt45NH6D.mjs");
var Route = createFileRoute("/schemes/")({
	validateSearch: (s) => ({
		q: typeof s.q === "string" ? s.q : void 0,
		category: typeof s.category === "string" ? s.category : void 0
	}),
	head: () => ({ meta: [
		{ title: "Find Government Schemes — Unified Public Documentation" },
		{
			name: "description",
			content: "Search welfare schemes by category, income, BPL status, state, age and household criteria."
		},
		{
			property: "og:title",
			content: "Find Government Schemes"
		},
		{
			property: "og:description",
			content: "Search and filter welfare schemes with clear eligibility summaries."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
