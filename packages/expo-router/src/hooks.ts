import {
  NavigationRouteContext,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import React from "react";

import {
  store,
  useStoreRootState,
  useStoreRouteInfo,
} from "./global-state/router-store";
import { Router } from "./types";

type SearchParams = Record<string, string | string[]>;

export function useRootNavigationState() {
  return useStoreRootState();
}

export function useRouteInfo() {
  return useStoreRouteInfo();
}

export function useRootNavigation() {
  return store.navigationRef.current;
}

// Wraps useLinkTo to provide an API which is similar to the Link component.
export function useLink() {
  console.warn("`useLink()` is deprecated in favor of `useRouter()`");
  return useRouter();
}

export function useRouter(): Router {
  return {
    push: store.push,
    back: store.goBack,
    replace: store.replace,
    setParams: store.setParams,
    // TODO(EvanBacon): add `reload`
    // TODO(EvanBacon): add `canGoBack` but maybe more like a `hasContext`
  };
}

/**
 * @private
 * @returns the current global pathname with query params attached. This may change in the future to include the hostname from a predefined universal link, i.e. `/foobar?hey=world` becomes `https://acme.dev/foobar?hey=world`
 */
export function useUnstableGlobalHref(): string {
  return useStoreRouteInfo().unstable_globalHref;
}

/**
 * Get a list of selected file segments for the currently selected route. Segments are not normalized, so they will be the same as the file path. e.g. /[id]?id=normal -> ["[id]"]
 *
 * `useSegments` can be typed using an abstract.
 * Consider the following file structure, and strictly typed `useSegments` function:
 *
 * ```md
 * - app
 *   - [user]
 *     - index.js
 *     - followers.js
 *   - settings.js
 * ```
 * This can be strictly typed using the following abstract:
 *
 * ```ts
 * const [first, second] = useSegments<['settings'] | ['[user]'] | ['[user]', 'followers']>()
 * ```
 */
export function useSegments<
  TSegments extends string[] = string[]
>(): TSegments {
  return useStoreRouteInfo().segments as TSegments;
}

/** @returns global selected pathname without query parameters. */
export function usePathname(): string {
  return useStoreRouteInfo().pathname;
}

/**
 * Get the globally selected query parameters, including dynamic path segments. This function will update even when the route is not focused.
 * Useful for analytics or other background operations that don't draw to the screen.
 *
 * When querying search params in a stack, opt-towards using `useLocalSearchParams` as these will only
 * update when the route is focused.
 *
 * @see `useLocalSearchParams`
 */
export function useGlobalSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return useStoreRouteInfo().params as Partial<TParams>;
}

/** @deprecated renamed to `useGlobalSearchParams` */
export function useSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return useGlobalSearchParams<TParams>();
}

/**
 * Returns the URL search parameters for the contextually focused route. e.g. `/acme?foo=bar` -> `{ foo: "bar" }`.
 * This is useful for stacks where you may push a new screen that changes the query parameters.
 *
 * To observe updates even when the invoking route is not focused, use `useGlobalSearchParams()`.
 */
export function useLocalSearchParams<
  TParams extends SearchParams = SearchParams
>(): Partial<TParams> {
  return (useOptionalLocalRoute()?.params ?? ({} as any)) as Partial<TParams>;
}

function useOptionalLocalRoute<T extends RouteProp<ParamListBase>>():
  | T
  | undefined {
  const route = React.useContext(NavigationRouteContext);
  return route as T | undefined;
}
