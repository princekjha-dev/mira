import { f as e, u as t } from "./button-KmRTh43o.js";
import { n } from "./dist-oqSnxn6U.js";
var r = e(t(), 1),
  i = Object.defineProperty,
  a = (e, t) => i(e, `name`, { value: t, configurable: !0 }),
  o = r.useInsertionEffect;
function s(e) {
  let t = r.useRef(e);
  return (
    typeof o == `function`
      ? o(() => {
          t.current = e;
        })
      : n(() => {
          t.current = e;
        }),
    r.useMemo(
      () =>
        (...e) =>
          t.current?.(...e),
      [],
    )
  );
}
a(s, `useCallbackRef`);
export { s as t };
