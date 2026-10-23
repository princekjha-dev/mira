import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.applications._id-CrY_vklN.js
var $$splitComponentImporter = () => import("./officer.applications._id-DXO3MNf3.mjs");
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
