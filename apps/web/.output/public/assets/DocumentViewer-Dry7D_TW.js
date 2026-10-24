import { c as e, f as t, l as n, t as r, u as i } from "./button-KmRTh43o.js";
import { t as a } from "./download-DTWQ6dGd.js";
import { t as o } from "./file-image-DmYJC7lr.js";
import { t as s } from "./file-up-CoMCr36d.js";
import { t as c } from "./plus-C-ekZNzZ.js";
import {
  $ as ee,
  Et as te,
  Jt as l,
  Lt as u,
  Mt as d,
  Sn as f,
  Tt as p,
  Ut as m,
  X as h,
  Y as g,
  en as _,
  et as v,
  gn as y,
  hn as b,
  jt as x,
  nn as S,
  sn as C,
} from "./index-B8Y-_llO.js";
import {
  a as w,
  c as T,
  i as E,
  n as D,
  o as O,
  r as k,
  s as A,
  t as ne,
} from "./alert-dialog-Cx9o1s1e.js";
var re = e(`expand`, [
    [`path`, { d: `m15 15 6 6`, key: `1s409w` }],
    [`path`, { d: `m15 9 6-6`, key: `ko1vev` }],
    [`path`, { d: `M21 16v5h-5`, key: `1ck2sf` }],
    [`path`, { d: `M21 8V3h-5`, key: `1qoq8a` }],
    [`path`, { d: `M3 16v5h5`, key: `1t08am` }],
    [`path`, { d: `m3 21 6-6`, key: `wwnumi` }],
    [`path`, { d: `M3 8V3h5`, key: `1ln10m` }],
    [`path`, { d: `M9 9 3 3`, key: `v551iv` }],
  ]),
  j = e(`minus`, [[`path`, { d: `M5 12h14`, key: `1ays0h` }]]),
  M = t(i(), 1),
  N = {
    MAX_UPLOAD_SIZE: 26214400,
    IMAGE_COMPRESSION_THRESHOLD: 3145728,
    IMAGE_MAX_DIMENSION: 3600,
    IMAGE_QUALITY: 0.9,
    PDF_COMPRESSION_THRESHOLD: 8388608,
    MAX_FILES_PER_UPLOAD: 8,
    ALLOWED_MIME_TYPES: [
      `application/pdf`,
      `image/jpeg`,
      `image/png`,
      `image/webp`,
      `text/plain`,
      `text/csv`,
      `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
      `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
    ],
    ALLOWED_EXTENSIONS: [
      `pdf`,
      `png`,
      `jpg`,
      `jpeg`,
      `webp`,
      `txt`,
      `csv`,
      `docx`,
      `xlsx`,
    ],
  },
  P = [
    `Identity`,
    `Address`,
    `Income`,
    `BPL / Economic Status`,
    `Education`,
    `Birth`,
    `Marriage`,
    `Property`,
    `Land`,
    `Bank`,
    `Employment`,
    `Scheme-specific`,
    `Other`,
  ],
  F = {
    Identity: `IDENTITY_SUPPORTING_DOCUMENT`,
    Address: `RESIDENCE_CERTIFICATE`,
    Income: `INCOME_CERTIFICATE`,
    "BPL / Economic Status": `OTHER`,
    Education: `OTHER`,
    Birth: `BIRTH_CERTIFICATE`,
    Marriage: `OTHER`,
    Property: `PROPERTY_DOCUMENT`,
    Land: `PROPERTY_DOCUMENT`,
    Bank: `OTHER`,
    Employment: `OTHER`,
    "Scheme-specific": `BENEFIT_DOCUMENT`,
    Other: `OTHER`,
  };
function I(e) {
  return e < 1024
    ? `${e} B`
    : e < 1048576
      ? `${(e / 1024).toFixed(0)} KB`
      : `${(e / 1048576).toFixed(1)} MB`;
}
var L = n(),
  R = (e) => e.split(`.`).pop()?.toLowerCase() || ``;
