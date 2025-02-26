---
title: Routing
sidebar_position: 1
---

Expo Router uses a file-based routing convention to define pages in the app. Expo Router uses this convention to optimize the app by generating native deep links and web routes automatically.

The convention is based on the concept of nesting routes inside each other to create shared UI elements like tab bars and headers across multiple children. This format should feel familiar to React developers.

File-based routing enables URLs for every page in your app. All routes must be created within the root `app/` directory. Within this directory, you can create routes by defining files using the route name.

- `app/home.js` matches `/home`.
- `app/settings/index.js` matches `/settings`.
- `app/[user].js` matches any unmatched path like `/evanbacon` or `/expo`.

## Pages

Pages are defined by exporting a React component as the default value from a file in the app directory.

```js title="app/home.js"
import { Text } from "react-native";

export default function Home() {
  return <Text>Home page</Text>;
}
```

- Files named `index` add no path segment to the URL. For example, `app/index.js` matches `/`.
- The following extensions are supported by default: `js`, `jsx`, `ts`, `tsx`.
- Metro platform extensions (e.g. `.ios.js`, `.native.ts`) are not currently supported.

## Dynamic Routes

Dynamic routes match any unmatched path at a given segment level.

- `app/blog/[slug].js` -- Matches `/blog/123` in your app and in the browser.
- `app/blog/[...rest].js` -- Matches `/blog/123/settings` in your app and in the browser.

Routes with higher specificity will be matched before a dynamic route. For example, `/blog/bacon` will match `blog/bacon.js` before `blog/[id].js`.

Multiple slugs can be matched in a single route by adding the _rest syntax_: `...`. For example, `app/blog/[...id].js` will match `/blog/123/settings` in your app and in the browser.

<!-- > The _optional syntax_ `[[]]` is not currently supported. -->

## Layouts

Pages on their own fill the entire screen. Moving between them is a full page transition with no animation.

In native apps, users expect shared elements like headers and tab bars to persist between pages. These can be created using _layout routes_.

To create a layout route for a directory, create a file named `_layout.js` in the directory, and export a React component as _default_.

```js title="app/home/_layout.js"
import { Slot } from "expo-router";

export default function HomeLayout() {
  return <Slot />;
}
```

`<Slot />` will render the selected child route. This component can be wrapped with other components to create a layout.

```js title="app/home/_layout.js"
import { Slot } from "expo-router";

export default function HomeLayout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
```

### Native Layouts

Mobile app users expect a refined platform-specific look and native feel for layouts. Expo Router provides a few drop-in native layouts that you can use to easily achieve familiar native behavior.

- `Slot` - Render the current child without any styling. This can be used to create a custom layout.
- `Stack` - Render a stack of screens like a deck of cards with a header on top. This is a native stack navigator that uses native animations and gestures. Extends the library [`@react-navigation/native-stack`](https://reactnavigation.org/docs/native-stack-navigator).
- `Tabs` - Render screens with a tab bar below. [`@react-navigation/bottom-tabs`](https://reactnavigation.org/docs/bottom-tab-navigator/).

```js title="app/home/_layout.js"
import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ ... }} />
    )
}
```

### Layout Settings

> Unstable: This feature will be replaced with something that supports React Suspense in the future.

To support defining the `initialRouteName` you can use the `unstable_settings` object export from any Layout Route.

```bash title="File System"
app/
  _layout.js
  index.js
  other.js
```

```js title=app/_layout.tsx
import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function Layout() {
  return <Stack />;
}
```

Now deep linking directly to `/other` or reloading the page will continue to show the back arrow.

When using [array syntax](#arrays) `(foo,bar)` you can specify the name of a group in the `unstable_settings` object to target a particular segment.

```js
export const unstable_settings = {
  // Used for `(foo)`
  initialRouteName: "first",
  // Used for `(bar)`
  bar: {
    initialRouteName: "second",
  },
};
```

## Groups

<!-- > Also known as _optional routes_. -->

You can prevent a segment from showing in the URL by using the group syntax `()`.

- `app/root/home.js` -- Matches `/root/home`.
- `app/(root)/home.js` -- Matches `/home`.

This is useful for adding layouts without adding additional segments to the URL.

### Shared Routes

> Shared routes are an advanced concept that is unique to native app development.

To match the same URL with different layouts, use _groups_ with overlapping child routes.

This pattern is very common in native apps like Spotify, Facebook, or Instagram. For example, in Twitter, a profile can be viewed in every tab (home, search, profile) simultaneously, there should however only be one URL for this route.

For **example-driven developers**: see this pseudo-twitter example: [Live demo](https://expo-twitter.netlify.app/) | [Source code](https://github.com/EvanBacon/expo-router-twitter/tree/main/app).

Consider the following structure, the `app/*/[user].js` route can appear in multiple tabs simultaneously, while sharing the same public URL.

```bash title="File System"
app/
  _layout.js # Tab bar
  (home)
    _layout.js # Header
    home.js # Matches `/home`
    [user].js # Matches `/evanbacon`
  (search)
    _layout.js # Header with search bar
    search.js # Matches `/search`
    [user].js # Also matches `/evanbacon`
  (profile)
    _layout.js # Folding profile header
    profile.js # Matches `/profile`
    [user].js # Also matches `/evanbacon`
```

> When reloading the page, the first match (alphabetically) will be rendered.

Shared routes can be navigated to directly by including the group name in the route, e.g. `/(search)/evanbacon` would navigate to `/evanbacon` in the _search_ layout.

<!-- TODO: optional group syntax `(())` -->

### Arrays

> Array syntax is an advanced concept that is unique to native app development.

Instead of defining the same route multiple times with different layouts, use the array syntax `(,)` to duplicate the children of a group.

- `app/(home,search)/[user].js` -- creates `app/(home)/[user].js` and `app/(search)/[user].js` in memory.

Distinguishing between the two routes using the `segment` prop of a layout.

```js title="app/(home,search)/_layout.js"
export default function DynamicLayout({ segment }) {
  if (segment === "(search)") {
    return <SearchStack />;
  }

  return <Stack />;
}
```
