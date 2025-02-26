---
title: Head
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

The Expo `<Head />` component provides a simple and flexible way to manage the meta tags and other important elements of the page head in a universal Expo application. The Expo Head component is designed to be used in both web and mobile applications built with Expo Router. By using this component, developers can easily enhance the search engine optimization (SEO) of their applications.

Native support can be found in the [handoff guide](/docs/lab/handoff).

## Usage

Be sure to use the `expo-router` Config Plugin if you're planning to use on iOS:

```json title=app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          // Set this to the URL where your iOS universal links can be accessed.
          // For example, if I build an app "Bacon Blog" and host at `evanbacon.dev`
          // then `origin` should be `https://evanbacon.dev`.
          "origin": "<PRODUCTION_URL>"
        }
      ]
    ]
  }
}
```

The `<Head />` component can be imported in any route in the `app` directory, import using `expo-router/head`:

```tsx title=app/index.js
import { Text } from "react-native";
import Head from "expo-router/head";

export default function App() {
  return (
    <>
      <Head>
        <title>My App</title>
        <meta name="description" content="My App description" />
      </Head>
      <Text>Hello World</Text>
    </>
  );
}
```

This renders to the following (simplified):

```html title=dist/index.html
<html>
  // highlight-next-line
  <head>
    // highlight-next-line
    <title>My App</title>
    // highlight-next-line
    <meta name="description" content="My App description" />
    // highlight-next-line
  </head>
  <body>
    <div id="root">
      <div>Hello World</div>
    </div>
  </body>
</html>
```

In the above example, we have used the `title` and `meta` tags to set the page title and meta **description**, respectively. You can use other props to set other meta tags, as well as link and script tags.

The `<Head />` component accepts any web meta tags as children. The `<Head />` component will automatically render the meta tags in the `<head />` of the page. All nested `<Head />` components will be merged into a single `<head />` element.

## Rendering

> Static rendering is experimentally available starting in SDK 49

The `<Head />` component can be used for static rendering, be setting `web.output: 'static'` in `app.json`. The `<Head />` component can also be used to update during runtime or in single-page applications, this is useful for updating the page title and favicon to reflect dynamic interactions.

## Beta Notice

<!-- TODO -->

The Head API may change in the future when we add universal support for React Server Components. We will also add support for native meta tags in the future to maximize discoverability and SEO across devices.
