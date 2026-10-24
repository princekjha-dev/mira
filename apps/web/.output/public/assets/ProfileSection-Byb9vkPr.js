import { l as e, r as t, u as n } from "./button-KmRTh43o.js";
import { an as r } from "./index-B8Y-_llO.js";
n();
var i = e();
function a({
  icon: e,
  title: n,
  description: a,
  value: o,
  action: s,
  onClick: c,
  isLast: l = !1,
  destructive: u = !1,
}) {
  let d = !!c;
  return (0, i.jsxs)(`div`, {
    onClick: c,
    role: d ? `button` : void 0,
    tabIndex: d ? 0 : void 0,
    onKeyDown: (e) => {
      d && (e.key === `Enter` || e.key === ` `) && (e.preventDefault(), c());
    },
    className: t(
      `flex items-center justify-between gap-4 px-4 py-3 text-xs transition-colors`,
      !l && `border-b border-slate-100 dark:border-slate-800/70`,
      d &&
        `hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer select-none`,
      u && `text-rose-600 dark:text-rose-400`,
    ),
    children: [
      (0, i.jsxs)(`div`, {
        className: `flex items-center gap-3 min-w-0`,
        children: [
          e &&
            (0, i.jsx)(`div`, {
              className: t(
                `flex h-7 w-7 items-center justify-center rounded-lg shrink-0`,
                u
                  ? `bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400`
                  : `bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`,
              ),
              children: (0, i.jsx)(e, { className: `h-3.5 w-3.5` }),
            }),
          (0, i.jsxs)(`div`, {
            className: `min-w-0`,
            children: [
              (0, i.jsx)(`p`, {
                className: t(
                  `font-medium truncate`,
                  u
                    ? `text-rose-600 dark:text-rose-400 font-semibold`
                    : `text-slate-900 dark:text-slate-100`,
                ),
                children: n,
              }),
              a &&
                (0, i.jsx)(`p`, {
                  className: `text-[11px] text-muted-foreground truncate leading-tight mt-0.5`,
                  children: a,
                }),
            ],
          }),
        ],
      }),
      (0, i.jsxs)(`div`, {
        className: `flex items-center gap-2 shrink-0`,
        children: [
          o &&
            (0, i.jsx)(`span`, {
              className: `text-xs text-slate-600 dark:text-slate-400 font-medium`,
              children: o,
            }),
          s,
          d &&
            !s &&
            (0, i.jsx)(r, {
              className: `h-4 w-4 text-slate-300 dark:text-slate-600`,
            }),
        ],
      }),
    ],
  });
}
function o({ title: e, description: n, children: r, className: a }) {
  return (0, i.jsxs)(`div`, {
    className: t(`space-y-1.5`, a),
    children: [
      e &&
        (0, i.jsxs)(`div`, {
          className: `px-1 space-y-0.5`,
          children: [
            (0, i.jsx)(`h3`, {
              className: `text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono`,
              children: e,
            }),
            n &&
              (0, i.jsx)(`p`, {
                className: `text-[11px] text-muted-foreground`,
                children: n,
              }),
          ],
        }),
      (0, i.jsx)(`div`, {
        className: `rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/70`,
        children: r,
      }),
    ],
  });
}
export { a as n, o as t };
