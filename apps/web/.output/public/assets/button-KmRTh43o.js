var e = Object.create,
  t = Object.defineProperty,
  n = Object.getOwnPropertyDescriptor,
  r = Object.getOwnPropertyNames,
  i = Object.getPrototypeOf,
  a = Object.prototype.hasOwnProperty,
  o = (e, t) => () => (
    t || (e((t = { exports: {} }).exports, t), (e = null)),
    t.exports
  ),
  s = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        ((d = c[l]),
          !a.call(e, d) &&
            d !== o &&
            t(e, d, {
              get: ((e) => i[e]).bind(null, d),
              enumerable: !(s = n(i, d)) || s.enumerable,
            }));
    return e;
  },
  c = (n, r, o) => (
    (o = n == null ? {} : e(i(n))),
    s(
      r || !n || !n.__esModule || !a.call(n, `default`)
        ? t(o, `default`, { value: n, enumerable: !0 })
        : o,
      n,
    )
  ),
  l = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.consumer`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      ee = Symbol.for(`react.activity`),
      f = Symbol.for(`react.view_transition`),
      p = Symbol.iterator;
    function m(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (p && e[p]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var h = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      g = Object.assign,
      _ = {};
    function v(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    ((v.prototype.isReactComponent = {}),
      (v.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(
            `takes an object of state variables to update or a function which returns an object of state variables.`,
          );
        this.updater.enqueueSetState(this, e, t, `setState`);
      }),
      (v.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
      }));
    function y() {}
    y.prototype = v.prototype;
    function b(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    var x = (b.prototype = new y());
    ((x.constructor = b), g(x, v.prototype), (x.isPureReactComponent = !0));
    var S = Array.isArray;
    function C() {}
    var w = { H: null, A: null, T: null, S: null },
      T = Object.prototype.hasOwnProperty;
    function E(e, n, r) {
      var i = r.ref;
      return {
        $$typeof: t,
        type: e,
        key: n,
        ref: i === void 0 ? null : i,
        props: r,
      };
    }
    function D(e, t) {
      return E(e.type, t, e.props);
    }
    function O(e) {
      return typeof e == `object` && !!e && e.$$typeof === t;
    }
    function te(e) {
      var t = { "=": `=0`, ":": `=2` };
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e];
        })
      );
    }
    var k = /\/+/g;
    function A(e, t) {
      return typeof e == `object` && e && e.key != null
        ? te(`` + e.key)
        : t.toString(36);
    }
    function j(e) {
      switch (e.status) {
        case `fulfilled`:
          return e.value;
        case `rejected`:
          throw e.reason;
        default:
          switch (
            (typeof e.status == `string`
              ? e.then(C, C)
              : ((e.status = `pending`),
                e.then(
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `fulfilled`), (e.value = t));
                  },
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `rejected`), (e.reason = t));
                  },
                )),
            e.status)
          ) {
            case `fulfilled`:
              return e.value;
            case `rejected`:
              throw e.reason;
          }
      }
      throw e;
    }
    function M(e, r, i, a, o) {
      var s = typeof e;
      (s === `undefined` || s === `boolean`) && (e = null);
      var c = !1;
      if (e === null) c = !0;
      else
        switch (s) {
          case `bigint`:
          case `string`:
          case `number`:
            c = !0;
            break;
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0;
                break;
              case d:
                return ((c = e._init), M(c(e._payload), r, i, a, o));
            }
        }
      if (c)
        return (
          (o = o(e)),
          (c = a === `` ? `.` + A(e, 0) : a),
          S(o)
            ? ((i = ``),
              c != null && (i = c.replace(k, `$&/`) + `/`),
              M(o, r, i, ``, function (e) {
                return e;
              }))
            : o != null &&
              (O(o) &&
                (o = D(
                  o,
                  i +
                    (o.key == null || (e && e.key === o.key)
                      ? ``
                      : (`` + o.key).replace(k, `$&/`) + `/`) +
                    c,
                )),
              r.push(o)),
          1
        );
      c = 0;
      var l = a === `` ? `.` : a + `:`;
      if (S(e))
        for (var u = 0; u < e.length; u++)
          ((a = e[u]), (s = l + A(a, u)), (c += M(a, r, i, s, o)));
      else if (((u = m(e)), typeof u == `function`))
        for (e = u.call(e), u = 0; !(a = e.next()).done;)
          ((a = a.value), (s = l + A(a, u++)), (c += M(a, r, i, s, o)));
      else if (s === `object`) {
        if (typeof e.then == `function`) return M(j(e), r, i, a, o);
        throw (
          (r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]`
                ? `object with keys {` + Object.keys(e).join(`, `) + `}`
                : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          )
        );
      }
      return c;
    }
    function N(e, t, n) {
      if (e == null) return e;
      var r = [],
        i = 0;
      return (
        M(e, r, ``, ``, function (e) {
          return t.call(n, e, i++);
        }),
        r
      );
    }
    function P(e) {
      if (e._status === -1) {
        var t = e._result,
          n = t();
        (n.then(
          function (t) {
            (e._status === 0 || e._status === -1) &&
              ((e._status = 1),
              (e._result = t),
              n.status === void 0 && ((n.status = `fulfilled`), (n.value = t)));
          },
          function (t) {
            (e._status === 0 || e._status === -1) &&
              ((e._status = 2),
              (e._result = t),
              n.status === void 0 && ((n.status = `rejected`), (n.reason = t)));
          },
        ),
          e._status === -1 && ((e._status = 0), (e._result = n)));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var ne =
      typeof reportError == `function`
        ? reportError
        : function (e) {
            if (
              typeof window == `object` &&
              typeof window.ErrorEvent == `function`
            ) {
              var t = new window.ErrorEvent(`error`, {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == `object` && e && typeof e.message == `string`
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (
              typeof process == `object` &&
              typeof process.emit == `function`
            ) {
              process.emit(`uncaughtException`, e);
              return;
            }
            console.error(e);
          };
    function F(e) {
      var t = w.T,
        n = {};
      ((n.types = t === null ? null : t.types), (w.T = n));
      try {
        var r = e(),
          i = w.S;
        (i !== null && i(n, r),
          typeof r == `object` &&
            r &&
            typeof r.then == `function` &&
            r.then(C, ne));
      } catch (e) {
        ne(e);
      } finally {
        (t !== null && n.types !== null && (t.types = n.types), (w.T = t));
      }
    }
    function I(e) {
      var t = w.T;
      if (t !== null) {
        var n = t.types;
        n === null ? (t.types = [e]) : n.indexOf(e) === -1 && n.push(e);
      } else F(I.bind(null, e));
    }
    var L = {
      map: N,
      forEach: function (e, t, n) {
        N(
          e,
          function () {
            t.apply(this, arguments);
          },
          n,
        );
      },
      count: function (e) {
        var t = 0;
        return (
          N(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          N(e, function (e) {
            return e;
          }) || []
        );
      },
      only: function (e) {
        if (!O(e))
          throw Error(
            `React.Children.only expected to receive a single React element child.`,
          );
        return e;
      },
    };
    ((e.Activity = ee),
      (e.Children = L),
      (e.Component = v),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = b),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.ViewTransition = f),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return w.H.useMemoCache(e);
        },
      }),
      (e.addTransitionType = I),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments);
        };
      }),
      (e.cacheSignal = function () {
        return null;
      }),
      (e.cloneElement = function (e, t, n) {
        if (e == null)
          throw Error(
            `The argument must be a React element, but you passed ` + e + `.`,
          );
        var r = g({}, e.props),
          i = e.key;
        if (t != null)
          for (a in (t.key !== void 0 && (i = `` + t.key), t))
            !T.call(t, a) ||
              a === `key` ||
              a === `__self` ||
              a === `__source` ||
              (a === `ref` && t.ref === void 0) ||
              (r[a] = t[a]);
        var a = arguments.length - 2;
        if (a === 1) r.children = n;
        else if (1 < a) {
          for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
          r.children = o;
        }
        return E(e.type, i, r);
      }),
      (e.createContext = function (e) {
        return (
          (e = {
            $$typeof: s,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (e.Provider = e),
          (e.Consumer = { $$typeof: o, _context: e }),
          e
        );
      }),
      (e.createElement = function (e, t, n) {
        var r,
          i = {},
          a = null;
        if (t != null)
          for (r in (t.key !== void 0 && (a = `` + t.key), t))
            T.call(t, r) &&
              r !== `key` &&
              r !== `__self` &&
              r !== `__source` &&
              (i[r] = t[r]);
        var o = arguments.length - 2;
        if (o === 1) i.children = n;
        else if (1 < o) {
          for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
          i.children = s;
        }
        if (e && e.defaultProps)
          for (r in ((o = e.defaultProps), o)) i[r] === void 0 && (i[r] = o[r]);
        return E(e, a, i);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e };
      }),
      (e.isValidElement = O),
      (e.lazy = function (e) {
        return { $$typeof: d, _payload: { _status: -1, _result: e }, _init: P };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
      }),
      (e.startTransition = F),
      (e.unstable_useCacheRefresh = function () {
        return w.H.useCacheRefresh();
      }),
      (e.use = function (e) {
        return w.H.use(e);
      }),
      (e.useActionState = function (e, t, n) {
        return w.H.useActionState(e, t, n);
      }),
      (e.useCallback = function (e, t) {
        return w.H.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return w.H.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return w.H.useDeferredValue(e, t);
      }),
      (e.useEffect = function (e, t) {
        return w.H.useEffect(e, t);
      }),
      (e.useEffectEvent = function (e) {
        return w.H.useEffectEvent(e);
      }),
      (e.useId = function () {
        return w.H.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return w.H.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return w.H.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return w.H.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return w.H.useMemo(e, t);
      }),
      (e.useOptimistic = function (e, t) {
        return w.H.useOptimistic(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return w.H.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return w.H.useRef(e);
      }),
      (e.useState = function (e) {
        return w.H.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return w.H.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return w.H.useTransition();
      }),
      (e.version = `19.3.1`));
  }),
  u = o((e, t) => {
    t.exports = l();
  }),
  d = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.fragment`);
    function r(e, n, r) {
      var i = null;
      if (
        (r !== void 0 && (i = `` + r),
        n.key !== void 0 && (i = `` + n.key),
        `key` in n)
      )
        for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
      else r = n;
      return (
        (n = r.ref),
        { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r }
      );
    }
    ((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
  }),
  ee = o((e, t) => {
    t.exports = d();
  }),
  f = c(u()),
  p = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim(),
  m = (e) => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase(),
  h = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) =>
      n ? n.toUpperCase() : t.toLowerCase(),
    ),
  g = (e) => {
    let t = h(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  _ = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    strokeWidth: 2,
    strokeLinecap: `round`,
    strokeLinejoin: `round`,
  },
  v = (e) => {
    for (let t in e)
      if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
  },
  y = (0, f.forwardRef)(
    (
      {
        color: e = `currentColor`,
        size: t = 24,
        strokeWidth: n = 2,
        absoluteStrokeWidth: r,
        className: i = ``,
        children: a,
        iconNode: o,
        ...s
      },
      c,
    ) =>
      (0, f.createElement)(
        `svg`,
        {
          ref: c,
          ..._,
          width: t,
          height: t,
          stroke: e,
          strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
          className: p(`lucide`, i),
          ...(!a && !v(s) && { "aria-hidden": `true` }),
          ...s,
        },
        [
          ...o.map(([e, t]) => (0, f.createElement)(e, t)),
          ...(Array.isArray(a) ? a : [a]),
        ],
      ),
  ),
  b = (e, t) => {
    let n = (0, f.forwardRef)(({ className: n, ...r }, i) =>
      (0, f.createElement)(y, {
        ref: i,
        iconNode: t,
        className: p(`lucide-${m(g(e))}`, `lucide-${e}`, n),
        ...r,
      }),
    );
    return ((n.displayName = g(e)), n);
  },
  x = Object.defineProperty,
  S = (e, t) => x(e, `name`, { value: t, configurable: !0 });
function C(e, t) {
  if (typeof e == `function`) return e(t);
  e != null && (e.current = t);
}
S(C, `setRef`);
function w(...e) {
  return (t) => {
    let n = !1,
      r = e.map((e) => {
        let r = C(e, t);
        return (!n && typeof r == `function` && (n = !0), r);
      });
    if (n)
      return () => {
        for (let t = 0; t < r.length; t++) {
          let n = r[t];
          typeof n == `function` ? n() : C(e[t], null);
        }
      };
  };
}
S(w, `composeRefs`);
function T(...e) {
  return f.useCallback(w(...e), e);
}
S(T, `useComposedRefs`);
var E = Object.defineProperty,
  D = (e, t) => E(e, `name`, { value: t, configurable: !0 });
function O(e) {
  let t = f.forwardRef((t, n) => {
    let { children: r, ...i } = t,
      a = null,
      o = !1,
      s = [];
    ((r = L(r)),
      f.Children.forEach(r, (e) => {
        if (P(e)) {
          o = !0;
          let t = e,
            n = `child` in t.props ? t.props.child : t.props.children;
          for (; F(n) && typeof B == `function`;) n = B(n._payload);
          ((a = j(t, n)), s.push(a?.props?.children));
        } else s.push(e);
      }),
      a
        ? (a = f.cloneElement(a, void 0, s))
        : !o && f.Children.count(r) === 1 && f.isValidElement(r) && (a = r));
    let c = a ? N(a) : void 0,
      l = T(n, c);
    if (!a) {
      if (r || r === 0) throw Error(o ? re(e) : z(e));
      return r;
    }
    let u = M(i, a.props ?? {});
    return (a.type !== f.Fragment && (u.ref = n ? l : c), f.cloneElement(a, u));
  });
  return ((t.displayName = `${e}.Slot`), t);
}
D(O, `createSlot`);
var te = O(`Slot`),
  k = Symbol.for(`radix.slottable`);
function A(e) {
  let t = D(
    (e) => (`child` in e ? e.children(e.child) : e.children),
    `Slottable`,
  );
  return ((t.displayName = `${e}.Slottable`), (t.__radixId = k), t);
}
D(A, `createSlottable`);
var j = D(
  (e, t) =>
    `child` in e.props
      ? f.isValidElement(t)
        ? f.cloneElement(t, void 0, e.props.children(t.props.children))
        : null
      : f.isValidElement(t)
        ? t
        : null,
  `getSlottableElementFromSlottable`,
);
function M(e, t) {
  let n = { ...t };
  for (let r in t) {
    let i = e[r],
      a = t[r];
    /^on[A-Z]/.test(r)
      ? i && a
        ? (n[r] = (...e) => {
            let t = a(...e);
            return (i(...e), t);
          })
        : i && (n[r] = i)
      : r === `style`
        ? (n[r] = { ...i, ...a })
        : r === `className`
          ? (n[r] = [i, a].filter(Boolean).join(` `))
          : r === `aria-describedby` && (n[r] = R(a, i));
  }
  return { ...e, ...n };
}
D(M, `mergeProps`);
function N(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, `ref`)?.get,
    n = t && `isReactWarning` in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, `ref`)?.get),
      (n = t && `isReactWarning` in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
D(N, `getElementRef`);
function P(e) {
  return (
    f.isValidElement(e) &&
    typeof e.type == `function` &&
    `__radixId` in e.type &&
    e.type.__radixId === k
  );
}
D(P, `isSlottable`);
var ne = Symbol.for(`react.lazy`);
function F(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `$$typeof` in e &&
    e.$$typeof === ne &&
    `_payload` in e &&
    I(e._payload)
  );
}
D(F, `isLazyComponent`);
function I(e) {
  return typeof e == `object` && !!e && `then` in e;
}
D(I, `isPromiseLike`);
function L(e) {
  let t = e;
  for (; F(t) && typeof B == `function`;) t = B(t._payload);
  return t;
}
D(L, `useUnwrappedLazy`);
function R(...e) {
  let t = new Set();
  for (let n of e)
    if (typeof n == `string`)
      for (let e of String(n).trim().split(/\s+/)) e && t.add(e);
  return t.size > 0 ? Array.from(t).join(` `) : void 0;
}
D(R, `concatAriaDescribedby`);
var z = D(
    (e) =>
      `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,
    `createSlotError`,
  ),
  re = D(
    (e) =>
      `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,
    `createSlottableError`,
  ),
  B = f.use;
function V(e) {
  var t,
    n,
    r = ``;
  if (typeof e == `string` || typeof e == `number`) r += e;
  else if (typeof e == `object`)
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++)
        e[t] && (n = V(e[t])) && (r && (r += ` `), (r += n));
    } else for (n in e) e[n] && (r && (r += ` `), (r += n));
  return r;
}
function ie() {
  for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)
    (e = arguments[n]) && (t = V(e)) && (r && (r += ` `), (r += t));
  return r;
}
var H = (e) => (typeof e == `boolean` ? `${e}` : e === 0 ? `0` : e),
  U = ie,
  ae = (e, t) => (n) => {
    if (t?.variants == null) return U(e, n?.class, n?.className);
    let { variants: r, defaultVariants: i } = t,
      a = Object.keys(r).map((e) => {
        let t = n?.[e],
          a = i?.[e];
        if (t === null) return null;
        let o = H(t) || H(a);
        return r[e][o];
      }),
      o =
        n &&
        Object.entries(n).reduce((e, t) => {
          let [n, r] = t;
          return (r === void 0 || (e[n] = r), e);
        }, {});
    return U(
      e,
      a,
      t?.compoundVariants?.reduce((e, t) => {
        let { class: n, className: r, ...a } = t;
        return Object.entries(a).every((e) => {
          let [t, n] = e;
          return Array.isArray(n)
            ? n.includes({ ...i, ...o }[t])
            : { ...i, ...o }[t] === n;
        })
          ? [...e, n, r]
          : e;
      }, []),
      n?.class,
      n?.className,
    );
  },
  oe = (e, t) => {
    let n = Array(e.length + t.length);
    for (let t = 0; t < e.length; t++) n[t] = e[t];
    for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
    return n;
  },
  se = (e, t) => ({ classGroupId: e, validator: t }),
  ce = (e = new Map(), t = null, n) => ({
    nextPart: e,
    validators: t,
    classGroupId: n,
  }),
  le = `-`,
  ue = [],
  de = `arbitrary..`,
  fe = (e) => {
    let t = he(e),
      { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (e) => {
        if (e.startsWith(`[`) && e.endsWith(`]`)) return me(e);
        let n = e.split(le);
        return pe(n, +(n[0] === `` && n.length > 1), t);
      },
      getConflictingClassGroupIds: (e, t) => {
        if (t) {
          let t = r[e],
            i = n[e];
          return t ? (i ? oe(i, t) : t) : i || ue;
        }
        return n[e] || ue;
      },
    };
  },
  pe = (e, t, n) => {
    if (e.length - t === 0) return n.classGroupId;
    let r = e[t],
      i = n.nextPart.get(r);
    if (i) {
      let n = pe(e, t + 1, i);
      if (n) return n;
    }
    let a = n.validators;
    if (a === null) return;
    let o = t === 0 ? e.join(le) : e.slice(t).join(le),
      s = a.length;
    for (let e = 0; e < s; e++) {
      let t = a[e];
      if (t.validator(o)) return t.classGroupId;
    }
  },
  me = (e) =>
    e.slice(1, -1).indexOf(`:`) === -1
      ? void 0
      : (() => {
          let t = e.slice(1, -1),
            n = t.indexOf(`:`),
            r = t.slice(0, n);
          return r ? de + r : void 0;
        })(),
  he = (e) => {
    let { theme: t, classGroups: n } = e;
    return ge(n, t);
  },
  ge = (e, t) => {
    let n = ce();
    for (let r in e) {
      let i = e[r];
      _e(i, n, r, t);
    }
    return n;
  },
  _e = (e, t, n, r) => {
    let i = e.length;
    for (let a = 0; a < i; a++) {
      let i = e[a];
      ve(i, t, n, r);
    }
  },
  ve = (e, t, n, r) => {
    if (typeof e == `string`) {
      ye(e, t, n);
      return;
    }
    if (typeof e == `function`) {
      be(e, t, n, r);
      return;
    }
    xe(e, t, n, r);
  },
  ye = (e, t, n) => {
    let r = e === `` ? t : Se(t, e);
    r.classGroupId = n;
  },
  be = (e, t, n, r) => {
    if (Ce(e)) {
      _e(e(r), t, n, r);
      return;
    }
    (t.validators === null && (t.validators = []), t.validators.push(se(n, e)));
  },
  xe = (e, t, n, r) => {
    let i = Object.entries(e),
      a = i.length;
    for (let e = 0; e < a; e++) {
      let [a, o] = i[e];
      _e(o, Se(t, a), n, r);
    }
  },
  Se = (e, t) => {
    let n = e,
      r = t.split(le),
      i = r.length;
    for (let e = 0; e < i; e++) {
      let t = r[e],
        i = n.nextPart.get(t);
      (i || ((i = ce()), n.nextPart.set(t, i)), (n = i));
    }
    return n;
  },
  Ce = (e) => `isThemeGetter` in e && e.isThemeGetter === !0,
  we = (e) => {
    if (e < 1) return { get: () => void 0, set: () => {} };
    let t = 0,
      n = Object.create(null),
      r = Object.create(null),
      i = (i, a) => {
        ((n[i] = a),
          t++,
          t > e && ((t = 0), (r = n), (n = Object.create(null))));
      };
    return {
      get(e) {
        let t = n[e];
        if (t !== void 0) return t;
        if ((t = r[e]) !== void 0) return (i(e, t), t);
      },
      set(e, t) {
        e in n ? (n[e] = t) : i(e, t);
      },
    };
  },
  Te = `!`,
  Ee = `:`,
  De = [],
  Oe = (e, t, n, r, i) => ({
    modifiers: e,
    hasImportantModifier: t,
    baseClassName: n,
    maybePostfixModifierPosition: r,
    isExternal: i,
  }),
  ke = (e) => {
    let { prefix: t, experimentalParseClassName: n } = e,
      r = (e) => {
        let t = [],
          n = 0,
          r = 0,
          i = 0,
          a,
          o = e.length;
        for (let s = 0; s < o; s++) {
          let o = e[s];
          if (n === 0 && r === 0) {
            if (o === Ee) {
              (t.push(e.slice(i, s)), (i = s + 1));
              continue;
            }
            if (o === `/`) {
              a = s;
              continue;
            }
          }
          o === `[`
            ? n++
            : o === `]`
              ? n--
              : o === `(`
                ? r++
                : o === `)` && r--;
        }
        let s = t.length === 0 ? e : e.slice(i),
          c = s,
          l = !1;
        s.endsWith(Te)
          ? ((c = s.slice(0, -1)), (l = !0))
          : s.startsWith(Te) && ((c = s.slice(1)), (l = !0));
        let u = a && a > i ? a - i : void 0;
        return Oe(t, l, c, u);
      };
    if (t) {
      let e = t + Ee,
        n = r;
      r = (t) =>
        t.startsWith(e) ? n(t.slice(e.length)) : Oe(De, !1, t, void 0, !0);
    }
    if (n) {
      let e = r;
      r = (t) => n({ className: t, parseClassName: e });
    }
    return r;
  },
  Ae = (e) => {
    let t = new Map();
    return (
      e.orderSensitiveModifiers.forEach((e, n) => {
        t.set(e, 1e6 + n);
      }),
      (e) => {
        let n = [],
          r = [];
        for (let i = 0; i < e.length; i++) {
          let a = e[i],
            o = a[0] === `[`,
            s = t.has(a);
          o || s
            ? (r.length > 0 && (r.sort(), n.push(...r), (r = [])), n.push(a))
            : r.push(a);
        }
        return (r.length > 0 && (r.sort(), n.push(...r)), n);
      }
    );
  },
  je = (e) => ({
    cache: we(e.cacheSize),
    parseClassName: ke(e),
    sortModifiers: Ae(e),
    postfixLookupClassGroupIds: Me(e),
    ...fe(e),
  }),
  Me = (e) => {
    let t = Object.create(null),
      n = e.postfixLookupClassGroups;
    if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
    return t;
  },
  Ne = /\s+/,
  Pe = (e, t) => {
    let {
        parseClassName: n,
        getClassGroupId: r,
        getConflictingClassGroupIds: i,
        sortModifiers: a,
        postfixLookupClassGroupIds: o,
      } = t,
      s = [],
      c = e.trim().split(Ne),
      l = ``;
    for (let e = c.length - 1; e >= 0; --e) {
      let t = c[e],
        {
          isExternal: u,
          modifiers: d,
          hasImportantModifier: ee,
          baseClassName: f,
          maybePostfixModifierPosition: p,
        } = n(t);
      if (u) {
        l = t + (l.length > 0 ? ` ` + l : l);
        continue;
      }
      let m = !!p,
        h;
      if (m) {
        h = r(f.substring(0, p));
        let e = h && o[h] ? r(f) : void 0;
        e && e !== h && ((h = e), (m = !1));
      } else h = r(f);
      if (!h) {
        if (!m) {
          l = t + (l.length > 0 ? ` ` + l : l);
          continue;
        }
        if (((h = r(f)), !h)) {
          l = t + (l.length > 0 ? ` ` + l : l);
          continue;
        }
        m = !1;
      }
      let g = d.length === 0 ? `` : d.length === 1 ? d[0] : a(d).join(`:`),
        _ = ee ? g + Te : g,
        v = _ + h;
      if (s.indexOf(v) > -1) continue;
      s.push(v);
      let y = i(h, m);
      for (let e = 0; e < y.length; ++e) {
        let t = y[e];
        s.push(_ + t);
      }
      l = t + (l.length > 0 ? ` ` + l : l);
    }
    return l;
  },
  Fe = (...e) => {
    let t = 0,
      n,
      r,
      i = ``;
    for (; t < e.length;)
      (n = e[t++]) && (r = Ie(n)) && (i && (i += ` `), (i += r));
    return i;
  },
  Ie = (e) => {
    if (typeof e == `string`) return e;
    let t,
      n = ``;
    for (let r = 0; r < e.length; r++)
      e[r] && (t = Ie(e[r])) && (n && (n += ` `), (n += t));
    return n;
  },
  Le = (e, ...t) => {
    let n,
      r,
      i,
      a,
      o = (o) => (
        (n = je(t.reduce((e, t) => t(e), e()))),
        (r = n.cache.get),
        (i = n.cache.set),
        (a = s),
        s(o)
      ),
      s = (e) => {
        let t = r(e);
        if (t) return t;
        let a = Pe(e, n);
        return (i(e, a), a);
      };
    return ((a = o), (...e) => a(Fe(...e)));
  },
  Re = [],
  W = (e) => {
    let t = (t) => t[e] || Re;
    return ((t.isThemeGetter = !0), (t.themeKey = e), t);
  },
  ze = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Be = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  Ve = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  He = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Ue =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  We = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/,
  Ge = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  Ke =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  G = (e) => Ve.test(e),
  K = (e) => !!e && !Number.isNaN(Number(e)),
  q = (e) => !!e && Number.isInteger(Number(e)),
  qe = (e) => e.endsWith(`%`) && K(e.slice(0, -1)),
  J = (e) => He.test(e),
  Je = () => !0,
  Ye = (e) => Ue.test(e) && !We.test(e),
  Xe = () => !1,
  Ze = (e) => Ge.test(e),
  Qe = (e) => Ke.test(e),
  $e = (e) => !Y(e) && !Z(e),
  et = (e) =>
    e.startsWith(`@container`) &&
    ((e[10] === `/` && e[11] !== void 0) ||
      (e[11] === `s` && e[16] !== void 0 && e.startsWith(`-size/`, 10)) ||
      (e[11] === `n` && e[18] !== void 0 && e.startsWith(`-normal/`, 10))),
  tt = (e) => Q(e, _t, Xe),
  Y = (e) => ze.test(e),
  X = (e) => Q(e, vt, Ye),
  nt = (e) => Q(e, yt, K),
  rt = (e) => Q(e, xt, Je),
  it = (e) => Q(e, bt, Xe),
  at = (e) => Q(e, ht, Xe),
  ot = (e) => Q(e, gt, Qe),
  st = (e) => Q(e, St, Ze),
  Z = (e) => Be.test(e),
  ct = (e) => $(e, vt),
  lt = (e) => $(e, bt),
  ut = (e) => $(e, ht),
  dt = (e) => $(e, _t),
  ft = (e) => $(e, gt),
  pt = (e) => $(e, St, !0),
  mt = (e) => $(e, xt, !0),
  Q = (e, t, n) => {
    let r = ze.exec(e);
    return r ? (r[1] ? t(r[1]) : n(r[2])) : !1;
  },
  $ = (e, t, n = !1) => {
    let r = Be.exec(e);
    return r ? (r[1] ? t(r[1]) : n) : !1;
  },
  ht = (e) => e === `position` || e === `percentage`,
  gt = (e) => e === `image` || e === `url`,
  _t = (e) => e === `length` || e === `size` || e === `bg-size`,
  vt = (e) => e === `length`,
  yt = (e) => e === `number`,
  bt = (e) => e === `family-name`,
  xt = (e) => e === `number` || e === `weight`,
  St = (e) => e === `shadow`,
  Ct = Le(() => {
    let e = W(`color`),
      t = W(`font`),
      n = W(`text`),
      r = W(`font-weight`),
      i = W(`tracking`),
      a = W(`leading`),
      o = W(`breakpoint`),
      s = W(`container`),
      c = W(`spacing`),
      l = W(`radius`),
      u = W(`shadow`),
      d = W(`inset-shadow`),
      ee = W(`text-shadow`),
      f = W(`drop-shadow`),
      p = W(`blur`),
      m = W(`perspective`),
      h = W(`aspect`),
      g = W(`ease`),
      _ = W(`animate`),
      v = () => [
        `auto`,
        `avoid`,
        `all`,
        `avoid-page`,
        `page`,
        `left`,
        `right`,
        `column`,
      ],
      y = () => [
        `center`,
        `top`,
        `bottom`,
        `left`,
        `right`,
        `top-left`,
        `left-top`,
        `top-right`,
        `right-top`,
        `bottom-right`,
        `right-bottom`,
        `bottom-left`,
        `left-bottom`,
      ],
      b = () => [...y(), Z, Y],
      x = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`],
      S = () => [`auto`, `contain`, `none`],
      C = () => [Z, Y, c],
      w = () => [G, `full`, `auto`, ...C()],
      T = () => [q, `none`, `subgrid`, Z, Y],
      E = () => [`auto`, { span: [`full`, q, Z, Y] }, q, Z, Y],
      D = () => [q, `auto`, Z, Y],
      O = () => [`auto`, `min`, `max`, `fr`, Z, Y],
      te = () => [
        `start`,
        `end`,
        `center`,
        `between`,
        `around`,
        `evenly`,
        `stretch`,
        `baseline`,
        `center-safe`,
        `end-safe`,
      ],
      k = () => [
        `start`,
        `end`,
        `center`,
        `stretch`,
        `center-safe`,
        `end-safe`,
      ],
      A = () => [`auto`, ...C()],
      j = () => [
        G,
        `auto`,
        `full`,
        `dvw`,
        `dvh`,
        `lvw`,
        `lvh`,
        `svw`,
        `svh`,
        `min`,
        `max`,
        `fit`,
        ...C(),
      ],
      M = () => [
        s,
        G,
        `screen`,
        `full`,
        `dvw`,
        `lvw`,
        `svw`,
        `min`,
        `max`,
        `fit`,
        ...C(),
      ],
      N = () => [
        G,
        `screen`,
        `full`,
        `lh`,
        `dvh`,
        `lvh`,
        `svh`,
        `min`,
        `max`,
        `fit`,
        ...C(),
      ],
      P = () => [e, Z, Y],
      ne = () => [...y(), ut, at, { position: [Z, Y] }],
      F = () => [`no-repeat`, { repeat: [``, `x`, `y`, `space`, `round`] }],
      I = () => [`auto`, `cover`, `contain`, dt, tt, { size: [Z, Y] }],
      L = () => [qe, ct, X],
      R = () => [``, `none`, `full`, l, Z, Y],
      z = () => [``, K, ct, X],
      re = () => [`solid`, `dashed`, `dotted`, `double`],
      B = () => [
        `normal`,
        `multiply`,
        `screen`,
        `overlay`,
        `darken`,
        `lighten`,
        `color-dodge`,
        `color-burn`,
        `hard-light`,
        `soft-light`,
        `difference`,
        `exclusion`,
        `hue`,
        `saturation`,
        `color`,
        `luminosity`,
      ],
      V = () => [K, qe, ut, at],
      ie = () => [``, `none`, p, Z, Y],
      H = () => [`none`, K, Z, Y],
      U = () => [`none`, K, Z, Y],
      ae = () => [K, Z, Y],
      oe = () => [G, `full`, ...C()];
    return {
      cacheSize: 500,
      theme: {
        animate: [`spin`, `ping`, `pulse`, `bounce`],
        aspect: [`video`],
        blur: [J],
        breakpoint: [J],
        color: [Je],
        container: [J],
        "drop-shadow": [J],
        ease: [`in`, `out`, `in-out`],
        font: [$e],
        "font-weight": [
          `thin`,
          `extralight`,
          `light`,
          `normal`,
          `medium`,
          `semibold`,
          `bold`,
          `extrabold`,
          `black`,
        ],
        "inset-shadow": [J],
        leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
        perspective: [
          `dramatic`,
          `near`,
          `normal`,
          `midrange`,
          `distant`,
          `none`,
        ],
        radius: [J],
        shadow: [J],
        spacing: [`px`, K],
        text: [J],
        "text-shadow": [J],
        tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`],
      },
      classGroups: {
        aspect: [{ aspect: [`auto`, `square`, G, Y, Z, h] }],
        container: [`container`],
        "container-type": [{ "@container": [``, `normal`, `size`, Z, Y] }],
        "container-named": [et],
        columns: [{ columns: [K, `auto`, Y, Z, s] }],
        "break-after": [{ "break-after": v() }],
        "break-before": [{ "break-before": v() }],
        "break-inside": [
          { "break-inside": [`auto`, `avoid`, `avoid-page`, `avoid-column`] },
        ],
        "box-decoration": [{ "box-decoration": [`slice`, `clone`] }],
        box: [{ box: [`border`, `content`] }],
        display: [
          `block`,
          `inline-block`,
          `inline`,
          `flex`,
          `inline-flex`,
          `table`,
          `inline-table`,
          `table-caption`,
          `table-cell`,
          `table-column`,
          `table-column-group`,
          `table-footer-group`,
          `table-header-group`,
          `table-row-group`,
          `table-row`,
          `flow-root`,
          `grid`,
          `inline-grid`,
          `contents`,
          `list-item`,
          `hidden`,
        ],
        sr: [`sr-only`, `not-sr-only`],
        float: [{ float: [`right`, `left`, `none`, `start`, `end`] }],
        clear: [{ clear: [`left`, `right`, `both`, `none`, `start`, `end`] }],
        isolation: [`isolate`, `isolation-auto`],
        "object-fit": [
          { object: [`contain`, `cover`, `fill`, `none`, `scale-down`] },
        ],
        "object-position": [{ object: b() }],
        overflow: [{ overflow: x() }],
        "overflow-x": [{ "overflow-x": x() }],
        "overflow-y": [{ "overflow-y": x() }],
        overscroll: [{ overscroll: S() }],
        "overscroll-x": [{ "overscroll-x": S() }],
        "overscroll-y": [{ "overscroll-y": S() }],
        position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
        inset: [{ inset: w() }],
        "inset-x": [{ "inset-x": w() }],
        "inset-y": [{ "inset-y": w() }],
        start: [{ "inset-s": w(), start: w() }],
        end: [{ "inset-e": w(), end: w() }],
        "inset-bs": [{ "inset-bs": w() }],
        "inset-be": [{ "inset-be": w() }],
        top: [{ top: w() }],
        right: [{ right: w() }],
        bottom: [{ bottom: w() }],
        left: [{ left: w() }],
        visibility: [`visible`, `invisible`, `collapse`],
        z: [{ z: [q, `auto`, Z, Y] }],
        basis: [{ basis: [G, `full`, `auto`, s, ...C()] }],
        "flex-direction": [
          { flex: [`row`, `row-reverse`, `col`, `col-reverse`] },
        ],
        "flex-wrap": [{ flex: [`nowrap`, `wrap`, `wrap-reverse`] }],
        flex: [{ flex: [K, G, `auto`, `initial`, `none`, Y] }],
        grow: [{ grow: [``, K, Z, Y] }],
        shrink: [{ shrink: [``, K, Z, Y] }],
        order: [{ order: [q, `first`, `last`, `none`, Z, Y] }],
        "grid-cols": [{ "grid-cols": T() }],
        "col-start-end": [{ col: E() }],
        "col-start": [{ "col-start": D() }],
        "col-end": [{ "col-end": D() }],
        "grid-rows": [{ "grid-rows": T() }],
        "row-start-end": [{ row: E() }],
        "row-start": [{ "row-start": D() }],
        "row-end": [{ "row-end": D() }],
        "grid-flow": [
          { "grid-flow": [`row`, `col`, `dense`, `row-dense`, `col-dense`] },
        ],
        "auto-cols": [{ "auto-cols": O() }],
        "auto-rows": [{ "auto-rows": O() }],
        gap: [{ gap: C() }],
        "gap-x": [{ "gap-x": C() }],
        "gap-y": [{ "gap-y": C() }],
        "justify-content": [{ justify: [...te(), `normal`] }],
        "justify-items": [{ "justify-items": [...k(), `normal`] }],
        "justify-self": [{ "justify-self": [`auto`, ...k()] }],
        "align-content": [{ content: [`normal`, ...te()] }],
        "align-items": [{ items: [...k(), { baseline: [``, `last`] }] }],
        "align-self": [{ self: [`auto`, ...k(), { baseline: [``, `last`] }] }],
        "place-content": [{ "place-content": te() }],
        "place-items": [{ "place-items": [...k(), `baseline`] }],
        "place-self": [{ "place-self": [`auto`, ...k()] }],
        p: [{ p: C() }],
        px: [{ px: C() }],
        py: [{ py: C() }],
        ps: [{ ps: C() }],
        pe: [{ pe: C() }],
        pbs: [{ pbs: C() }],
        pbe: [{ pbe: C() }],
        pt: [{ pt: C() }],
        pr: [{ pr: C() }],
        pb: [{ pb: C() }],
        pl: [{ pl: C() }],
        m: [{ m: A() }],
        mx: [{ mx: A() }],
        my: [{ my: A() }],
        ms: [{ ms: A() }],
        me: [{ me: A() }],
        mbs: [{ mbs: A() }],
        mbe: [{ mbe: A() }],
        mt: [{ mt: A() }],
        mr: [{ mr: A() }],
        mb: [{ mb: A() }],
        ml: [{ ml: A() }],
        "space-x": [{ "space-x": C() }],
        "space-x-reverse": [`space-x-reverse`],
        "space-y": [{ "space-y": C() }],
        "space-y-reverse": [`space-y-reverse`],
        size: [{ size: j() }],
        "inline-size": [{ inline: [`auto`, ...M()] }],
        "min-inline-size": [{ "min-inline": [`auto`, ...M()] }],
        "max-inline-size": [{ "max-inline": [`none`, ...M()] }],
        "block-size": [{ block: [`auto`, ...N()] }],
        "min-block-size": [{ "min-block": [`auto`, ...N()] }],
        "max-block-size": [{ "max-block": [`none`, ...N()] }],
        w: [{ w: [s, `screen`, ...j()] }],
        "min-w": [{ "min-w": [s, `screen`, `none`, ...j()] }],
        "max-w": [
          { "max-w": [s, `screen`, `none`, `prose`, { screen: [o] }, ...j()] },
        ],
        h: [{ h: [`screen`, `lh`, ...j()] }],
        "min-h": [{ "min-h": [`screen`, `lh`, `none`, ...j()] }],
        "max-h": [{ "max-h": [`screen`, `lh`, `none`, ...j()] }],
        "font-size": [{ text: [`base`, n, ct, X] }],
        "font-smoothing": [`antialiased`, `subpixel-antialiased`],
        "font-style": [`italic`, `not-italic`],
        "font-weight": [{ font: [r, mt, rt] }],
        "font-stretch": [
          {
            "font-stretch": [
              `ultra-condensed`,
              `extra-condensed`,
              `condensed`,
              `semi-condensed`,
              `normal`,
              `semi-expanded`,
              `expanded`,
              `extra-expanded`,
              `ultra-expanded`,
              qe,
              Y,
            ],
          },
        ],
        "font-family": [{ font: [lt, it, t] }],
        "font-features": [{ "font-features": [Y] }],
        "fvn-normal": [`normal-nums`],
        "fvn-ordinal": [`ordinal`],
        "fvn-slashed-zero": [`slashed-zero`],
        "fvn-figure": [`lining-nums`, `oldstyle-nums`],
        "fvn-spacing": [`proportional-nums`, `tabular-nums`],
        "fvn-fraction": [`diagonal-fractions`, `stacked-fractions`],
        tracking: [{ tracking: [i, Z, Y] }],
        "line-clamp": [{ "line-clamp": [K, `none`, Z, nt] }],
        leading: [{ leading: [`none`, a, ...C()] }],
        "list-image": [{ "list-image": [`none`, Z, Y] }],
        "list-style-position": [{ list: [`inside`, `outside`] }],
        "list-style-type": [{ list: [`disc`, `decimal`, `none`, Z, Y] }],
        "text-alignment": [
          { text: [`left`, `center`, `right`, `justify`, `start`, `end`] },
        ],
        "placeholder-color": [{ placeholder: P() }],
        "text-color": [{ text: P() }],
        "text-decoration": [
          `underline`,
          `overline`,
          `line-through`,
          `no-underline`,
        ],
        "text-decoration-style": [{ decoration: [...re(), `wavy`] }],
        "text-decoration-thickness": [
          { decoration: [K, `from-font`, `auto`, Z, X] },
        ],
        "text-decoration-color": [{ decoration: P() }],
        "underline-offset": [{ "underline-offset": [K, `auto`, Z, Y] }],
        "text-transform": [
          `uppercase`,
          `lowercase`,
          `capitalize`,
          `normal-case`,
        ],
        "text-overflow": [`truncate`, `text-ellipsis`, `text-clip`],
        "text-wrap": [{ text: [`wrap`, `nowrap`, `balance`, `pretty`] }],
        indent: [{ indent: C() }],
        "tab-size": [{ tab: [q, Z, Y] }],
        "vertical-align": [
          {
            align: [
              `baseline`,
              `top`,
              `middle`,
              `bottom`,
              `text-top`,
              `text-bottom`,
              `sub`,
              `super`,
              Z,
              Y,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              `normal`,
              `nowrap`,
              `pre`,
              `pre-line`,
              `pre-wrap`,
              `break-spaces`,
            ],
          },
        ],
        break: [{ break: [`normal`, `words`, `all`, `keep`] }],
        wrap: [{ wrap: [`break-word`, `anywhere`, `normal`] }],
        hyphens: [{ hyphens: [`none`, `manual`, `auto`] }],
        content: [{ content: [`none`, Z, Y] }],
        "bg-attachment": [{ bg: [`fixed`, `local`, `scroll`] }],
        "bg-clip": [{ "bg-clip": [`border`, `padding`, `content`, `text`] }],
        "bg-origin": [{ "bg-origin": [`border`, `padding`, `content`] }],
        "bg-position": [{ bg: ne() }],
        "bg-repeat": [{ bg: F() }],
        "bg-size": [{ bg: I() }],
        "bg-image": [
          {
            bg: [
              `none`,
              {
                linear: [
                  { to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`] },
                  q,
                  Z,
                  Y,
                ],
                radial: [``, Z, Y],
                conic: [``, q, Z, Y],
              },
              ft,
              ot,
            ],
          },
        ],
        "bg-color": [{ bg: P() }],
        "gradient-from-pos": [{ from: L() }],
        "gradient-via-pos": [{ via: L() }],
        "gradient-to-pos": [{ to: L() }],
        "gradient-from": [{ from: P() }],
        "gradient-via": [{ via: P() }],
        "gradient-to": [{ to: P() }],
        rounded: [{ rounded: R() }],
        "rounded-s": [{ "rounded-s": R() }],
        "rounded-e": [{ "rounded-e": R() }],
        "rounded-t": [{ "rounded-t": R() }],
        "rounded-r": [{ "rounded-r": R() }],
        "rounded-b": [{ "rounded-b": R() }],
        "rounded-l": [{ "rounded-l": R() }],
        "rounded-ss": [{ "rounded-ss": R() }],
        "rounded-se": [{ "rounded-se": R() }],
        "rounded-ee": [{ "rounded-ee": R() }],
        "rounded-es": [{ "rounded-es": R() }],
        "rounded-tl": [{ "rounded-tl": R() }],
        "rounded-tr": [{ "rounded-tr": R() }],
        "rounded-br": [{ "rounded-br": R() }],
        "rounded-bl": [{ "rounded-bl": R() }],
        "border-w": [{ border: z() }],
        "border-w-x": [{ "border-x": z() }],
        "border-w-y": [{ "border-y": z() }],
        "border-w-s": [{ "border-s": z() }],
        "border-w-e": [{ "border-e": z() }],
        "border-w-bs": [{ "border-bs": z() }],
        "border-w-be": [{ "border-be": z() }],
        "border-w-t": [{ "border-t": z() }],
        "border-w-r": [{ "border-r": z() }],
        "border-w-b": [{ "border-b": z() }],
        "border-w-l": [{ "border-l": z() }],
        "divide-x": [{ "divide-x": z() }],
        "divide-x-reverse": [`divide-x-reverse`],
        "divide-y": [{ "divide-y": z() }],
        "divide-y-reverse": [`divide-y-reverse`],
        "border-style": [{ border: [...re(), `hidden`, `none`] }],
        "divide-style": [{ divide: [...re(), `hidden`, `none`] }],
        "border-color": [{ border: P() }],
        "border-color-x": [{ "border-x": P() }],
        "border-color-y": [{ "border-y": P() }],
        "border-color-s": [{ "border-s": P() }],
        "border-color-e": [{ "border-e": P() }],
        "border-color-bs": [{ "border-bs": P() }],
        "border-color-be": [{ "border-be": P() }],
        "border-color-t": [{ "border-t": P() }],
        "border-color-r": [{ "border-r": P() }],
        "border-color-b": [{ "border-b": P() }],
        "border-color-l": [{ "border-l": P() }],
        "divide-color": [{ divide: P() }],
        "outline-style": [{ outline: [...re(), `none`, `hidden`] }],
        "outline-offset": [{ "outline-offset": [K, Z, Y] }],
        "outline-w": [{ outline: [``, K, ct, X] }],
        "outline-color": [{ outline: P() }],
        shadow: [{ shadow: [``, `inner`, `none`, u, pt, st] }],
        "shadow-color": [{ shadow: P() }],
        "inset-shadow": [{ "inset-shadow": [`none`, d, pt, st] }],
        "inset-shadow-color": [{ "inset-shadow": P() }],
        "ring-w": [{ ring: z() }],
        "ring-w-inset": [`ring-inset`],
        "ring-color": [{ ring: P() }],
        "ring-offset-w": [{ "ring-offset": [K, X] }],
        "ring-offset-color": [{ "ring-offset": P() }],
        "inset-ring-w": [{ "inset-ring": z() }],
        "inset-ring-color": [{ "inset-ring": P() }],
        "text-shadow": [{ "text-shadow": [`none`, ee, pt, st] }],
        "text-shadow-color": [{ "text-shadow": P() }],
        opacity: [{ opacity: [K, Z, Y] }],
        "mix-blend": [{ "mix-blend": [...B(), `plus-darker`, `plus-lighter`] }],
        "bg-blend": [{ "bg-blend": B() }],
        "mask-clip": [
          {
            "mask-clip": [
              `border`,
              `padding`,
              `content`,
              `fill`,
              `stroke`,
              `view`,
            ],
          },
          `mask-no-clip`,
        ],
        "mask-composite": [
          { mask: [`add`, `subtract`, `intersect`, `exclude`] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [K] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": V() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": V() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": P() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": P() }],
        "mask-image-t-from-pos": [{ "mask-t-from": V() }],
        "mask-image-t-to-pos": [{ "mask-t-to": V() }],
        "mask-image-t-from-color": [{ "mask-t-from": P() }],
        "mask-image-t-to-color": [{ "mask-t-to": P() }],
        "mask-image-r-from-pos": [{ "mask-r-from": V() }],
        "mask-image-r-to-pos": [{ "mask-r-to": V() }],
        "mask-image-r-from-color": [{ "mask-r-from": P() }],
        "mask-image-r-to-color": [{ "mask-r-to": P() }],
        "mask-image-b-from-pos": [{ "mask-b-from": V() }],
        "mask-image-b-to-pos": [{ "mask-b-to": V() }],
        "mask-image-b-from-color": [{ "mask-b-from": P() }],
        "mask-image-b-to-color": [{ "mask-b-to": P() }],
        "mask-image-l-from-pos": [{ "mask-l-from": V() }],
        "mask-image-l-to-pos": [{ "mask-l-to": V() }],
        "mask-image-l-from-color": [{ "mask-l-from": P() }],
        "mask-image-l-to-color": [{ "mask-l-to": P() }],
        "mask-image-x-from-pos": [{ "mask-x-from": V() }],
        "mask-image-x-to-pos": [{ "mask-x-to": V() }],
        "mask-image-x-from-color": [{ "mask-x-from": P() }],
        "mask-image-x-to-color": [{ "mask-x-to": P() }],
        "mask-image-y-from-pos": [{ "mask-y-from": V() }],
        "mask-image-y-to-pos": [{ "mask-y-to": V() }],
        "mask-image-y-from-color": [{ "mask-y-from": P() }],
        "mask-image-y-to-color": [{ "mask-y-to": P() }],
        "mask-image-radial": [{ "mask-radial": [Z, Y] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": V() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": V() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": P() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": P() }],
        "mask-image-radial-shape": [{ "mask-radial": [`circle`, `ellipse`] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: [`side`, `corner`], farthest: [`side`, `corner`] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": y() }],
        "mask-image-conic-pos": [{ "mask-conic": [K] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": V() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": V() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": P() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": P() }],
        "mask-mode": [{ mask: [`alpha`, `luminance`, `match`] }],
        "mask-origin": [
          {
            "mask-origin": [
              `border`,
              `padding`,
              `content`,
              `fill`,
              `stroke`,
              `view`,
            ],
          },
        ],
        "mask-position": [{ mask: ne() }],
        "mask-repeat": [{ mask: F() }],
        "mask-size": [{ mask: I() }],
        "mask-type": [{ "mask-type": [`alpha`, `luminance`] }],
        "mask-image": [{ mask: [`none`, Z, Y] }],
        filter: [{ filter: [``, `none`, Z, Y] }],
        blur: [{ blur: ie() }],
        brightness: [{ brightness: [K, Z, Y] }],
        contrast: [{ contrast: [K, Z, Y] }],
        "drop-shadow": [{ "drop-shadow": [``, `none`, f, pt, st] }],
        "drop-shadow-color": [{ "drop-shadow": P() }],
        grayscale: [{ grayscale: [``, K, Z, Y] }],
        "hue-rotate": [{ "hue-rotate": [K, Z, Y] }],
        invert: [{ invert: [``, K, Z, Y] }],
        saturate: [{ saturate: [K, Z, Y] }],
        sepia: [{ sepia: [``, K, Z, Y] }],
        "backdrop-filter": [{ "backdrop-filter": [``, `none`, Z, Y] }],
        "backdrop-blur": [{ "backdrop-blur": ie() }],
        "backdrop-brightness": [{ "backdrop-brightness": [K, Z, Y] }],
        "backdrop-contrast": [{ "backdrop-contrast": [K, Z, Y] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": [``, K, Z, Y] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [K, Z, Y] }],
        "backdrop-invert": [{ "backdrop-invert": [``, K, Z, Y] }],
        "backdrop-opacity": [{ "backdrop-opacity": [K, Z, Y] }],
        "backdrop-saturate": [{ "backdrop-saturate": [K, Z, Y] }],
        "backdrop-sepia": [{ "backdrop-sepia": [``, K, Z, Y] }],
        "border-collapse": [{ border: [`collapse`, `separate`] }],
        "border-spacing": [{ "border-spacing": C() }],
        "border-spacing-x": [{ "border-spacing-x": C() }],
        "border-spacing-y": [{ "border-spacing-y": C() }],
        "table-layout": [{ table: [`auto`, `fixed`] }],
        caption: [{ caption: [`top`, `bottom`] }],
        transition: [
          {
            transition: [
              ``,
              `all`,
              `colors`,
              `opacity`,
              `shadow`,
              `transform`,
              `none`,
              Z,
              Y,
            ],
          },
        ],
        "transition-behavior": [{ transition: [`normal`, `discrete`] }],
        duration: [{ duration: [K, `initial`, Z, Y] }],
        ease: [{ ease: [`linear`, `initial`, g, Z, Y] }],
        delay: [{ delay: [K, Z, Y] }],
        animate: [{ animate: [`none`, _, Z, Y] }],
        backface: [{ backface: [`hidden`, `visible`] }],
        perspective: [{ perspective: [m, Z, Y] }],
        "perspective-origin": [{ "perspective-origin": b() }],
        rotate: [{ rotate: H() }],
        "rotate-x": [{ "rotate-x": H() }],
        "rotate-y": [{ "rotate-y": H() }],
        "rotate-z": [{ "rotate-z": H() }],
        scale: [{ scale: U() }],
        "scale-x": [{ "scale-x": U() }],
        "scale-y": [{ "scale-y": U() }],
        "scale-z": [{ "scale-z": U() }],
        "scale-3d": [`scale-3d`],
        skew: [{ skew: ae() }],
        "skew-x": [{ "skew-x": ae() }],
        "skew-y": [{ "skew-y": ae() }],
        transform: [{ transform: [Z, Y, ``, `none`, `gpu`, `cpu`] }],
        "transform-origin": [{ origin: b() }],
        "transform-style": [{ transform: [`3d`, `flat`] }],
        translate: [{ translate: oe() }],
        "translate-x": [{ "translate-x": oe() }],
        "translate-y": [{ "translate-y": oe() }],
        "translate-z": [{ "translate-z": oe() }],
        "translate-none": [`translate-none`],
        zoom: [{ zoom: [q, Z, Y] }],
        accent: [{ accent: P() }],
        appearance: [{ appearance: [`none`, `auto`] }],
        "caret-color": [{ caret: P() }],
        "color-scheme": [
          {
            scheme: [
              `normal`,
              `dark`,
              `light`,
              `light-dark`,
              `only-dark`,
              `only-light`,
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              `auto`,
              `default`,
              `pointer`,
              `wait`,
              `text`,
              `move`,
              `help`,
              `not-allowed`,
              `none`,
              `context-menu`,
              `progress`,
              `cell`,
              `crosshair`,
              `vertical-text`,
              `alias`,
              `copy`,
              `no-drop`,
              `grab`,
              `grabbing`,
              `all-scroll`,
              `col-resize`,
              `row-resize`,
              `n-resize`,
              `e-resize`,
              `s-resize`,
              `w-resize`,
              `ne-resize`,
              `nw-resize`,
              `se-resize`,
              `sw-resize`,
              `ew-resize`,
              `ns-resize`,
              `nesw-resize`,
              `nwse-resize`,
              `zoom-in`,
              `zoom-out`,
              Z,
              Y,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": [`fixed`, `content`] }],
        "pointer-events": [{ "pointer-events": [`auto`, `none`] }],
        resize: [{ resize: [`none`, ``, `y`, `x`] }],
        "scroll-behavior": [{ scroll: [`auto`, `smooth`] }],
        "scrollbar-thumb-color": [{ "scrollbar-thumb": P() }],
        "scrollbar-track-color": [{ "scrollbar-track": P() }],
        "scrollbar-gutter": [
          { "scrollbar-gutter": [`auto`, `stable`, `both`] },
        ],
        "scrollbar-w": [{ scrollbar: [`auto`, `thin`, `none`] }],
        "scroll-m": [{ "scroll-m": C() }],
        "scroll-mx": [{ "scroll-mx": C() }],
        "scroll-my": [{ "scroll-my": C() }],
        "scroll-ms": [{ "scroll-ms": C() }],
        "scroll-me": [{ "scroll-me": C() }],
        "scroll-mbs": [{ "scroll-mbs": C() }],
        "scroll-mbe": [{ "scroll-mbe": C() }],
        "scroll-mt": [{ "scroll-mt": C() }],
        "scroll-mr": [{ "scroll-mr": C() }],
        "scroll-mb": [{ "scroll-mb": C() }],
        "scroll-ml": [{ "scroll-ml": C() }],
        "scroll-p": [{ "scroll-p": C() }],
        "scroll-px": [{ "scroll-px": C() }],
        "scroll-py": [{ "scroll-py": C() }],
        "scroll-ps": [{ "scroll-ps": C() }],
        "scroll-pe": [{ "scroll-pe": C() }],
        "scroll-pbs": [{ "scroll-pbs": C() }],
        "scroll-pbe": [{ "scroll-pbe": C() }],
        "scroll-pt": [{ "scroll-pt": C() }],
        "scroll-pr": [{ "scroll-pr": C() }],
        "scroll-pb": [{ "scroll-pb": C() }],
        "scroll-pl": [{ "scroll-pl": C() }],
        "snap-align": [{ snap: [`start`, `end`, `center`, `align-none`] }],
        "snap-stop": [{ snap: [`normal`, `always`] }],
        "snap-type": [{ snap: [`none`, `x`, `y`, `both`] }],
        "snap-strictness": [{ snap: [`mandatory`, `proximity`] }],
        touch: [{ touch: [`auto`, `none`, `manipulation`] }],
        "touch-x": [{ "touch-pan": [`x`, `left`, `right`] }],
        "touch-y": [{ "touch-pan": [`y`, `up`, `down`] }],
        "touch-pz": [`touch-pinch-zoom`],
        select: [{ select: [`none`, `text`, `all`, `auto`] }],
        "will-change": [
          { "will-change": [`auto`, `scroll`, `contents`, `transform`, Z, Y] },
        ],
        fill: [{ fill: [`none`, ...P()] }],
        "stroke-w": [{ stroke: [K, ct, X, nt] }],
        stroke: [{ stroke: [`none`, ...P()] }],
        "forced-color-adjust": [{ "forced-color-adjust": [`auto`, `none`] }],
      },
      conflictingClassGroups: {
        "container-named": [`container-type`],
        overflow: [`overflow-x`, `overflow-y`],
        overscroll: [`overscroll-x`, `overscroll-y`],
        inset: [
          `inset-x`,
          `inset-y`,
          `inset-bs`,
          `inset-be`,
          `start`,
          `end`,
          `top`,
          `right`,
          `bottom`,
          `left`,
        ],
        "inset-x": [`start`, `end`, `right`, `left`],
        "inset-y": [`inset-bs`, `inset-be`, `top`, `bottom`],
        flex: [`basis`, `grow`, `shrink`],
        gap: [`gap-x`, `gap-y`],
        p: [`px`, `py`, `ps`, `pe`, `pbs`, `pbe`, `pt`, `pr`, `pb`, `pl`],
        px: [`ps`, `pe`, `pr`, `pl`],
        py: [`pbs`, `pbe`, `pt`, `pb`],
        m: [`mx`, `my`, `ms`, `me`, `mbs`, `mbe`, `mt`, `mr`, `mb`, `ml`],
        mx: [`ms`, `me`, `mr`, `ml`],
        my: [`mbs`, `mbe`, `mt`, `mb`],
        size: [`w`, `h`],
        "font-size": [`leading`],
        "fvn-normal": [
          `fvn-ordinal`,
          `fvn-slashed-zero`,
          `fvn-figure`,
          `fvn-spacing`,
          `fvn-fraction`,
        ],
        "fvn-ordinal": [`fvn-normal`],
        "fvn-slashed-zero": [`fvn-normal`],
        "fvn-figure": [`fvn-normal`],
        "fvn-spacing": [`fvn-normal`],
        "fvn-fraction": [`fvn-normal`],
        "line-clamp": [`display`, `overflow`],
        rounded: [
          `rounded-s`,
          `rounded-e`,
          `rounded-t`,
          `rounded-r`,
          `rounded-b`,
          `rounded-l`,
          `rounded-ss`,
          `rounded-se`,
          `rounded-ee`,
          `rounded-es`,
          `rounded-tl`,
          `rounded-tr`,
          `rounded-br`,
          `rounded-bl`,
        ],
        "rounded-s": [`rounded-ss`, `rounded-es`],
        "rounded-e": [`rounded-se`, `rounded-ee`],
        "rounded-t": [`rounded-tl`, `rounded-tr`],
        "rounded-r": [`rounded-tr`, `rounded-br`],
        "rounded-b": [`rounded-br`, `rounded-bl`],
        "rounded-l": [`rounded-tl`, `rounded-bl`],
        "border-spacing": [`border-spacing-x`, `border-spacing-y`],
        "border-w": [
          `border-w-x`,
          `border-w-y`,
          `border-w-s`,
          `border-w-e`,
          `border-w-bs`,
          `border-w-be`,
          `border-w-t`,
          `border-w-r`,
          `border-w-b`,
          `border-w-l`,
        ],
        "border-w-x": [`border-w-s`, `border-w-e`, `border-w-r`, `border-w-l`],
        "border-w-y": [
          `border-w-bs`,
          `border-w-be`,
          `border-w-t`,
          `border-w-b`,
        ],
        "border-color": [
          `border-color-x`,
          `border-color-y`,
          `border-color-s`,
          `border-color-e`,
          `border-color-bs`,
          `border-color-be`,
          `border-color-t`,
          `border-color-r`,
          `border-color-b`,
          `border-color-l`,
        ],
        "border-color-x": [
          `border-color-s`,
          `border-color-e`,
          `border-color-r`,
          `border-color-l`,
        ],
        "border-color-y": [
          `border-color-bs`,
          `border-color-be`,
          `border-color-t`,
          `border-color-b`,
        ],
        translate: [`translate-x`, `translate-y`, `translate-none`],
        "translate-none": [
          `translate`,
          `translate-x`,
          `translate-y`,
          `translate-z`,
        ],
        "scroll-m": [
          `scroll-mx`,
          `scroll-my`,
          `scroll-ms`,
          `scroll-me`,
          `scroll-mbs`,
          `scroll-mbe`,
          `scroll-mt`,
          `scroll-mr`,
          `scroll-mb`,
          `scroll-ml`,
        ],
        "scroll-mx": [`scroll-ms`, `scroll-me`, `scroll-mr`, `scroll-ml`],
        "scroll-my": [`scroll-mbs`, `scroll-mbe`, `scroll-mt`, `scroll-mb`],
        "scroll-p": [
          `scroll-px`,
          `scroll-py`,
          `scroll-ps`,
          `scroll-pe`,
          `scroll-pbs`,
          `scroll-pbe`,
          `scroll-pt`,
          `scroll-pr`,
          `scroll-pb`,
          `scroll-pl`,
        ],
        "scroll-px": [`scroll-ps`, `scroll-pe`, `scroll-pr`, `scroll-pl`],
        "scroll-py": [`scroll-pbs`, `scroll-pbe`, `scroll-pt`, `scroll-pb`],
        touch: [`touch-x`, `touch-y`, `touch-pz`],
        "touch-x": [`touch`],
        "touch-y": [`touch`],
        "touch-pz": [`touch`],
      },
      conflictingClassGroupModifiers: { "font-size": [`leading`] },
      postfixLookupClassGroups: [`container-type`],
      orderSensitiveModifiers: [
        `*`,
        `**`,
        `after`,
        `backdrop`,
        `before`,
        `details-content`,
        `file`,
        `first-letter`,
        `first-line`,
        `marker`,
        `placeholder`,
        `selection`,
      ],
    };
  });
function wt(...e) {
  return Ct(ie(e));
}
var Tt = ee(),
  Et = ae(
    `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,
    {
      variants: {
        variant: {
          default: `bg-primary text-primary-foreground shadow hover:bg-primary/90`,
          destructive: `bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90`,
          outline: `border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground`,
          secondary: `bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80`,
          ghost: `hover:bg-accent hover:text-accent-foreground`,
          link: `text-primary underline-offset-4 hover:underline`,
        },
        size: {
          default: `h-9 px-4 py-2`,
          sm: `h-8 rounded-md px-3 text-xs`,
          lg: `h-10 rounded-md px-8`,
          icon: `h-9 w-9`,
        },
      },
      defaultVariants: { variant: `default`, size: `default` },
    },
  ),
  Dt = f.forwardRef(
    ({ className: e, variant: t, size: n, asChild: r = !1, ...i }, a) =>
      (0, Tt.jsx)(r ? te : `button`, {
        className: wt(Et({ variant: t, size: n, className: e })),
        ref: a,
        ...i,
      }),
  );
Dt.displayName = `Button`;
export {
  O as a,
  b as c,
  o as d,
  c as f,
  ae as i,
  ee as l,
  Et as n,
  A as o,
  wt as r,
  T as s,
  Dt as t,
  u,
};
