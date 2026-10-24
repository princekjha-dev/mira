import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as buttonVariants, r as cn } from "./button-BT328xhy.mjs";
import {
  a as AlertDialogDescription$1,
  c as AlertDialogTitle$1,
  i as AlertDialogContent$1,
  n as AlertDialogAction$1,
  o as AlertDialogOverlay$1,
  r as AlertDialogCancel$1,
  s as AlertDialogPortal$1,
  t as AlertDialog$1,
} from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alert-dialog-CC_Gil3n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = AlertDialog$1;
var AlertDialogPortal = AlertDialogPortal$1;
var AlertDialogOverlay = import_react.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay$1, {
      className: cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      ),
      ...props,
      ref,
    }),
);
AlertDialogOverlay.displayName = AlertDialogOverlay$1.displayName;
var AlertDialogContent = import_react.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent$1, {
          ref,
          className: cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
            className,
          ),
          ...props,
        }),
      ],
    }),
);
AlertDialogContent.displayName = AlertDialogContent$1.displayName;
var AlertDialogHeader = ({ className, ...props }) =>
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    ),
    ...props,
  });
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) =>
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    ),
    ...props,
  });
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) =>
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle$1, {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props,
  }),
);
AlertDialogTitle.displayName = AlertDialogTitle$1.displayName;
var AlertDialogDescription = import_react.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription$1, {
      ref,
      className: cn("text-sm text-muted-foreground", className),
      ...props,
    }),
);
AlertDialogDescription.displayName = AlertDialogDescription$1.displayName;
var AlertDialogAction = import_react.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction$1, {
      ref,
      className: cn(buttonVariants(), className),
      ...props,
    }),
);
AlertDialogAction.displayName = AlertDialogAction$1.displayName;
var AlertDialogCancel = import_react.forwardRef(
  ({ className, ...props }, ref) =>
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel$1, {
      ref,
      className: cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className,
      ),
      ...props,
    }),
);
AlertDialogCancel.displayName = AlertDialogCancel$1.displayName;
//#endregion
export {
  AlertDialogDescription as a,
  AlertDialogTitle as c,
  AlertDialogContent as i,
  AlertDialogAction as n,
  AlertDialogFooter as o,
  AlertDialogCancel as r,
  AlertDialogHeader as s,
  AlertDialog as t,
};
