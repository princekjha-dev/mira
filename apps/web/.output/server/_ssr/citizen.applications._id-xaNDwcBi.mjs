import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.applications._id-xaNDwcBi.js
var $$splitComponentImporter = () => import("./citizen.applications._id-Cdlq2xBb.mjs");
var Route = createFileRoute("/citizen/applications/$id")({
	head: ({ params }) => ({ meta: [
		{ title: `Application ${params.id}` },
		{
			name: "description",
			content: "Application details, timeline and actions."
		},
		{
			property: "og:title",
			content: `Application ${params.id}`
		},
		{
			property: "og:description",
			content: "Application status and timeline."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