async function z(e) {
  let t = R(e.name);
  if (!N.ALLOWED_EXTENSIONS.includes(t))
    throw Error(
      t === `svg`
        ? `SVG files aren't supported for citizen documents. Please upload a PDF or image document.`
        : `This file type isn't supported for document storage.`,
    );
  if (e.size <= 0) throw Error(`This file is empty. Choose another document.`);
  if (e.size > N.MAX_UPLOAD_SIZE && !e.type.startsWith(`image/`))
    throw Error(
      `This document is larger than ${I(N.MAX_UPLOAD_SIZE)}. Choose a smaller PDF to preserve its text and page structure.`,
    );
  let n = new Uint8Array(await e.slice(0, 16).arrayBuffer()),
    r = (...e) => e.every((e, t) => n[t] === e),
    i = !1;
  try {
    i =
      t === `pdf`
        ? r(37, 80, 68, 70, 45)
        : t === `png`
          ? r(137, 80, 78, 71, 13, 10, 26, 10)
          : t === `jpg` || t === `jpeg`
            ? r(255, 216, 255)
            : t === `webp`
              ? r(82, 73, 70, 70) &&
                String.fromCharCode(...n.slice(8, 12)) === `WEBP`
              : t === `docx` || t === `xlsx`
                ? r(80, 75, 3, 4)
                : t === `txt` || t === `csv`
                  ? new TextDecoder(`utf-8`, { fatal: !0 }).decode(n).length > 0
                  : !1;
  } catch {
    i = !1;
  }
  if (!i)
    throw Error(
      `This file could not be read as a supported document. Choose another file.`,
    );
  if (e.type && !N.ALLOWED_MIME_TYPES.includes(e.type))
    throw Error(`This file type isn't supported for document storage.`);
}
async function B(e) {
  if (e.size <= N.IMAGE_COMPRESSION_THRESHOLD) return { file: e, saved: 0 };
  let t = await createImageBitmap(e).catch(() => {
      throw Error(
        `Automatic image optimization couldn't read this image. Retry or choose another file.`,
      );
    }),
    n = Math.min(1, N.IMAGE_MAX_DIMENSION / Math.max(t.width, t.height)),
    r = document.createElement(`canvas`);
  ((r.width = Math.max(1, Math.round(t.width * n))),
    (r.height = Math.max(1, Math.round(t.height * n))));
  let i = r.getContext(`2d`);
  if (!i)
    throw (
      t.close(),
      Error(`Image optimization is unavailable in this browser.`)
    );
  ((i.fillStyle = `#fff`),
    i.fillRect(0, 0, r.width, r.height),
    i.drawImage(t, 0, 0, r.width, r.height),
    t.close());
  let a = e.type === `image/jpg` ? `image/jpeg` : e.type,
    o = await new Promise((e, t) =>
      r.toBlob(
        (n) =>
          n
            ? e(n)
            : t(
                Error(
                  `Image optimization failed. The original file is still available to retry.`,
                ),
              ),
        a,
        N.IMAGE_QUALITY,
      ),
    );
  return o.size >= e.size * 0.92
    ? { file: e, saved: 0 }
    : {
        file: new File([o], e.name, { type: a, lastModified: e.lastModified }),
        saved: e.size - o.size,
      };
}
function V(e) {
  return /401|unauthori[sz]ed|token|sign in/i.test(e)
    ? `Your secure session expired. Sign in again, then retry.`
    : /403|forbidden/i.test(e)
      ? `You don't have permission to store this document here.`
      : /413|exceeds maximum|larger than/i.test(e)
        ? `This file is larger than the storage limit. Choose a smaller document.`
        : /415|unsupported.*(media|format|type)/i.test(e)
          ? `This file type isn't supported for document storage.`
          : /400|422|validation/i.test(e)
            ? `Unable to upload this file. Check that it's a valid supported document and try again.`
            : /network|fetch|connection|interrupted/i.test(e)
              ? `Upload interrupted. Check your connection and retry.`
              : /storage|internal server|500|503/i.test(e)
                ? `Secure storage is temporarily unavailable. Retry in a moment.`
                : /corrupt|could not be read|signature|empty/i.test(e)
                  ? `This document couldn't be read. Choose a valid PDF or image file.`
                  : e;
}
function H({
  session: e,
  documentType: t,
  onUploaded: n,
  replaceId: i,
  onComplete: a,
  onCancel: c,
  beforeUpload: ee,
}) {
  let d = (0, M.useRef)(null),
    p = (0, M.useRef)(null),
    [h, g] = (0, M.useState)([]),
    [_, v] = (0, M.useState)(!1),
    [y, b] = (0, M.useState)(!1),
    [x, w] = (0, M.useState)(!1),
    [T, E] = (0, M.useState)(!1),
    D = y || x,
    O = (e, t) => g((n) => n.map((n) => (n.id === e ? { ...n, ...t } : n))),
    k = async (e) => {
      O(e.id, { state: `Validating`, error: void 0, errorTitle: void 0 });
      try {
        await z(e.source);
        let t = e.source,
          n = 0;
        if (
          t.type.startsWith(`image/`) &&
          t.size > N.IMAGE_COMPRESSION_THRESHOLD
        ) {
          O(e.id, { state: `Compressing` });
          try {
            let e = await B(t);
            ((t = e.file), (n = e.saved));
          } catch (e) {
            if (t.size > N.MAX_UPLOAD_SIZE) throw e;
          }
        }
        if (t.size > N.MAX_UPLOAD_SIZE)
          throw Error(
            `Optimized file is still larger than ${I(N.MAX_UPLOAD_SIZE)}. Choose a smaller image.`,
          );
        O(e.id, {
          file: t,
          saved: n,
          optimizedSize: t.size,
          state: `Selected`,
        });
      } catch (t) {
        let n = V(
          t instanceof Error ? t.message : `Unable to validate this file.`,
        );
        O(e.id, {
          state: /supported|SVG/i.test(n) ? `Unsupported` : `Failed`,
          errorTitle: /supported|SVG/i.test(n)
            ? `Unsupported file`
            : `Unable to prepare document`,
          error: n,
        });
      }
    },
    A = async (e, t = !1) => {
      let n = Array.from(e);
      if (!n.length) return;
      let r = Math.max(0, N.MAX_FILES_PER_UPLOAD - h.length + +!!t),
        a = n.slice(0, i ? 1 : r);
      if (!a.length) return;
      b(!0);
      let o = a.map((e) => ({
        id: crypto.randomUUID(),
        source: e,
        file: e,
        state: `Validating`,
        progress: 0,
      }));
      (g((e) => [...e, ...o]), await Promise.all(o.map(k)), b(!1));
    },
    ne = (e) => {
      if (e.target.files) {
        let t = !!p.current;
        if (p.current) {
          let e = p.current;
          ((p.current = null), g((t) => t.filter((t) => t.id !== e)));
        }
        A(e.target.files, t);
      } else p.current = null;
      e.target.value = ``;
    },
    re = (e) => {
      (e.preventDefault(),
        v(!1),
        !D && e.dataTransfer.files.length && A(e.dataTransfer.files));
    },
    j = (0, M.useMemo)(() => h.filter((e) => e.state === `Selected`), [h]),
    P = async () => {
      if (!j.length || D) return;
      (w(!0), E(!1));
      let r = await Promise.all(
        j.map(async (n) => {
          O(n.id, { state: `Uploading`, progress: 0 });
          try {
            let r = F[t] || t,
              a = await f(
                e,
                n.file,
                r,
                (e, t) => {
                  let r = t > 0 && e >= t;
                  O(n.id, {
                    state: r ? `Processing` : `Uploading`,
                    progress: r ? 100 : Math.min(99, Math.round((e / t) * 100)),
                  });
                },
                i,
                n.source,
              );
            return (
              O(n.id, {
                state: `Processing`,
                progress: 100,
                saved:
                  a.original_size_bytes > a.size_bytes
                    ? a.original_size_bytes - a.size_bytes
                    : n.saved,
                optimizedSize: a.size_bytes,
              }),
              a.status === `READY`
                ? (O(n.id, { state: `Uploaded` }), !0)
                : (O(n.id, {
                    state: `Failed`,
                    errorTitle: `Processing needs attention`,
                    error: `The file was stored, but processing returned ${a.status.toLowerCase()}. Retry from your document list.`,
                  }),
                  !1)
            );
          } catch (e) {
            let t = V(
              e instanceof Error
                ? e.message
                : `Upload failed. Retry this file.`,
            );
            return (
              O(n.id, {
                state: `Failed`,
                errorTitle: `Upload couldn't finish`,
                error: t,
              }),
              !1
            );
          }
        }),
      );
      if ((w(!1), r.some(Boolean)))
        try {
          (await n(), r.every(Boolean) && E(!0));
        } catch {
          g((e) =>
            e.map((e) =>
              e.state === `Uploaded`
                ? {
                    ...e,
                    errorTitle: `Upload saved`,
                    error: `The document was uploaded, but the list couldn't refresh. Close and retry refresh.`,
                  }
                : e,
            ),
          );
        }
    },
    H = (e) => {
      e.state === `Unsupported`
        ? ((p.current = e.id), d.current?.click())
        : k(e);
    },
    ie = (e) => g((t) => t.filter((t) => t.id !== e)),
    U = (e) => R(e.name).toUpperCase();
  return (0, L.jsxs)(`div`, {
    className: `flex min-h-0 flex-1 flex-col`,
    children: [
      (0, L.jsxs)(`div`, {
        className: `min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7`,
        children: [
          ee,
          (0, L.jsxs)(`div`, {
            role: `group`,
            tabIndex: 0,
            "aria-disabled": D,
            "aria-label": `Choose or drop documents to upload`,
            "aria-describedby": `document-upload-help`,
            onClick: (e) => {
              D || e.target.closest(`button`) || d.current?.click();
            },
            onKeyDown: (e) => {
              D ||
                e.target !== e.currentTarget ||
                ((e.key === `Enter` || e.key === ` `) &&
                  (e.preventDefault(), d.current?.click()));
            },
            onDragEnter: (e) => {
              (e.preventDefault(), v(!0));
            },
            onDragOver: (e) => {
              (e.preventDefault(), v(!0));
            },
            onDragLeave: (e) => {
              e.currentTarget.contains(e.relatedTarget) || v(!1);
            },
            onDrop: re,
            className: `group cursor-pointer rounded-lg border border-dashed px-5 py-7 text-center outline-none transition-[background-color,border-color,transform] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:py-9 ${_ ? `scale-[1.005] border-blue-500 bg-blue-50/80` : `border-slate-300 bg-stone-50/80 hover:border-slate-400 hover:bg-stone-50`}`,
            children: [
              (0, L.jsx)(`input`, {
                ref: d,
                type: `file`,
                className: `sr-only`,
                multiple: !i,
                accept: N.ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(`,`),
                onChange: ne,
                "aria-label": `Choose files`,
              }),
              (0, L.jsx)(`span`, {
                className: `mx-auto flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${_ ? `bg-blue-100 text-blue-700` : `bg-white text-slate-600 shadow-sm ring-1 ring-slate-200`}`,
                children: (0, L.jsx)(s, { className: `h-5 w-5` }),
              }),
              (0, L.jsx)(`p`, {
                className: `mt-3 text-sm font-semibold text-slate-900`,
                children: _ ? `Drop files to upload` : `Upload your documents`,
              }),
              (0, L.jsx)(`p`, {
                className: `mt-1 text-sm text-slate-500`,
                children: `Drag and drop files here`,
              }),
              (0, L.jsx)(`p`, {
                className: `my-2 text-xs text-slate-400`,
                children: `or`,
              }),
              (0, L.jsx)(r, {
                type: `button`,
                variant: `outline`,
                className: `h-9 border-slate-300 bg-white px-4 shadow-none`,
                onClick: (e) => {
                  (e.stopPropagation(), d.current?.click());
                },
                disabled: D,
                children: `Choose files`,
              }),
              (0, L.jsxs)(`p`, {
                id: `document-upload-help`,
                className: `mt-3 text-xs leading-5 text-slate-500`,
                children: [
                  `PDF, JPG, JPEG, PNG or WEBP · Maximum`,
                  ` `,
                  I(N.MAX_UPLOAD_SIZE),
                  ` per file`,
                ],
              }),
            ],
          }),
          h.length > 0 &&
            (0, L.jsxs)(`section`, {
              "aria-label": `Selected documents`,
              className: `space-y-2.5`,
              children: [
                (0, L.jsxs)(`div`, {
                  className: `flex items-center justify-between`,
                  children: [
                    (0, L.jsx)(`h3`, {
                      className: `text-sm font-semibold text-slate-900`,
                      children: `Files`,
                    }),
                    (0, L.jsxs)(`span`, {
                      className: `text-xs text-slate-500`,
                      children: [h.length, ` of `, N.MAX_FILES_PER_UPLOAD],
                    }),
                  ],
                }),
                (0, L.jsx)(`ul`, {
                  className: `space-y-2`,
                  "aria-live": `polite`,
                  children: h.map((e) =>
                    (0, L.jsxs)(
                      `li`,
                      {
                        className: `flex min-w-0 items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors ${e.state === `Failed` || e.state === `Unsupported` ? `border-amber-200 bg-amber-50/50` : `border-slate-200 bg-white`}`,
                        children: [
                          (0, L.jsx)(`span`, {
                            className: `mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-100 text-slate-600`,
                            children: e.source.type.startsWith(`image/`)
                              ? (0, L.jsx)(o, { className: `h-4 w-4` })
                              : (0, L.jsx)(l, { className: `h-4 w-4` }),
                          }),
                          (0, L.jsxs)(`div`, {
                            className: `min-w-0 flex-1`,
                            children: [
                              (0, L.jsx)(`p`, {
                                className: `break-all text-sm font-medium leading-5 text-slate-900`,
                                children: e.source.name,
                              }),
                              (0, L.jsxs)(`p`, {
                                className: `mt-0.5 text-xs text-slate-500`,
                                children: [
                                  U(e.source),
                                  ` ·`,
                                  ` `,
                                  I(e.source.size),
                                  e.saved
                                    ? ` · Optimized to ${I(e.optimizedSize || e.file.size)} (saved ${Math.round((e.saved / e.source.size) * 100)}%)`
                                    : ``,
                                ],
                              }),
                              (0, L.jsxs)(`div`, {
                                className: `mt-1.5 flex items-center gap-1.5 text-xs`,
                                role: e.error ? `alert` : `status`,
                                children: [
                                  e.state === `Selected` &&
                                    (0, L.jsxs)(L.Fragment, {
                                      children: [
                                        (0, L.jsx)(C, {
                                          className: `h-3.5 w-3.5 text-teal-700`,
                                        }),
                                        (0, L.jsx)(`span`, {
                                          className: `text-slate-700`,
                                          children: `Selected · Ready to upload`,
                                        }),
                                      ],
                                    }),
                                  e.state === `Validating` &&
                                    (0, L.jsxs)(L.Fragment, {
                                      children: [
                                        (0, L.jsx)(m, {
                                          className: `h-3.5 w-3.5 animate-spin text-slate-500`,
                                        }),
                                        (0, L.jsx)(`span`, {
                                          className: `text-slate-600`,
                                          children: `Checking document…`,
                                        }),
                                      ],
                                    }),
                                  e.state === `Compressing` &&
                                    (0, L.jsxs)(L.Fragment, {
                                      children: [
                                        (0, L.jsx)(m, {
                                          className: `h-3.5 w-3.5 animate-spin text-slate-500`,
                                        }),
                                        (0, L.jsx)(`span`, {
                                          className: `text-slate-600`,
                                          children: `Optimizing document…`,
                                        }),
                                      ],
                                    }),
                                  e.state === `Uploading` &&
                                    (0, L.jsxs)(L.Fragment, {
                                      children: [
                                        (0, L.jsx)(m, {
                                          className: `h-3.5 w-3.5 animate-spin text-blue-700`,
                                        }),
                                        (0, L.jsxs)(`span`, {
                                          className: `text-slate-700`,
                                          children: [
                                            `Uploading · `,
                                            e.progress,
                                            `%`,
                                          ],
                                        }),
                                      ],
                                    }),
                                  e.state === `Processing` &&
                                    (0, L.jsxs)(L.Fragment, {
                                      children: [
                                        (0, L.jsx)(m, {
                                          className: `h-3.5 w-3.5 animate-spin text-slate-500`,
                                        }),
                                        (0, L.jsx)(`span`, {
                                          className: `text-slate-600`,
                                          children:
                                            e.source.type ===
                                              `application/pdf` &&
                                            e.source.size >
                                              N.PDF_COMPRESSION_THRESHOLD
                                              ? `Optimizing PDF and processing document…`
                                              : `Processing document…`,
                                        }),
                                      ],
                                    }),
                                  e.state === `Uploaded` &&
                                    (0, L.jsxs)(L.Fragment, {
                                      children: [
                                        (0, L.jsx)(S, {
                                          className: `h-3.5 w-3.5 text-teal-700`,
                                        }),
                                        (0, L.jsx)(`span`, {
                                          className: `font-medium text-teal-800`,
                                          children: `Uploaded · Verification may still be pending`,
                                        }),
                                      ],
                                    }),
                                  (e.state === `Failed` ||
                                    e.state === `Unsupported`) &&
                                    (0, L.jsxs)(L.Fragment, {
                                      children: [
                                        (0, L.jsx)(`span`, {
                                          className: `font-medium text-amber-900`,
                                          children: e.errorTitle,
                                        }),
                                        (0, L.jsxs)(`span`, {
                                          className: `text-amber-900`,
                                          children: [`— `, e.error],
                                        }),
                                      ],
                                    }),
                                ],
                              }),
                              (e.state === `Uploading` ||
                                e.state === `Processing`) &&
                                (0, L.jsx)(`div`, {
                                  className: `mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100`,
                                  role: `progressbar`,
                                  "aria-label": `Uploading ${e.source.name}`,
                                  "aria-valuemin": 0,
                                  "aria-valuemax": 100,
                                  "aria-valuenow": e.progress,
                                  children: (0, L.jsx)(`div`, {
                                    className: `h-full bg-blue-600 transition-[width]`,
                                    style: { width: `${e.progress}%` },
                                  }),
                                }),
                            ],
                          }),
                          (0, L.jsxs)(`div`, {
                            className: `flex shrink-0 items-center gap-1`,
                            children: [
                              (e.state === `Failed` ||
                                e.state === `Unsupported`) &&
                                (0, L.jsx)(r, {
                                  type: `button`,
                                  variant: `ghost`,
                                  size: `icon`,
                                  className: `h-8 w-8`,
                                  "aria-label": `${e.state === `Unsupported` ? `Choose another file instead of` : `Retry`} ${e.source.name}`,
                                  onClick: () => H(e),
                                  children:
                                    e.state === `Unsupported`
                                      ? (0, L.jsx)(s, { className: `h-4 w-4` })
                                      : (0, L.jsx)(u, { className: `h-4 w-4` }),
                                }),
                              !D &&
                                e.state !== `Uploaded` &&
                                (0, L.jsx)(r, {
                                  type: `button`,
                                  variant: `ghost`,
                                  size: `icon`,
                                  className: `h-8 w-8 text-slate-500 hover:text-slate-900`,
                                  "aria-label": `Remove ${e.source.name}`,
                                  onClick: () => ie(e.id),
                                  children: (0, L.jsx)(te, {
                                    className: `h-4 w-4`,
                                  }),
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
            }),
          T &&
            (0, L.jsxs)(`div`, {
              className: `rounded-lg border border-teal-200 bg-teal-50 p-3.5`,
              role: `status`,
              children: [
                (0, L.jsxs)(`p`, {
                  className: `flex items-center gap-2 text-sm font-semibold text-teal-900`,
                  children: [
                    (0, L.jsx)(S, { className: `h-4 w-4` }),
                    `Documents uploaded`,
                  ],
                }),
                (0, L.jsx)(`p`, {
                  className: `mt-1 text-sm text-teal-800`,
                  children: `Your documents are now available in My Documents.`,
                }),
              ],
            }),
        ],
      }),
      (0, L.jsxs)(`footer`, {
        className: `flex shrink-0 flex-col-reverse gap-3 border-t bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7`,
        children: [
          (0, L.jsxs)(`p`, {
            className: `text-xs text-slate-500`,
            "aria-live": `polite`,
            children: [
              h.length
                ? `${h.length} file${h.length === 1 ? `` : `s`} selected`
                : `Choose files to begin`,
              h.some((e) => e.state === `Failed` || e.state === `Unsupported`)
                ? ` · ${h.filter((e) => e.state === `Failed` || e.state === `Unsupported`).length} need attention`
                : ``,
            ],
          }),
          (0, L.jsx)(`div`, {
            className: `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`,
            children: T
              ? (0, L.jsx)(r, { type: `button`, onClick: a, children: `Done` })
              : (0, L.jsxs)(L.Fragment, {
                  children: [
                    (0, L.jsx)(r, {
                      type: `button`,
                      variant: `outline`,
                      className: `border-slate-300`,
                      onClick: c ?? a,
                      disabled: D,
                      children: `Cancel`,
                    }),
                    (0, L.jsx)(r, {
                      type: `button`,
                      onClick: () => void P(),
                      disabled: !j.length || D,
                      className: `min-w-40`,
                      children: x
                        ? (0, L.jsxs)(L.Fragment, {
                            children: [
                              (0, L.jsx)(m, {
                                className: `mr-2 h-4 w-4 animate-spin`,
                              }),
                              `Uploading…`,
                            ],
                          })
                        : `Upload documents`,
                    }),
                  ],
                }),
          }),
        ],
      }),
    ],
  });
}
var ie = (e) =>
  e.expires_at && new Date(e.expires_at) < new Date()
    ? `Expired`
    : {
        VERIFIED: `Verified`,
        ACTION_REQUIRED: `Review required`,
        MISMATCH: `Mismatch detected`,
        EXPIRED: `Expired`,
        REJECTED: `Rejected`,
        MANUAL_REVIEW: `Manual review`,
        PENDING_REVIEW: `Pending review`,
      }[e.verification_status] || `Pending review`;
function U({ document: e, session: t, onClose: n, onChanged: i }) {
  let [o, s] = (0, M.useState)(``),
    [u, f] = (0, M.useState)(``),
    [m, C] = (0, M.useState)([]),
    [N, P] = (0, M.useState)([]),
    [F, R] = (0, M.useState)([]),
    [z, B] = (0, M.useState)(1),
    [V, U] = (0, M.useState)(null),
    [W, ae] = (0, M.useState)(100),
    [oe, se] = (0, M.useState)(!1),
    [ce, G] = (0, M.useState)(!1),
    [K, le] = (0, M.useState)(!1),
    ue = (0, M.useRef)(null),
    de = !!e?.detected_mime_type.startsWith(`image/`),
    q = e?.detected_mime_type === `application/pdf`,
    J = de || q,
    Y =
      t.role === `verifier` ||
      t.role === `officer` ||
      t.role === `admin` ||
      t.role === `supervisor` ||
      t.role === `scheme_officer` ||
      t.role === `VERIFICATION_OFFICER` ||
      t.role === `SCHEME_OFFICER` ||
      t.role === `SUPERVISOR` ||
      t.role === `DEPARTMENT_ADMIN`,
    X = Y ? `APPLICATION_VERIFICATION` : `CITIZEN_SELF_SERVICE`;
  if (
    ((0, M.useEffect)(() => {
      if (!e || !t.apiToken) return;
      let n = !0;
      return (
        s(``),
        f(``),
        B(1),
        U(null),
        J &&
          fetch(y(`/api/v1/documents/${e.id}/preview?purpose=${X}`), {
            headers: { Authorization: `Bearer ${t.apiToken}` },
          })
            .then(async (e) => {
              if (!e.ok)
                throw Error(
                  `The protected preview could not be loaded. Try downloading the file.`,
                );
              let t = await e.blob();
              if (q) {
                let e = await t.arrayBuffer(),
                  r =
                    new TextDecoder(`latin1`)
                      .decode(e)
                      .match(/\/Type\s*\/Page\b/g)?.length ?? null;
                n && U(r || null);
              }
              let r = URL.createObjectURL(t);
              n ? s(r) : URL.revokeObjectURL(r);
            })
            .catch(
              (e) =>
                n && f(e instanceof Error ? e.message : `Preview unavailable.`),
            ),
        b(t, `/api/v1/documents/${e.id}/versions`)
          .then((e) => n && C(e.data))
          .catch(() => n && C([e])),
        b(t, `/api/v1/documents/${e.id}/applications`)
          .then((e) => n && P(e.data))
          .catch(() => n && P([])),
        b(t, `/api/v1/documents/${e.id}/extractions`)
          .then((e) => n && R(e.data))
          .catch(() => n && R([])),
        () => {
          n = !1;
        }
      );
    }, [e?.id, t.apiToken, X]),
    (0, M.useEffect)(
      () => () => {
        o && URL.revokeObjectURL(o);
      },
      [o],
    ),
    !e)
  )
    return null;
  let Z = async () => {
      try {
        let n = await fetch(
          y(`/api/v1/documents/${e.id}/download?purpose=${X}`),
          { headers: { Authorization: `Bearer ${t.apiToken}` } },
        );
        if (!n.ok) throw Error(`Download unavailable. Try again.`);
        let r = await n.blob(),
          i = URL.createObjectURL(r),
          a = window.document.createElement(`a`);
        ((a.href = i),
          (a.download = e.original_filename),
          a.click(),
          window.setTimeout(() => URL.revokeObjectURL(i), 1e3));
      } catch (e) {
        p.error(e instanceof Error ? e.message : `Download failed.`);
      }
    },
    fe = async () => {
      try {
        (await b(t, `/api/v1/documents/${e.id}`, { method: `DELETE` }),
          p.success(`Document archived. Its audit history is preserved.`),
          G(!1),
          i(),
          n());
      } catch (e) {
        p.error(e instanceof Error ? e.message : `Unable to archive document.`);
      }
    },
    Q = async (n) => {
      le(!0);
      try {
        (await b(t, `/api/v1/documents/${e.id}/verify`, {
          method: `POST`,
          body: JSON.stringify({
            status: n,
            notes:
              n === `VERIFIED`
                ? `Verified by officer ${t.name}`
                : n === `ACTION_REQUIRED`
                  ? `Officer ${t.name} flagged data mismatch / action required`
                  : `Rejected by officer ${t.name}`,
          }),
        }),
          p.success(`Document marked as ${n}`),
          i());
      } catch (e) {
        p.error(e instanceof Error ? e.message : `Verification update failed.`);
      } finally {
        le(!1);
      }
    },
    $ = ie(e),
    pe = new Date(e.created_at).toLocaleDateString(`en-IN`, {
      day: `numeric`,
      month: `short`,
      year: `numeric`,
    }),
    me =
      e.verification_status === `ACTION_REQUIRED` ||
      e.verification_status === `MISMATCH` ||
      F.some((e) => e.status === `CONFLICTING` || e.status === `REJECTED`);
  return (0, L.jsxs)(L.Fragment, {
    children: [
      (0, L.jsx)(g, {
        open: !!e,
        onOpenChange: (e) => !e && n(),
        children: (0, L.jsx)(h, {
          className: `h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[1440px] overflow-hidden p-0 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:rounded-2xl`,
          children: (0, L.jsxs)(`div`, {
            className: `grid h-full min-h-0 grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,1fr)_370px] lg:grid-rows-1`,
            children: [
              (0, L.jsxs)(`div`, {
                className: `flex min-h-0 flex-col bg-stone-100`,
                children: [
                  (0, L.jsxs)(ee, {
                    className: `flex flex-row items-center justify-between border-b bg-white px-4 py-3 text-left sm:px-5`,
                    children: [
                      (0, L.jsx)(v, {
                        className: `min-w-0 truncate text-sm font-medium`,
                        children: e.original_filename,
                      }),
                      (0, L.jsxs)(`div`, {
                        className: `flex shrink-0 items-center gap-1`,
                        children: [
                          q &&
                            (0, L.jsxs)(L.Fragment, {
                              children: [
                                (0, L.jsx)(r, {
                                  variant: `ghost`,
                                  size: `icon`,
                                  "aria-label": `Previous page`,
                                  disabled: z <= 1,
                                  onClick: () => B((e) => Math.max(1, e - 1)),
                                  children: `‹`,
                                }),
                                (0, L.jsxs)(`span`, {
                                  className: `px-1 text-xs tabular-nums`,
                                  children: [z, V ? ` / ${V}` : ``],
                                }),
                                (0, L.jsx)(r, {
                                  variant: `ghost`,
                                  size: `icon`,
                                  "aria-label": `Next page`,
                                  disabled: V !== null && z >= V,
                                  onClick: () => B((e) => e + 1),
                                  children: `›`,
                                }),
                              ],
                            }),
                          J &&
                            (0, L.jsxs)(L.Fragment, {
                              children: [
                                (0, L.jsx)(r, {
                                  variant: `ghost`,
                                  size: `icon`,
                                  "aria-label": `Zoom out`,
                                  onClick: () =>
                                    ae((e) => Math.max(50, e - 10)),
                                  children: (0, L.jsx)(j, {
                                    className: `h-4 w-4`,
                                  }),
                                }),
                                (0, L.jsxs)(`span`, {
                                  className: `w-10 text-center text-xs tabular-nums`,
                                  children: [W, `%`],
                                }),
                                (0, L.jsx)(r, {
                                  variant: `ghost`,
                                  size: `icon`,
                                  "aria-label": `Zoom in`,
                                  onClick: () =>
                                    ae((e) => Math.min(200, e + 10)),
                                  children: (0, L.jsx)(c, {
                                    className: `h-4 w-4`,
                                  }),
                                }),
                                (0, L.jsx)(r, {
                                  variant: `ghost`,
                                  size: `icon`,
                                  "aria-label": `Full screen`,
                                  onClick: () =>
                                    ue.current?.requestFullscreen?.(),
                                  children: (0, L.jsx)(re, {
                                    className: `h-4 w-4`,
                                  }),
                                }),
                              ],
                            }),
                          (0, L.jsx)(r, {
                            variant: `ghost`,
                            size: `icon`,
                            "aria-label": `Close document preview`,
                            onClick: n,
                            children: (0, L.jsx)(te, { className: `h-4 w-4` }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, L.jsx)(`div`, {
                    ref: ue,
                    className: `flex min-h-0 flex-1 items-center justify-center overflow-auto p-2 sm:p-5`,
                    children: u
                      ? (0, L.jsxs)(`div`, {
                          className: `max-w-sm rounded-xl border bg-white p-6 text-center text-sm text-slate-600`,
                          children: [
                            u,
                            (0, L.jsxs)(r, {
                              className: `mt-4`,
                              onClick: Z,
                              children: [
                                (0, L.jsx)(a, { className: `mr-2 h-4 w-4` }),
                                `Download file`,
                              ],
                            }),
                          ],
                        })
                      : J
                        ? o
                          ? q
                            ? (0, L.jsx)(
                                `iframe`,
                                {
                                  title: `PDF preview: ${e.original_filename}`,
                                  src: `${o}#page=${z}&zoom=${W}`,
                                  className: `h-full min-h-[60vh] w-full rounded-lg bg-white`,
                                },
                                `${o}#page=${z}&zoom=${W}`,
                              )
                            : (0, L.jsx)(`img`, {
                                src: o,
                                alt: `Preview of ${e.original_filename}`,
                                className: `max-h-full max-w-full origin-center object-contain transition-transform`,
                                style: { transform: `scale(${W / 100})` },
                              })
                          : (0, L.jsx)(`div`, {
                              className: `text-sm text-slate-500`,
                              children: `Loading secure preview…`,
                            })
                        : (0, L.jsxs)(`div`, {
                            className: `max-w-sm rounded-xl border bg-white p-8 text-center`,
                            children: [
                              (0, L.jsx)(l, {
                                className: `mx-auto h-10 w-10 text-slate-400`,
                              }),
                              (0, L.jsx)(`p`, {
                                className: `mt-3 font-medium`,
                                children: `Preview is not supported for this file type`,
                              }),
                              (0, L.jsx)(`p`, {
                                className: `mt-1 text-sm text-slate-500`,
                                children: e.detected_mime_type,
                              }),
                              (0, L.jsxs)(r, {
                                className: `mt-5`,
                                onClick: Z,
                                children: [
                                  (0, L.jsx)(a, { className: `mr-2 h-4 w-4` }),
                                  `Download `,
                                  e.original_filename,
                                ],
                              }),
                            ],
                          }),
                  }),
                ],
              }),
              (0, L.jsxs)(`aside`, {
                className: `min-h-0 overflow-y-auto border-t bg-white p-5 lg:border-l lg:border-t-0 space-y-5`,
                children: [
                  (0, L.jsxs)(`div`, {
                    className: `flex items-start justify-between gap-3`,
                    children: [
                      (0, L.jsxs)(`div`, {
                        className: `min-w-0`,
                        children: [
                          (0, L.jsx)(`p`, {
                            className: `text-xs font-medium uppercase tracking-wide text-slate-500`,
                            children: `Document details`,
                          }),
                          (0, L.jsx)(`h2`, {
                            className: `mt-1 break-words text-lg font-semibold text-slate-900`,
                            children: e.original_filename,
                          }),
                        ],
                      }),
                      (0, L.jsx)(`span`, {
                        className: `shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${$ === `Verified` ? `bg-emerald-50 text-emerald-700 border border-emerald-200` : $ === `Rejected` || $ === `Mismatch detected` ? `bg-red-50 text-red-700 border border-red-200` : `bg-amber-50 text-amber-800 border border-amber-200`}`,
                        children: $,
                      }),
                    ],
                  }),
                  me &&
                    (0, L.jsxs)(`div`, {
                      className: `rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs space-y-1`,
                      children: [
                        (0, L.jsxs)(`div`, {
                          className: `flex items-center gap-1.5 font-semibold text-amber-950`,
                          children: [
                            (0, L.jsx)(x, {
                              className: `h-4 w-4 text-amber-600 shrink-0`,
                            }),
                            (0, L.jsx)(`span`, {
                              children: `Cross-Validation Conflict Flagged`,
                            }),
                          ],
                        }),
                        (0, L.jsx)(`p`, {
                          className: `text-[11px] text-amber-800 leading-relaxed`,
                          children: `Preliminary OCR extractions or declared records have conflicting values. Review the extracted fields below and cross-reference with official registers.`,
                        }),
                      ],
                    }),
                  Y &&
                    (0, L.jsxs)(`div`, {
                      className: `rounded-lg border border-blue-200 bg-blue-50/50 p-3 space-y-2`,
                      children: [
                        (0, L.jsxs)(`div`, {
                          className: `flex items-center justify-between`,
                          children: [
                            (0, L.jsxs)(`span`, {
                              className: `text-xs font-semibold text-blue-900 flex items-center gap-1`,
                              children: [
                                (0, L.jsx)(d, {
                                  className: `h-3.5 w-3.5 text-blue-600`,
                                }),
                                `Officer Determination`,
                              ],
                            }),
                            (0, L.jsx)(`span`, {
                              className: `text-[10px] text-blue-700 font-mono`,
                              children: t.role,
                            }),
                          ],
                        }),
                        (0, L.jsxs)(`div`, {
                          className: `grid grid-cols-3 gap-1.5 pt-1`,
                          children: [
                            (0, L.jsxs)(r, {
                              size: `sm`,
                              disabled: K,
                              onClick: () => Q(`VERIFIED`),
                              className: `h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2`,
                              children: [
                                (0, L.jsx)(S, { className: `h-3 w-3 mr-1` }),
                                `Verify`,
                              ],
                            }),
                            (0, L.jsxs)(r, {
                              size: `sm`,
                              variant: `outline`,
                              disabled: K,
                              onClick: () => Q(`ACTION_REQUIRED`),
                              className: `h-7 text-[11px] border-amber-400 text-amber-800 hover:bg-amber-100 px-2`,
                              children: [
                                (0, L.jsx)(x, {
                                  className: `h-3 w-3 mr-1 text-amber-600`,
                                }),
                                `Flag`,
                              ],
                            }),
                            (0, L.jsxs)(r, {
                              size: `sm`,
                              variant: `destructive`,
                              disabled: K,
                              onClick: () => Q(`REJECTED`),
                              className: `h-7 text-[11px] px-2`,
                              children: [
                                (0, L.jsx)(_, { className: `h-3 w-3 mr-1` }),
                                `Reject`,
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  (0, L.jsxs)(`dl`, {
                    className: `grid grid-cols-2 gap-x-3 gap-y-3 text-xs border-y py-3`,
                    children: [
                      (0, L.jsxs)(`div`, {
                        children: [
                          (0, L.jsx)(`dt`, {
                            className: `text-slate-500`,
                            children: `Document Type`,
                          }),
                          (0, L.jsx)(`dd`, {
                            className: `mt-0.5 font-medium`,
                            children: e.document_type,
                          }),
                        ],
                      }),
                      (0, L.jsxs)(`div`, {
                        children: [
                          (0, L.jsx)(`dt`, {
                            className: `text-slate-500`,
                            children: `File Size`,
                          }),
                          (0, L.jsx)(`dd`, {
                            className: `mt-0.5 font-medium`,
                            children: I(e.size_bytes),
                          }),
                        ],
                      }),
                      (0, L.jsxs)(`div`, {
                        children: [
                          (0, L.jsx)(`dt`, {
                            className: `text-slate-500`,
                            children: `Uploaded`,
                          }),
                          (0, L.jsx)(`dd`, {
                            className: `mt-0.5 font-medium`,
                            children: pe,
                          }),
                        ],
                      }),
                      (0, L.jsxs)(`div`, {
                        children: [
                          (0, L.jsx)(`dt`, {
                            className: `text-slate-500`,
                            children: `Version`,
                          }),
                          (0, L.jsx)(`dd`, {
                            className: `mt-0.5 font-medium`,
                            children: e.version_number || 1,
                          }),
                        ],
                      }),
                      e.expires_at &&
                        (0, L.jsxs)(`div`, {
                          className: `col-span-2`,
                          children: [
                            (0, L.jsx)(`dt`, {
                              className: `text-slate-500`,
                              children: `Validity Expiry`,
                            }),
                            (0, L.jsx)(`dd`, {
                              className: `mt-0.5 font-medium text-destructive`,
                              children: new Date(
                                e.expires_at,
                              ).toLocaleDateString(`en-IN`),
                            }),
                          ],
                        }),
                    ],
                  }),
                  (0, L.jsxs)(`div`, {
                    children: [
                      (0, L.jsxs)(`div`, {
                        className: `flex items-center justify-between`,
                        children: [
                          (0, L.jsxs)(`h3`, {
                            className: `text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5`,
                            children: [
                              (0, L.jsx)(l, {
                                className: `h-3.5 w-3.5 text-blue-600`,
                              }),
                              `Extracted Intelligence`,
                            ],
                          }),
                          (0, L.jsxs)(`span`, {
                            className: `rounded bg-slate-100 font-mono text-[10px] px-1.5 py-0.5 text-slate-600`,
                            children: [F.length, ` fields`],
                          }),
                        ],
                      }),
                      (0, L.jsx)(`div`, {
                        className: `mt-2.5 space-y-2`,
                        children:
                          F.length > 0
                            ? F.map((e) =>
                                (0, L.jsx)(
                                  `div`,
                                  {
                                    className: `rounded-md border p-2 text-xs transition-colors ${e.status === `CONFLICTING` ? `border-amber-300 bg-amber-50/60` : e.status === `REJECTED` ? `border-red-300 bg-red-50/60` : `border-slate-200 bg-slate-50/50`}`,
                                    children: (0, L.jsxs)(`div`, {
                                      className: `flex items-start justify-between gap-1`,
                                      children: [
                                        (0, L.jsxs)(`div`, {
                                          children: [
                                            (0, L.jsx)(`span`, {
                                              className: `text-[10px] font-mono uppercase text-slate-500 block`,
                                              children: e.field,
                                            }),
                                            (0, L.jsx)(`span`, {
                                              className: `font-semibold text-slate-900 mt-0.5 block break-words`,
                                              children: e.value,
                                            }),
                                          ],
                                        }),
                                        (0, L.jsxs)(`div`, {
                                          className: `flex flex-col items-end gap-1 shrink-0`,
                                          children: [
                                            (0, L.jsxs)(`span`, {
                                              className: `rounded px-1.5 py-0.2 text-[10px] font-bold ${e.confidence >= 0.9 ? `bg-emerald-100 text-emerald-800` : `bg-amber-100 text-amber-800`}`,
                                              children: [
                                                Math.round(e.confidence * 100),
                                                `% conf`,
                                              ],
                                            }),
                                            (0, L.jsx)(`span`, {
                                              className: `text-[9px] uppercase font-mono text-slate-500`,
                                              children: e.status,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  },
                                  e.id || e.field,
                                ),
                              )
                            : (0, L.jsx)(`div`, {
                                className: `rounded border border-dashed p-3 text-center text-xs text-slate-400`,
                                children: `No automated extractions registered for this document.`,
                              }),
                      }),
                    ],
                  }),
                  (0, L.jsxs)(`div`, {
                    className: `space-y-2 pt-2 border-t`,
                    children: [
                      (0, L.jsxs)(r, {
                        className: `w-full`,
                        size: `sm`,
                        onClick: Z,
                        children: [
                          (0, L.jsx)(a, { className: `mr-2 h-4 w-4` }),
                          `Download File`,
                        ],
                      }),
                      !Y &&
                        (0, L.jsxs)(L.Fragment, {
                          children: [
                            (0, L.jsx)(r, {
                              variant: `outline`,
                              className: `w-full`,
                              size: `sm`,
                              onClick: () => se((e) => !e),
                              children: oe
                                ? `Cancel Replacement`
                                : `Replace Document`,
                            }),
                            (0, L.jsx)(r, {
                              variant: `ghost`,
                              className: `w-full text-destructive hover:text-destructive text-xs`,
                              size: `sm`,
                              onClick: () => G(!0),
                              children: `Archive Document`,
                            }),
                          ],
                        }),
                    ],
                  }),
                  oe &&
                    (0, L.jsxs)(`div`, {
                      className: `mt-4 rounded-lg border p-3`,
                      children: [
                        (0, L.jsx)(`p`, {
                          className: `mb-3 text-sm font-medium`,
                          children: `Upload a new version`,
                        }),
                        (0, L.jsx)(H, {
                          session: t,
                          documentType: e.document_type,
                          replaceId: e.id,
                          onUploaded: i,
                          onComplete: () => {
                            (se(!1), n());
                          },
                        }),
                      ],
                    }),
                  (0, L.jsxs)(`div`, {
                    className: `border-t pt-4`,
                    children: [
                      (0, L.jsx)(`h3`, {
                        className: `text-xs font-semibold text-slate-800 uppercase tracking-wider`,
                        children: `Version History`,
                      }),
                      m.length <= 1
                        ? (0, L.jsx)(`p`, {
                            className: `mt-1 text-xs text-slate-500`,
                            children: `No previous versions.`,
                          })
                        : (0, L.jsx)(`ol`, {
                            className: `mt-2 space-y-2`,
                            children: m.map((t) =>
                              (0, L.jsxs)(
                                `li`,
                                {
                                  className: `flex justify-between gap-2 text-xs`,
                                  children: [
                                    (0, L.jsxs)(`span`, {
                                      className: `min-w-0 truncate`,
                                      children: [
                                        `v`,
                                        t.version_number,
                                        `: `,
                                        t.original_filename,
                                      ],
                                    }),
                                    (0, L.jsxs)(`span`, {
                                      className: `shrink-0 text-slate-500`,
                                      children: [
                                        new Date(
                                          t.created_at,
                                        ).toLocaleDateString(`en-IN`),
                                        t.id === e.id ? ` · Current` : ``,
                                      ],
                                    }),
                                  ],
                                },
                                t.id,
                              ),
                            ),
                          }),
                    ],
                  }),
                  (0, L.jsxs)(`div`, {
                    className: `border-t pt-4`,
                    children: [
                      (0, L.jsxs)(`h3`, {
                        className: `text-xs font-semibold text-slate-800 uppercase tracking-wider`,
                        children: [`Linked Applications (`, N.length, `)`],
                      }),
                      N.length
                        ? (0, L.jsx)(`ul`, {
                            className: `mt-2 space-y-2`,
                            children: N.map((e) =>
                              (0, L.jsxs)(
                                `li`,
                                {
                                  className: `rounded border bg-slate-50/70 p-2 text-xs`,
                                  children: [
                                    (0, L.jsx)(`p`, {
                                      className: `font-semibold text-slate-900`,
                                      children: e.scheme_name,
                                    }),
                                    (0, L.jsxs)(`p`, {
                                      className: `text-[11px] text-slate-500 mt-0.5`,
                                      children: [
                                        e.application_number,
                                        ` · `,
                                        e.status,
                                      ],
                                    }),
                                  ],
                                },
                                `${e.application_id}-${e.document_version_id}`,
                              ),
                            ),
                          })
                        : (0, L.jsx)(`p`, {
                            className: `mt-1 text-xs text-slate-500`,
                            children: `Not currently linked to any application.`,
                          }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
      (0, L.jsx)(ne, {
        open: ce,
        onOpenChange: G,
        children: (0, L.jsxs)(E, {
          children: [
            (0, L.jsxs)(A, {
              children: [
                (0, L.jsx)(T, { children: `Archive this document?` }),
                (0, L.jsx)(w, {
                  children: `This file may be linked to an application. It will be removed from your active list, while its file and audit history remain preserved.`,
                }),
              ],
            }),
            (0, L.jsxs)(O, {
              children: [
                (0, L.jsx)(k, { children: `Cancel` }),
                (0, L.jsx)(D, {
                  onClick: (e) => {
                    (e.preventDefault(), fe());
                  },
                  children: `Archive document`,
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { I as i, H as n, P as r, U as t };
