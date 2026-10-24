import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "./@radix-ui/react-accordion+[...].mjs";
import {
  a as noop,
  i as notifyManager,
  n as MutationObserver,
  o as shouldThrowError,
  r as QueryObserver,
} from "./tanstack__query-core.mjs";
//#region node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
 * The context that `useQueryClient` reads from. `QueryClientProvider` is the normal way to set it.
 */
var QueryClientContext = import_react.createContext(void 0);
/**
 * The `useQueryClient` hook returns the current `QueryClient` instance.
 * @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
 * be used.
 * @returns The current `QueryClient` instance.
 * @throws {Error} If no `queryClient` argument is passed and no `QueryClientProvider` is found in the
 * component tree.
 */
var useQueryClient = (queryClient) => {
  const client = import_react.useContext(QueryClientContext);
  if (queryClient) return queryClient;
  if (!client)
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  return client;
};
/**
 * Use the `QueryClientProvider` component to connect and provide a `QueryClient` to your application. Also
 * calls `client.mount()`/`client.unmount()` as this component mounts/unmounts, which subscribes the client to
 * focus/online events (resuming any paused mutations and refetching as needed when the app regains focus or
 * comes back online).
 * @param props - The `client` to provide, and the `children` that get access to it.
 * @returns The provided `children`, wrapped so they can read the `QueryClient` via `useQueryClient`.
 * @example
 * ```tsx
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 *
 * const queryClient = new QueryClient()
 *
 * function App() {
 *   return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
 * }
 * ```
 */
var QueryClientProvider = ({ client, children }) => {
  import_react.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    QueryClientContext.Provider,
    {
      value: client,
      children,
    },
  );
};
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js
var IsRestoringContext = import_react.createContext(false);
/**
 * If you are using `PersistQueryClientProvider`, you can also use the `useIsRestoring` hook alongside it to
 * check if a restore is currently in progress. `useQuery` and friends also check this internally to avoid
 * race conditions between the restore and mounting queries.
 * @returns `true` while a persisted client is being restored, `false` otherwise.
 */
var useIsRestoring = () => import_react.useContext(IsRestoringContext);
IsRestoringContext.Provider;
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
/**
 * Creates the value shared through the boundary's context, which tracks whether a reset was
 * requested.
 * @returns The `clearReset`, `isReset`, and `reset` functions of the boundary.
 */
function createValue() {
  let isReset = false;
  return {
    /**
     * Clears the reset state, so queries know not to try again until the boundary is reset again.
     */
    clearReset: () => {
      isReset = false;
    },
    /**
     * Resets any query errors within the boundary, so queries know they can try again.
     */
    reset: () => {
      isReset = true;
    },
    /**
     * Returns whether the boundary has been reset and not yet cleared.
     * @returns `true` if the boundary has been reset and not yet cleared.
     */
    isReset: () => {
      return isReset;
    },
  };
}
var QueryErrorResetBoundaryContext = import_react.createContext(createValue());
/**
 * This hook will reset any query errors within the closest `QueryErrorResetBoundary`. If there is no boundary
 * defined it will reset them globally.
 * @returns The boundary's {@link QueryErrorResetBoundaryValue}.
 * @example
 * ```tsx
 * import { ErrorBoundary } from 'react-error-boundary'
 * import { useQueryErrorResetBoundary } from '@tanstack/react-query'
 *
 * function App({ children }: { children: React.ReactNode }) {
 *   const { reset } = useQueryErrorResetBoundary()
 *
 *   return (
 *     <ErrorBoundary
 *       onReset={reset}
 *       fallbackRender={({ resetErrorBoundary }) => (
 *         <div>
 *           There was an error!
 *           <button onClick={() => resetErrorBoundary()}>Try again</button>
 *         </div>
 *       )}
 *     >
 *       {children}
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */
var useQueryErrorResetBoundary = () =>
  import_react.useContext(QueryErrorResetBoundaryContext);
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
/**
 * Turns off `retryOnMount` for a query that throws its errors (with `suspense` or `throwOnError`),
 * unless the error boundary has been reset, so a remount doesn't retry the failed query before the
 * user resets the boundary. Mutates the options.
 * @param options - The defaulted query options to adjust.
 * @param errorResetBoundary - The value of the nearest `QueryErrorResetBoundary`.
 * @param query - The query, used to evaluate a `throwOnError` function against its error.
 */
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError =
    query?.state.status === "error" &&
    typeof options.throwOnError === "function"
      ? shouldThrowError(options.throwOnError, [query.state.error, query])
      : options.throwOnError;
  if (options.suspense || throwOnError) {
    if (!errorResetBoundary.isReset()) options.retryOnMount = false;
  }
};
/**
 * Clears the reset state of the error boundary after the component mounts, so later errors are
 * thrown to the boundary again.
 * @param errorResetBoundary - The value of the nearest `QueryErrorResetBoundary`.
 */
