import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.documents-BqtajKFo.js
var $$splitComponentImporter = () => import("./citizen.documents-XBFq9CMY.mjs");
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
