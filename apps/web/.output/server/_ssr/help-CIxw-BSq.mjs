import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-CIxw-BSq.js
var $$splitComponentImporter = () => import("./help-BsIRRPlk.mjs");
var Route = createFileRoute("/help")({
	validateSearch: (search) => ({ q: typeof search.q === "string" ? search.q : void 0 }),
	head: () => ({ meta: [
		{ title: "Help & Support — Mira" },
		{
			name: "description",
			content: "Find answers, understand your applications, or get help with Mira services."
		},
		{
			property: "og:title",
			content: "Help & Support — Mira"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
