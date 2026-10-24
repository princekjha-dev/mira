import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import {
  X as Navigation,
  pn as CircleCheck,
  rt as MapPin,
  xn as Camera,
} from "../_libs/lucide-react.mjs";
import { t as Switch } from "./switch-CsJp6lIU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import {
  n as ProfileSection,
  t as ProfileRow,
} from "./ProfileSection-Db5W_g4I.mjs";
import { t as ProfilePage } from "./ProfilePage-BVIQGx5Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.settings-ThkLXqCR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OfficerProfileRoute() {
  const [offlineRoute, setOfflineRoute] = (0, import_react.useState)(true);
  const [highPrecisionGps, setHighPrecisionGps] = (0, import_react.useState)(
    true,
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, {
    roleSpecificSection: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      ProfileSection,
      {
        title: "Field Operations & Geotagging",
        description:
          "GPS inspection parameters and offline cluster route synchronization",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
            icon: Navigation,
            title: "Daily Inspection Route Sync",
            description:
              "Pre-fetches cluster route maps and household files for disconnected rural zones",
            action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
              checked: offlineRoute,
              onCheckedChange: (val) => {
                setOfflineRoute(val);
                toast.success(
                  val
                    ? "Offline route sync enabled"
                    : "Offline route sync disabled",
                );
              },
            }),
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
            icon: MapPin,
            title: "High-Precision Differential GPS",
            description:
              "Enforces sub-meter geotagging accuracy for dwelling inspection photographs",
            action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
              checked: highPrecisionGps,
              onCheckedChange: (val) => {
                setHighPrecisionGps(val);
                toast.success(
                  val
                    ? "Sub-meter GNSS enabled"
                    : "Standard cellular GPS fallback active",
                );
              },
            }),
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
            icon: Camera,
            title: "Biometric & Presence Confirmation",
            description:
              "UIDAI RD Service facial recognition driver on field tablet",
            value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
              className:
                "inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
                  className: "h-3 w-3",
                }),
                "Driver Active (L1 Biometric)",
              ],
            }),
            action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
              variant: "outline",
              size: "sm",
              onClick: () =>
                toast.success("Biometric test scan successful (Demo)"),
              className: "h-7 text-xs ml-2",
              children: "Test RD",
            }),
            isLast: true,
          }),
        ],
      },
    ),
  });
}
//#endregion
export { OfficerProfileRoute as component };
