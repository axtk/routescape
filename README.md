# routescape

Minimalist router for React apps

- Single way to match routes in components and prop values
- Consistency with native APIs:
    - the route link component is similar to an HTML link
    - the route navigation interface is similar to `window.location`
- Unopinionated route structure: routes are not necessarily hierarchical, collocated or otherwise tightly coupled
- Middleware hook for actions ahead of route navigation
- Utility hook to make link tags in static HTML content work like SPA route links
- Compatibility with SSR

Installation: `npm i routescape`

## `<A>`

The route link component `<A>` enabling SPA navigation has the same props as its HTML counterpart: the `<a>` tag. Apart from reducing some cognitive load, this allows to quickly migrate from plain HTML links to route links (or the other way around).

```jsx
import {A} from 'routescape';

let Nav = () => (
    <nav>
        <A href="/intro">Intro</A>
    </nav>
);
```

### Navigation mode

By default, after the link navigation occurs, the user can navigate back by pressing the browser's *back* button. Optionally, by setting `data-navigation-mode="replace"` a link component can be configured to replace the navigation history entry, which will prevent the user from returning to the previous location by clicking the browser's *back* button.

## `<Area>`

`<Area>`, the image map route link component, has the same props and semantics as its HTML counterpart: the `<area>` tag. Setting the optional `data-navigation-mode="replace"` prop on `<Area>` has the same effect as with `<A>`.

## `useRoute()`

### Route matching

The functional route matching with the function returned from the `useRoute()` hook offers a simple and consistent way to render both components and prop values based on the current location.

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

Note that both the intro link's `className` and `<main>` are rendered in a similar fashion using the same route-matching function. `withRoute('/intro', x)` returns `x` only if the current location is `/intro`.

(With the component-based route matching adopted by some routers, conditionally rendering a component and marking a link as active via its props have to be handled differently.)

### Route matching fallback

Similarly to the ternary operator `condition ? x : y` (often seen with the general [conditional rendering](https://react.dev/learn/conditional-rendering) pattern), `withRoute()` accepts a fallback value as the optional third parameter: `withRoute(routePattern, x, y)`.

```jsx
import {A, useRoute} from 'routescape';

let Nav = () => {
    let [, withRoute] = useRoute();

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

In the example above, the link is marked as `active` if the current location is `/intro`, and `inactive` otherwise.

With the third parameter omitted, `withRoute('/intro', 'active')` results in `undefined` with locations other than `/intro` (since the missing fallback parameter is effectively `undefined`), which is perfectly fine as well.

Another option would be to render a non-interactive `<span>` for the active route, and a route link pointing to that route otherwise:

```jsx
import {A, useRoute} from 'routescape';

let Nav = () => {
    let [, withRoute] = useRoute();

    return (
        <nav>
            {withRoute(
                '/intro',
                <span>Intro</span>,
                <A href="/intro">Intro<A>,
            )}
        </nav>
    );
};
```

### Route parameters

`withRoute()` accepts route patterns of various types: `string | RegExp | (string | RegExp)[]`. The parameters of a regular expression route pattern (or of the first match in the array) are passed to the second and the third parameter of `withRoute()` if they are functions.

```jsx
let App = () => {
    let [, withRoute] = useRoute();

    return (
        <>
            <nav>
                <A href="/intro">Intro</A>
            </nav>
            {withRoute(/^\/section\/(?<id>\d+)\/?$/, ({id}) => (
                <main>
                    <h1>Section #{id}</h1>
                </main>
            ))}
        </>
    );
};
```

### Unknown routes

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
            <nav>
                <A href={routeMap.intro}>Intro</A>
            </nav>
            {withRoute(routeMap.intro, (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(routeMap.sections, ({id}) => (
                <main>
                    <h1>Section #{id}</h1>
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

### Imperative route navigation

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

## `useNavigationStart()`

The `useNavigationStart()` hook allows to define routing *middleware*, that is intermediate actions to be done before the route navigation occurs.

### Preventing navigation

Common use cases for preventing navigation are: warning about unsaved data before leaving the page or opening a preview widget for certain links instead of jumping to a new full-screen page.

Navigation to another route can be prevented by returning `false` under certain conditions within the hook callback:

```jsx
import {useNavigationStart} from 'routescape';

let App = () => {
    let [hasUnsavedChanges, setUnsavedChanges] = useState(false);

    useNavigationStart(() => {
        if (hasUnsavedChanges)
            return false;
    }, [hasUnsavedChanges]);

    return (
        // app content
    );
};
```

In this example, all route navigation is interrupted as long as `hasUnsavedChanges` is `true`.

### Redirection

Redirection to another route can be done by calling `route.assign()` within the hook callback:

```jsx
import {useNavigationStart} from 'routescape';

let App = () => {
    useNavigationStart(nextHref => {
        if (nextHref === '/intro') {
            route.assign('/');
            return false;
        }
    }, [route]);

    return (
        // app content
    );
};
```

Note that the hook callback returns `false` when `nextHref` is `'/intro'`. This prevents the navigation to `/intro`.

The callback might as well contain additional checks before allowing the redirection (like whether the user has access to the target location).

## `useNavigationComplete()`

The callback of the `useNavigationComplete()` hook is called after going through all routing middleware registered with the `useNavigationStart()` hook and after assigning the next route.

The `useNavigationComplete()` callback is first called when the component gets mounted if the route is already in the navigation-complete state.

```jsx
import {useNavigationComplete} from 'routescape';

let App = () => {
    useNavigationComplete(href => {
        if (href === '/intro')
            document.title = 'Intro';
    }, []);

    return (
        // app content
    );
};
```

## `useRouteLinks()`

A chunk of static HTML content is an example where the route link component `<A>` can't be directly used but it still might be desirable to make plain HTML links in that content behave as SPA route links. The `useRouteLinks()` hook can be helpful here:

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

In this example, the `useRouteLinks()` hook makes all links matching the selector `'a'` inside the container referenced by `containerRef` act as SPA route links.

## `<Router>`

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

### Custom routing

The location provider component `<Router>` can be used to redefine the route matching behavior.

```jsx
import {Route, getPath, Router} from 'routescape';

export class PathRoute extends Route {
    getHref(location) {
        // disregard `search` and `hash`
        return getPath(location, {search: false, hash: false});
    }
}

let App = () => (
    <Router location={new PathRoute(url)}>
        <AppContent/>
    </Router>
);
```

By default, routing relies on the entire URL. In this example, we've redefined this behavior to disregard the `search` and `hash` portions of the URL.

Extending the `Route` class gives plenty of room for customization. This approach allows in fact to go beyond the URL-based routing altogether.