var useClearResetErrorBoundary = (errorResetBoundary) => {
  import_react.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
/**
 * Checks whether the query error should be thrown to the nearest error boundary: the query errored
 * and isn't fetching, the boundary hasn't been reset, and either `suspense` is enabled with no data
 * or `throwOnError` says so.
 * @param params - The observer `result`, the `errorResetBoundary`, the `throwOnError` option, the
 * `query`, and the `suspense` option.
 * @returns `true` if the error should be thrown.
 */
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense,
}) => {
  return (
    result.isError &&
    !errorResetBoundary.isReset() &&
    !result.isFetching &&
    query &&
    ((suspense && result.data === void 0) ||
      shouldThrowError(throwOnError, [result.error, query]))
  );
};
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/suspense.js
/**
 * Raises `staleTime` and a numeric `gcTime` to at least 1000ms when `suspense` is enabled, so a
 * component that remounts after suspending doesn't refetch right away or find the query garbage
 * collected. A `'static'` `staleTime` is kept as is. Mutates the options.
 * @param defaultedOptions - The defaulted query options to adjust.
 */
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) =>
      value === "static"
        ? value
        : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime =
      typeof originalStaleTime === "function"
        ? (...args) => clamp(originalStaleTime(...args))
        : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number")
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS,
      );
  }
};
/**
 * Checks whether a query should suspend: `suspense` is enabled and the result is still `pending`.
 * @param defaultedOptions - The defaulted query options, if any.
 * @param result - The current result of the observer.
 * @returns `true` if the component should suspend.
 */
var shouldSuspend = (defaultedOptions, result) =>
  defaultedOptions?.suspense && result.isPending;
/**
 * Fetches the query for a suspending component, without affecting the observer's own result. If
 * the fetch fails, the reset state of the error boundary is cleared, so the error is thrown to it.
 * @param defaultedOptions - The defaulted query options to fetch with.
 * @param observer - The observer of the query.
 * @param errorResetBoundary - The value of the nearest `QueryErrorResetBoundary`.
 * @returns A promise that resolves once the fetch settles. It never rejects.
 */
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) =>
  observer.fetchOptimistic(defaultedOptions).catch(() => {
    errorResetBoundary.clearReset();
  });
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
/**
 * Base implementation shared by `useQuery`, `useInfiniteQuery`, `useSuspenseQuery`, and
 * `useSuspenseInfiniteQuery`.
 * @param options - The options passed to the calling hook.
 * @param Observer - The observer class from query-core (`QueryObserver` or
 * `InfiniteQueryObserver`).
 * @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest
 * context will be used.
 * @returns The query result, tracking which properties are read unless `notifyOnChangeProps` is
 * set.
 * @throws {Error} If `options` is not an object (outside production), or the query error when it should be
 * thrown to the nearest error boundary (see `throwOnError`). While suspending, it throws a promise instead.
 */
