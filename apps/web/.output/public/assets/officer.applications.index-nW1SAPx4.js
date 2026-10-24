import { l as e } from "./button-KmRTh43o.js";
import { D as t, mn as n } from "./index-B8Y-_llO.js";
import { t as r } from "./OfficerAppTable-BIfO02yM.js";
var i = e(),
  a = () => {
    let { state: e } = n();
    return (0, i.jsxs)(`div`, {
      children: [
        (0, i.jsx)(t, {
          title: `Applications`,
          desc: `All submitted applications for your jurisdiction.`,
        }),
        (0, i.jsx)(r, {
          apps: e.applications.filter((e) => e.status !== `Draft`),
        }),
      ],
    });
  };
export { a as component };
