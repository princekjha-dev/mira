import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.documents-D83DG79G.js
var $$splitComponentImporter = () => import("./citizen.documents-CmXGBmxN.mjs");
var Route = createFileRoute("/citizen/documents")({
	head: () => ({ meta: [{ title: "My Documents — Mira" }, {
		name: "description",
		content: "Securely manage your documents for applications and public services."
	}] }),
	validateSearch: (search) => ({ upload: search.upload === true || search.upload === "1" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