function useBaseQuery(options, Observer, queryClient) {
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient(queryClient);
  const defaultedOptions = client.defaultQueryOptions(options);
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  const subscribed = options.subscribed !== false;
  defaultedOptions._optimisticResults = isRestoring
    ? "isRestoring"
    : subscribed
      ? "optimistic"
      : void 0;
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const [observer] = import_react.useState(
    () => new Observer(client, defaultedOptions),
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && subscribed;
  import_react.useSyncExternalStore(
    import_react.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe
          ? observer.subscribe(notifyManager.batchCalls(onStoreChange))
          : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe],
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult(),
  );
  import_react.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result))
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  if (
    getHasError({
      result,
      errorResetBoundary,
      throwOnError: defaultedOptions.throwOnError,
      query,
      suspense: defaultedOptions.suspense,
    })
  )
    throw result.error;
  return !defaultedOptions.notifyOnChangeProps
    ? observer.trackResult(result)
    : result;
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver, queryClient);
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useMutation.js
/**
 * Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects.
 * `useMutation` is the hook for that.
 * @param options - The {@link UseMutationOptions} to use — everything you can pass to `useMutation`.
 * @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
 * be used.
 * @returns `mutate`/`mutateAsync` also accept per-call `onSuccess`/`onError`/`onSettled` callbacks as a second
 * argument, useful for triggering call-site side effects (e.g. navigation) without coupling them to the shared
 * mutation definition. Hook-level callbacks (passed to `options`) fire for every mutation; per-call callbacks
 * fire only for the latest call you've made, and only while the component is still mounted — unmounting before
 * the mutation settles removes the subscription and prevents them from firing.
 * @throws {Error} The mutation error, when `throwOnError` is `true` or returns `true` for it, so that it is
 * thrown to the nearest error boundary.
 * @see {@link mutationOptions} to share these options across multiple `useMutation` call sites, or to look
 * the mutation up elsewhere via its `mutationKey` (e.g. with `useMutationState`).
 * @example
 * ```tsx
 * import { useMutation, useQueryClient } from '@tanstack/react-query'
 *
 * function AddTodo() {
 *   const queryClient = useQueryClient()
 *
 *   const addMutation = useMutation({
 *     mutationFn: addTodo,
 *     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
 *   })
 *
 *   return (
 *     <button
 *       onClick={() =>
 *         addMutation.mutate('Item', {
 *           onError: (error) => console.error('Failed to add item:', error),
 *         })
 *       }
 *     >
 *       Add
 *     </button>
 *   )
 * }
 * ```
 * @example
 * Rendering the mutation's own state, rather than just firing it off:
 * ```tsx
 * import { useMutation, useQueryClient } from '@tanstack/react-query'
 *
 * function AddTodo() {
 *   const queryClient = useQueryClient()
 *
 *   const addMutation = useMutation({
 *     mutationFn: addTodo,
 *     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
 *   })
 *
 *   return (
 *     <div>
 *       {addMutation.isPending ? (
 *         'Adding todo...'
 *       ) : (
 *         <>
 *           {addMutation.isError ? (
 *             <div>An error occurred: {addMutation.error.message}</div>
 *           ) : null}
 *           <button onClick={() => addMutation.mutate('Item')}>Add</button>
 *         </>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 * @example
 * Optimistic update via `onMutate`, rolling back on `onError`:
 * ```tsx
 * import { useMutation, useQueryClient } from '@tanstack/react-query'
 *
 * function AddTodo() {
 *   const queryClient = useQueryClient()
 *
 *   const addMutation = useMutation({
 *     mutationFn: addTodo,
 *     onMutate: async (newTodo) => {
 *       await queryClient.cancelQueries({ queryKey: ['todos'] })
 *       const previousTodos = queryClient.getQueryData<Array<string>>(['todos'])
 *
 *       queryClient.setQueryData<Array<string>>(['todos'], (old) => [
 *         ...(old ?? []),
 *         newTodo,
 *       ])
 *
 *       // Passed to `onError` as `onMutateResult` if the mutation fails.
 *       return { previousTodos }
 *     },
 *     onError: (_err, _newTodo, onMutateResult) => {
 *       queryClient.setQueryData(['todos'], onMutateResult?.previousTodos)
 *     },
 *     onSettled: () => {
 *       queryClient.invalidateQueries({ queryKey: ['todos'] })
 *     },
 *   })
 *
 *   return (
 *     <button onClick={() => addMutation.mutate('Item')}>Add</button>
 *   )
 * }
 * ```
 * @example
 * Callbacks passed per call to `mutate` only fire for the last call — `mutateAsync` gives you a
 * promise per call instead, so you can wait for all of them when they succeed:
 * ```tsx
 * import { useMutation, useQueryClient } from '@tanstack/react-query'
 *
 * function AddTodos() {
 *   const queryClient = useQueryClient()
 *
 *   const addMutation = useMutation({
 *     mutationFn: addTodo,
 *     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
 *   })
 *
 *   async function handleAddAll(todos: Array<string>) {
 *     try {
 *       await Promise.all(todos.map((todo) => addMutation.mutateAsync(todo)))
 *     } catch (error) {
 *       console.error('Failed to add todos:', error)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={() => handleAddAll(['Todo 1', 'Todo 2', 'Todo 3'])}>
 *       Add all
 *     </button>
 *   )
 * }
 * ```
 * @example
 * If some of the mutations above can fail independently of the others, and you want to know which ones
 * did — rather than losing that information the moment the first one rejects — swap `Promise.all` for
 * `Promise.allSettled`:
 * ```tsx
 * import { useMutation, useQueryClient } from '@tanstack/react-query'
 *
 * function AddTodos() {
 *   const queryClient = useQueryClient()
 *
 *   const addMutation = useMutation({
 *     mutationFn: addTodo,
 *     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
 *   })
 *
 *   async function handleAddAll(todos: Array<string>) {
 *     const addResults = await Promise.allSettled(
 *       todos.map((todo) => addMutation.mutateAsync(todo)),
 *     )
 *
 *     addResults.forEach((addResult, index) => {
 *       if (addResult.status === 'rejected') {
 *         console.error(`Failed to add "${todos[index]}":`, addResult.reason)
 *       }
 *     })
 *   }
 *
 *   return (
 *     <button onClick={() => handleAddAll(['Todo 1', 'Todo 2', 'Todo 3'])}>
 *       Add all
 *     </button>
 *   )
 * }
 * ```
 */
function useMutation(options, queryClient) {
  const client = useQueryClient(queryClient);
  const [observer] = import_react.useState(
    () => new MutationObserver(client, options),
  );
  import_react.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = import_react.useSyncExternalStore(
    import_react.useCallback(
      (onStoreChange) =>
        observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer],
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult(),
  );
  const mutate = import_react.useCallback(
    (...args) => {
      observer.mutate(args[0], args[1]).catch(noop);
    },
    [observer],
  );
  if (
    result.error &&
    shouldThrowError(observer.options.throwOnError, [result.error])
  )
    throw result.error;
  return {
    ...result,
    mutate,
    mutateAsync: result.mutate,
  };
}
//#endregion
export {
  useQueryClient as i,
  useQuery as n,
  QueryClientProvider as r,
  useMutation as t,
};
