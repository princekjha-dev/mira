import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.citizens._id-V3PEP6az.js
var $$splitComponentImporter = () => import("./officer.citizens._id-DuFqyST8.mjs");
var Route = createFileRoute("/officer/citizens/$id")({
	head: ({ params }) => ({ meta: [
		{ title: `Citizen ${params.id} — Officer` },
		{
			name: "description",
			content: "Citizen record view for authorised officers."
		},
		{
			property: "og:title",
			content: `Citizen ${params.id}`
		},
		{
			property: "og:description",
			content: "Citizen record."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
