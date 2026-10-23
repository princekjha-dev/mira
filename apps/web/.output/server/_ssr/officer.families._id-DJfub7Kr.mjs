import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.families._id-DJfub7Kr.js
var $$splitComponentImporter = () => import("./officer.families._id-D-HsscjS.mjs");
var Route = createFileRoute("/officer/families/$id")({
	head: ({ params }) => ({ meta: [
		{ title: `Household ${params.id} — Officer` },
		{
			name: "description",
			content: "Household record, members, history and pending changes."
		},
		{
			property: "og:title",
			content: `Household ${params.id}`
		},
		{
			property: "og:description",
			content: "Household record."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
