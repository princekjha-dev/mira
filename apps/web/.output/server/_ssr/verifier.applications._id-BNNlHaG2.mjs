import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.applications._id-BNNlHaG2.js
var $$splitComponentImporter = () => import("./verifier.applications._id-BiFODR8H.mjs");
var Route = createFileRoute("/verifier/applications/$id")({
	head: ({ params }) => ({ meta: [{ title: `Verify Application ${params.id} — Verifier Workstation` }, {
		name: "description",
		content: "Comprehensive determination workbench and document cross-verification."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
