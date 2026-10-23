import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.applications._id-BEgNV6Y4.js
var $$splitComponentImporter = () => import("./officer.applications._id-1ER1LmH0.mjs");
var Route = createFileRoute("/officer/applications/$id")({
	head: ({ params }) => ({ meta: [
		{ title: `Review ${params.id} — Officer` },
		{
			name: "description",
			content: "Evidence-based application review."
		},
		{
			property: "og:title",
			content: `Review ${params.id}`
		},
		{
			property: "og:description",
			content: "Application review workspace."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
