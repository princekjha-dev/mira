import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.schemes._id-gpEOMPfH.js
var $$splitComponentImporter = () => import("./department.schemes._id-DwqDVqVf.mjs");
var Route = createFileRoute("/department/schemes/$id")({
	head: () => ({ meta: [
		{ title: "Configure Scheme — Department" },
		{
			name: "description",
			content: "Scheme eligibility basis, required documents and workflow."
		},
		{
			property: "og:title",
			content: "Configure Scheme"
		},
		{
			property: "og:description",
			content: "Scheme configuration."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
