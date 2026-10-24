import {
  c as e,
  f as t,
  l as n,
  r,
  t as i,
  u as a,
} from "./button-KmRTh43o.js";
import {
  D as o,
  Nn as s,
  Rn as c,
  S as l,
  Tt as u,
  _ as d,
  b as f,
  mn as p,
  y as m,
} from "./index-B8Y-_llO.js";
var h = e(`check-check`, [
    [`path`, { d: `M18 6 7 17l-5-5`, key: `116fxf` }],
    [`path`, { d: `m22 10-7.5 7.5L13 16`, key: `ke71qq` }],
  ]),
  g = t(a()),
  _ = n();
function v() {
  let { state: e, set: t } = p(),
    n = c(),
    [a, v] = (0, g.useState)(`all`),
    y = e.notifications.filter(
      (e) => a === `all` || (a === `unread` ? !e.read : e.read),
    ),
    b = (e, n) =>
      t((t) => ({
        notifications: t.notifications.map((t) =>
          t.id === e ? { ...t, read: n } : t,
        ),
      }));
  return (0, _.jsxs)(`div`, {
    children: [
      (0, _.jsx)(o, {
        title: `Notifications`,
        actions: (0, _.jsxs)(i, {
          variant: `outline`,
          onClick: () => {
            (t((e) => ({
              notifications: e.notifications.map((e) => ({ ...e, read: !0 })),
            })),
              u.success(`All marked as read`));
          },
          children: [
            (0, _.jsx)(h, { className: `mr-1 h-4 w-4` }),
            `Mark all as read`,
          ],
        }),
      }),
      (0, _.jsx)(d, {
        value: a,
        onValueChange: v,
        className: `mb-4`,
        children: (0, _.jsxs)(m, {
          children: [
            (0, _.jsx)(f, { value: `all`, children: `All` }),
            (0, _.jsxs)(f, {
              value: `unread`,
              children: [
                `Unread (`,
                e.notifications.filter((e) => !e.read).length,
                `)`,
              ],
            }),
            (0, _.jsx)(f, { value: `read`, children: `Read` }),
          ],
        }),
      }),
      y.length === 0
        ? (0, _.jsx)(l, {
            title: `You're all caught up`,
            body: `No notifications in this view.`,
          })
        : (0, _.jsx)(`ul`, {
            className: `divide-y rounded-lg border bg-card`,
            children: y.map((e) =>
              (0, _.jsxs)(
                `li`,
                {
                  className: r(`flex gap-3 p-4`, !e.read && `bg-secondary/40`),
                  children: [
                    (0, _.jsx)(`span`, {
                      className: r(
                        `mt-1.5 h-2 w-2 shrink-0 rounded-full`,
                        e.read ? `bg-transparent` : `bg-gov`,
                      ),
                      "aria-label": e.read ? `Read` : `Unread`,
                    }),
                    (0, _.jsxs)(`div`, {
                      className: `min-w-0 flex-1`,
                      children: [
                        (0, _.jsx)(`p`, {
                          className: r(`text-sm`, !e.read && `font-semibold`),
                          children: e.title,
                        }),
                        (0, _.jsx)(`p`, {
                          className: `text-sm text-muted-foreground`,
                          children: e.body,
                        }),
                        (0, _.jsx)(`p`, {
                          className: `mt-1 text-xs text-muted-foreground`,
                          children: s(e.date),
                        }),
                        (0, _.jsxs)(`div`, {
                          className: `mt-2 flex gap-2`,
                          children: [
                            e.link &&
                              (0, _.jsx)(i, {
                                size: `sm`,
                                variant: `outline`,
                                onClick: () => {
                                  (b(e.id, !0), n({ to: e.link }));
                                },
                                children: `Open`,
                              }),
                            (0, _.jsxs)(i, {
                              size: `sm`,
                              variant: `ghost`,
                              onClick: () => b(e.id, !e.read),
                              children: [
                                `Mark as `,
                                e.read ? `unread` : `read`,
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                e.id,
              ),
            ),
          }),
    ],
  });
}
export { v as component };
