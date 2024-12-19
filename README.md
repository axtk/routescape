[![npm](https://img.shields.io/npm/v/routescape?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/routescape) [![GitHub](https://img.shields.io/badge/-GitHub-royalblue?labelColor=royalblue&color=royalblue&style=flat-square&logo=github)](https://github.com/axtk/routescape) ![React](https://img.shields.io/badge/%23-React-345?labelColor=345&color=345&style=flat-square) [![SSR](https://img.shields.io/badge/%23-SSR-345?labelColor=345&color=345&style=flat-square)](#server-side-rendering-ssr) ![TypeScript](https://img.shields.io/badge/%23-TypeScript-345?labelColor=345&color=345&style=flat-square)

# routescape

React router with componentless route matching

- Concise API
- Routes are not necessarily hierarchical or otherwise tightly coupled
- Route link components don't introduce new APIs and are similar to HTML links
- Functional route matching (rather than component-based) equally handles component rendering and prop values
- SSR-compatible

## Links and route matching

The route link components `<A>` and `<Area>` enabling SPA navigation have the same props as their HTML counterparts: `<a>` and `<area>`. Apart from reducing some cognitive load, this allows to quickly migrate from plain HTML links to route links (or the other way around).

```jsx
import {A, useRoute} from 'routescape';

let App = () => {
    let [route, withRoute] = useRoute();

    return (
        <>
            <nav>
                <A href="/intro" className={withRoute('/intro', 'active')}>
                    Intro
                </A>
            </nav>
            {withRoute('/intro', (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
        </>
    );
};
```

The functional route matching by means of `withRoute()` offers a simple and consistent way to render both components and props based on the current location.

Note that both the intro link's `className` and `<main>` are rendered in a similar fashion using the same route-matching function.

(With the component-based route matching adopted by some routers, conditionally rendering a component and marking a link as active via its props have to be handled differently.)

## Route parameters

`withRoute()` accepts route patterns of various types: `string | RegExp | (string | RegExp)[]`. The parameters of a regular expression route pattern (or of the first match in the array) are passed to the second parameter of `withRoute()` if it happens to be a function.

```jsx
let App = () => {
    let [, withRoute] = useRoute();

    return (
        <>
            {withRoute(/^\/section\/(?<id>\d+)\/?$/, ({params}) => (
                <main>
                    <h1>Section #{params.id}</h1>
                </main>
            ))}
        </>
    );
};
```

## Conditional rendering fallback

Similarly to the ternary operator `condition ? x : y` (often seen with the general [conditional rendering](https://react.dev/learn/conditional-rendering) pattern), `withRoute()` accepts a fallback value as the optional third parameter: `withRoute(routePattern, x, y)`.

```jsx
let Nav = () => {
    let [route, withRoute] = useRoute();

    return (
        <nav>
            <A
                href="/intro"
                className={withRoute('/intro', 'active', 'inactive')}
            >
                Intro
            </A>
        </nav>
    );
};
```

In the example above, the link is marked as `'inactive'` if the current location isn't `/intro`.

(With the third parameter omitted, `withRoute('/intro', 'active')` results in `undefined` with locations other than `/intro`.)

## Unknown routes

The fallback parameter of `withRoute()` is also a way to handle unknown routes:

```jsx
const routeMap = {
    intro: '/intro',
    sections: /^\/section\/(?<id>\d+)\/?$/,
};

const knownRoutes = Object.values(routeMap);

let App = () => {
    let [, withRoute] = useRoute();

    return (
        <>
            {withRoute(routeMap.intro, (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(routeMap.sections, ({params}) => (
                <main>
                    <h1>Section #{params.id}</h1>
                </main>
            ))}
            {withRoute(knownRoutes, null, (
                <main className="error">
                    <h1>404 Not found</h1>
                </main>
            ))}
        </>
    );
};
```

Note that the last `withRoute()` results in `null` (that is no content) for all known routes and renders the error content for the rest unknown routes.

Although the routes are grouped together in the example above, that's not a requirement. `withRoute()` calls are not coupled together, they can be split across separate components and files and arranged in any order (like any other conditionally rendered components).

## Imperative route navigation

To jump to another route programmatically, there's the `route` object returned from the `useRoute()` hook:

```jsx
let ProfileButton = ({signedIn}) => {
    let [route] = useRoute();

    let handleClick = () => {
        route.assign(signedIn ? '/profile' : '/login');
    };

    return <button onClick={handleClick}>Profile</button>;
};
```

This particular example is somewhat contrived since it could have been composed in a declarative fashion using the route link component `<A>`. Still, it demonstrates how the `route` object can be used in use cases where the imperative navigation is the only reasonable way to go.

The interface of the `route` object consists of the following parts:

- SPA navigation via the History API:
    - `.assign()`, `.replace()`, `.reload()`, and readonly properties: `.href`, `.pathname`, `.search`, `.hash`, semantically similar to `window.location`;
    - `.back()`, `.forward()`, `.go(delta)`, corresponding to the [`history` methods](https://developer.mozilla.org/en-US/docs/Web/API/History#instance_methods);
- route matching:
    - `.matches(value)`, checking whether the current location matches the given `value`;
    - `.match(value)`, returning matched parameters if the given `value` is a regular expression and `null` if the current location doesn't match the `value`.

## Location provider

Server-side rendering and unit tests are the examples of the environments lacking a global location (such as `window.location`). They are the prime use cases for the location provider, `<Router>`.

Let's consider an *express* application route as an example:

```jsx
import {renderToString} from 'react-dom/server';
import {Router} from 'routescape';

app.get('/', (req, res) => {
    let html = renderToString(
        <Router location={req.originalUrl}>
            <App/>
        </Router>,
    );

    res.send(html);
});
```

The value passed to the router's `location` prop can be accessed via the `useRoute()` hook:

```jsx
let [route, withRoute] = useRoute();

console.log(route.href); // returns the router's `location`
```

Both `route` and `withRoute()` returned from `useRoute()` operate based on the router's `location`.

`<Router>` can be used with client-side rendering as well. In most cases, it is unnecessary since by default the route context takes the global location from `window.location` if it's available.

## Custom routing

The location provider component `<Router>` can be used to redefine the route matching behavior.

```jsx
import {NavigationLocation, getPath, Router} from 'routescape';

export class PathLocation extends NavigationLocation {
    getHref(location) {
        // disregard `search` and `hash`
        return getPath(location, {search: false, hash: false});
    }
}

let App = () => (
    <Router location={new PathLocation(url)}>
        <AppContent/>
    </Router>
);
```

By default, routing relies on the entire URL. In this example, we've redefined this behavior to disregard the `search` and `hash` portions of the URL.

Extending the `NavigationLocation` class gives plenty of room for customization. This approach allows in fact to go beyond the URL-based routing altogether.

## Converting plain links to route links

A static chunk of HTML content is an example where the route link component `<A>` can't be directly used but it still might be desirable to convert plain HTML links to SPA route links. The `useRouteLinks()` hook can be helpful here:

```jsx
import {useRef} from 'react';
import {useRouteLinks} from 'routescape';

let Content = ({value}) => {
    let containerRef = useRef(null);

    useRouteLinks(containerRef, 'a');

    return (
        <div ref={containerRef}>
            {value}
        </div>
    );
};
```

In this example, the `useRouteLinks()` hook converts all links matching the selector `'a'` inside the container referenced by `containerRef` to SPA route links.
