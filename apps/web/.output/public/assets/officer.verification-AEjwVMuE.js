import { l as e } from "./button-KmRTh43o.js";
import { D as t, mn as n } from "./index-B8Y-_llO.js";
import { t as r } from "./OfficerAppTable-BIfO02yM.js";
var i = e(),
  a = () => {
    let { state: e } = n(),
      a = e.applications.filter((e) =>
        [
          `Verification Required`,
          `Documents Under Review`,
          `Officer Review`,
          `Submitted`,
          `Additional Evidence Required`,
        ].includes(e.status),
      );
    return (0, i.jsxs)(`div`, {
      children: [
        (0, i.jsx)(t, {
          title: `Verification Queue`,
          desc: `Flagged items need your review. Nothing in this queue has been rejected automatically.`,
        }),
        (0, i.jsx)(r, { apps: a }),
      ],
    });
  };
export { a as component };
