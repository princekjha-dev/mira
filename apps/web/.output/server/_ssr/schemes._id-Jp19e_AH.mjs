import { C as getScheme } from "./button-B0ZnFkgi.mjs";
import { _ as lazyRouteComponent, q as notFound, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemes._id-Jp19e_AH.js
var $$splitComponentImporter = () => import("./schemes._id-CIArXnVM.mjs");
var Route = createFileRoute("/schemes/$id")({
	loader: ({ params }) => {
		const s = getScheme(params.id);
		if (!s) throw notFound();
		return s;
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.name} — Scheme details` },
		{
			name: "description",
			content: loaderData.description
		},
		{
			property: "og:title",
			content: loaderData.name
		},
		{
			property: "og:description",
			content: loaderData.description
		}
	] : [{ title: "Scheme unavailable" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
