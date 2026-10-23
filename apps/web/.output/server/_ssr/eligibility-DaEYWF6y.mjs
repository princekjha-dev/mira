import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/eligibility-DaEYWF6y.js
var $$splitComponentImporter = () => import("./eligibility-eqme9l9s.mjs");
var Route = createFileRoute("/eligibility")({
	validateSearch: (s) => ({ scheme: typeof s.scheme === "string" ? s.scheme : void 0 }),
	head: () => ({ meta: [
		{ title: "Check your eligibility — Mira" },
		{
			name: "description",
			content: "Find schemes and benefits you may qualify for based on your household information."
		},
		{
			property: "og:title",
			content: "Check your eligibility — Mira"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
