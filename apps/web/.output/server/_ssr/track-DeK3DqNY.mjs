import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-DeK3DqNY.js
var $$splitComponentImporter = () => import("./track-DgYh6s-N.mjs");
var Route = createFileRoute("/track")({
	validateSearch: (search) => ({ id: typeof search.id === "string" ? search.id : void 0 }),
	head: () => ({ meta: [
		{ title: "Track your application — Mira" },
		{
			name: "description",
			content: "See the current status of your welfare applications and what happens next."
		},
		{
			property: "og:title",
			content: "Track your application — Mira"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
