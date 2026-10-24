import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import {
  f as useControllableState,
  g as createSlot,
  m as createContextScope,
  o as Presence,
  s as useId,
  u as Primitive,
  v as useComposedRefs,
  y as require_jsx_runtime,
} from "./@radix-ui/react-accordion+[...].mjs";
import { t as composeEventHandlers } from "./radix-ui__primitive.mjs";
import {
  C as useFocusScopeBranchRegistry,
  S as useFocusScopeBranch,
  T as DismissableLayer,
  _ as ReactRemoveScroll,
  b as FocusScope,
  v as hideOthers,
  w as useFocusGuards,
  x as FocusScopeBranchProvider,
  y as Portal,
} from "./@radix-ui/react-alert-dialog+[...].mjs";
import {
  _ as PopperAnchor,
  g as Popper,
  v as PopperContent,
  y as createPopperScope,
} from "./@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/@radix-ui/react-popover/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __name = (target, value) =>
  __defProp(target, "name", {
    value,
    configurable: true,
  });
var POPOVER_NAME = "Popover";
var [createPopoverContext, createPopoverScope] = createContextScope(
  POPOVER_NAME,
  [createPopperScope],
);
var usePopperScope = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover = /* @__PURE__ */ __name((props) => {
  const {
    __scopePopover,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = false,
  } = props;
  const popperScope = usePopperScope(__scopePopover);
  const triggerRef = import_react.useRef(null);
  const [hasCustomAnchor, setHasCustomAnchor] = import_react.useState(false);
  const [titleCount, setTitleCount] = import_react.useState(0);
  const [descriptionCount, setDescriptionCount] = import_react.useState(0);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: POPOVER_NAME,
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popper, {
    ...popperScope,
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverProvider, {
      scope: __scopePopover,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      titlePresent: titleCount > 0,
      descriptionPresent: descriptionCount > 0,
      setTitleCount,
      setDescriptionCount,
      triggerRef,
      open,
      onOpenChange: setOpen,
      onOpenToggle: import_react.useCallback(
        () => setOpen((prevOpen) => !prevOpen),
        [setOpen],
      ),
      hasCustomAnchor,
      onCustomAnchorAdd: import_react.useCallback(
        () => setHasCustomAnchor(true),
        [],
      ),
      onCustomAnchorRemove: import_react.useCallback(
        () => setHasCustomAnchor(false),
        [],
      ),
      modal,
      children,
    }),
  });
}, "Popover");
var TRIGGER_NAME = "PopoverTrigger";
var PopoverTrigger = /* @__PURE__ */ import_react.forwardRef(
  /* @__PURE__ */ __name(function PopoverTrigger2(props, forwardedRef) {
    const { __scopePopover, ...triggerProps } = props;
    const context = usePopoverContext(TRIGGER_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const composedTriggerRef = useComposedRefs(
      forwardedRef,
      context.triggerRef,
    );
    const trigger = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.open ? context.contentId : void 0,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle),
      },
    );
    return context.hasCustomAnchor
      ? trigger
      : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperAnchor, {
          asChild: true,
          ...popperScope,
          children: trigger,
        });
  }, "PopoverTrigger"),
);
var PORTAL_NAME = "PopoverPortal";
var [PortalProvider, usePortalContext] = createPopoverContext(PORTAL_NAME, {
  forceMount: void 0,
});
var PopoverPortal = /* @__PURE__ */ __name((props) => {
  const { __scopePopover, forceMount, children, container } = props;
  const context = usePopoverContext(PORTAL_NAME, __scopePopover);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider, {
    scope: __scopePopover,
    forceMount,
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
      present: forceMount || context.open,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
        asChild: true,
        container,
        children,
      }),
    }),
  });
}, "PopoverPortal");
var CONTENT_NAME = "PopoverContent";
var PopoverContent = /* @__PURE__ */ import_react.forwardRef(
  /* @__PURE__ */ __name(function PopoverContent2(props, forwardedRef) {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopePopover);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
      present: forceMount || context.open,
      children: context.modal
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentModal, {
            ...contentProps,
            ref: forwardedRef,
          })
        : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentNonModal, {
            ...contentProps,
            ref: forwardedRef,
          }),
    });
  }, "PopoverContent"),
);
var Slot = createSlot("PopoverContent.RemoveScroll");
var PopoverContentModal = /* @__PURE__ */ import_react.forwardRef(
  /* @__PURE__ */ __name(function PopoverContentModal2(props, forwardedRef) {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const contentRef = import_react.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = import_react.useRef(false);
    const { nodes: branchNodes, registry: branchRegistry } =
      useFocusScopeBranchRegistry();
    import_react.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
      as: Slot,
      allowPinchZoom: true,
      shards: import_react.useMemo(
        () => [contentRef, ...branchNodes.map((node) => ({ current: node }))],
        [contentRef, branchNodes],
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        PopoverContentImpl,
        {
          ...props,
          ref: composedRefs,
          branchNodes,
          branchRegistry,
          trapFocus: context.open,
          disableOutsidePointerEvents: true,
          onCloseAutoFocus: composeEventHandlers(
            props.onCloseAutoFocus,
            (event) => {
              event.preventDefault();
              if (!isRightClickOutsideRef.current)
                context.triggerRef.current?.focus();
            },
          ),
          onPointerDownOutside: composeEventHandlers(
            props.onPointerDownOutside,
            (event) => {
              const originalEvent = event.detail.originalEvent;
              const ctrlLeftClick =
                originalEvent.button === 0 && originalEvent.ctrlKey === true;
              const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
              isRightClickOutsideRef.current = isRightClick;
            },
            { checkForDefaultPrevented: false },
          ),
          onFocusOutside: composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault(),
            { checkForDefaultPrevented: false },
          ),
        },
      ),
    });
  }, "PopoverContentModal"),
);
var PopoverContentNonModal = /* @__PURE__ */ import_react.forwardRef(
  /* @__PURE__ */ __name(function PopoverContentNonModal2(props, forwardedRef) {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const hasInteractedOutsideRef = import_react.useRef(false);
    const hasPointerDownOutsideRef = import_react.useRef(false);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContentImpl, {
      ...props,
      ref: forwardedRef,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      onCloseAutoFocus: (event) => {
        props.onCloseAutoFocus?.(event);
        if (!event.defaultPrevented) {
          if (!hasInteractedOutsideRef.current)
            context.triggerRef.current?.focus();
          event.preventDefault();
        }
        hasInteractedOutsideRef.current = false;
        hasPointerDownOutsideRef.current = false;
      },
      onInteractOutside: (event) => {
        props.onInteractOutside?.(event);
        if (!event.defaultPrevented) {
          hasInteractedOutsideRef.current = true;
          if (event.detail.originalEvent.type === "pointerdown")
            hasPointerDownOutsideRef.current = true;
        }
        const target = event.target;
        if (context.triggerRef.current?.contains(target))
          event.preventDefault();
        if (
          event.detail.originalEvent.type === "focusin" &&
          hasPointerDownOutsideRef.current
        )
          event.preventDefault();
      },
    });
  }, "PopoverContentNonModal"),
);
var PopoverContentImpl = /* @__PURE__ */ import_react.forwardRef(
  /* @__PURE__ */ __name(function PopoverContentImpl2(props, forwardedRef) {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      "aria-describedby": ariaDescribedby,
      branchNodes,
      branchRegistry,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const [contentNode, setContentNode] = import_react.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, setContentNode);
    useFocusScopeBranch(contentNode);
    useFocusGuards();
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      FocusScopeBranchProvider,
      {
        registry: branchRegistry,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          branches: branchNodes,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            DismissableLayer,
            {
              asChild: true,
              disableOutsidePointerEvents,
              onInteractOutside,
              onEscapeKeyDown,
              onPointerDownOutside,
              onFocusOutside,
              onDismiss: () => context.onOpenChange(false),
              deferPointerDownOutside: true,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                PopperContent,
                {
                  "data-state": getState(context.open),
                  role: "dialog",
                  id: context.contentId,
                  "aria-labelledby": context.titlePresent
                    ? context.titleId
                    : void 0,
                  "aria-describedby": context.descriptionPresent
                    ? concatAriaDescribedby(
                        ariaDescribedby,
                        context.descriptionId,
                      )
                    : ariaDescribedby,
                  ...popperScope,
                  ...contentProps,
                  ref: composedRefs,
                  style: {
                    ...contentProps.style,
                    "--radix-popover-content-transform-origin":
                      "var(--radix-popper-transform-origin)",
                    "--radix-popover-content-available-width":
                      "var(--radix-popper-available-width)",
                    "--radix-popover-content-available-height":
                      "var(--radix-popper-available-height)",
                    "--radix-popover-trigger-width":
                      "var(--radix-popper-anchor-width)",
                    "--radix-popover-trigger-height":
                      "var(--radix-popper-anchor-height)",
                  },
                },
              ),
            },
          ),
        }),
      },
    );
  }, "PopoverContentImpl"),
);
function getState(open) {
  return open ? "open" : "closed";
}
__name(getState, "getState");
function concatAriaDescribedby(...values) {
  const ids = /* @__PURE__ */ new Set();
  for (const value of values) {
    if (typeof value !== "string") continue;
    for (const id of String(value).trim().split(/\s+/)) if (id) ids.add(id);
  }
  return ids.size > 0 ? Array.from(ids).join(" ") : void 0;
}
__name(concatAriaDescribedby, "concatAriaDescribedby");
//#endregion
export {
  PopoverTrigger as i,
  PopoverContent as n,
  PopoverPortal as r,
  Popover as t,
};
