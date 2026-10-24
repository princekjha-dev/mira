import {
  v as lazyRouteComponent,
  y as createFileRoute,
} from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.apply._schemeId-BSxw4sXi.js
var $$splitComponentImporter = () =>
  import("./citizen.apply._schemeId-DKSIsuMp.mjs");
var Route = createFileRoute("/citizen/apply/$schemeId")({
  head: () => ({
    meta: [
      { title: "Apply for Scheme — Citizen" },
      {
        name: "description",
        content: "Multi-step scheme application with verified data prefilled.",
      },
      {
        property: "og:title",
        content: "Apply for Scheme",
      },
      {
        property: "og:description",
        content: "Guided scheme application.",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component"),
});
//#endregion
export { Route as t };
