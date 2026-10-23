import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.families._id-CpbghG9h.js
var $$splitComponentImporter = () => import("./officer.families._id-DP2iw5oY.mjs");
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
