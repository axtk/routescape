# routescape

Minimalist router for React apps

- Single way to match routes in components and prop values: [`withRoute(routePattern, x, y)`](#useroute) acts similar to the conditional operator `condition ? x : y`
- Similar to native APIs:
    - the route link components [`<A>`](#a) and [`<Area>`](#area) are similar to the HTML link tags `<a>` and `<area>`
    - the route navigation interface of the [`route`](#imperative-route-navigation) object is similar to `window.location`
- Unopinionated route structure: routes are not necessarily hierarchical, collocated or otherwise tightly coupled (`withRoute()` can be used anywhere in a component with any route pattern)
- Middleware hooks for actions before and after route navigation: [`useNavigationStart()`](#usenavigationstart) and [`useNavigationComplete()`](#usenavigationcomplete)
- Utility hook to make link tags in static HTML content act like SPA route links: [`useRouteLinks(containerRef, selector?)`](#useroutelinks)
- Straightforward [lazy routes](#lazy-routes)
- [Compatible with SSR](#router)

Installation: `npm i routescape`

## Route link component

### `<A>`

The route link component `<A>` enabling SPA navigation has the same props as the HTML link tag `<a>`. Apart from reducing some cognitive load, sticking to the same markup interface allows to quickly migrate from plain HTML links to route links (or the other way around).

```jsx
import {A} from 'routescape';

let Nav = () => (
    <nav>
        <A href="/intro">Intro</A>
    </nav>
);
```

### `<Area>`

`<Area>`, the image map route link component, has the same props and semantics as the HTML image map tag `<area>`, with the SPA navigation enabled.

### Navigation mode

By default, after the link navigation occurs, the user can navigate back by pressing the browser's *back* button. Optionally, by setting `data-navigation-mode="replace"`, a route link component can be configured to replace the navigation history entry, which will prevent the user from returning to the previous location by clicking the browser's *back* button.

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
    - `.match(value)`, accepting various types of location patterns (`string | RegExp | (string | RegExp)[]`) and returning an object containing the matched parameters or `null` if the current location doesn't match the `value`.

## `useNavigationStart()`

The `useNavigationStart()` hook allows to define routing *middleware*, that is intermediate actions to be done before the route navigation occurs. The following couple of sections show the common examples of what can be handled with routing middleware.

### Preventing navigation

The common use cases for preventing navigation are: showing a warning about unsaved data before leaving the page or opening a preview widget for certain links instead of jumping to a new full-screen page.

Navigation to another route can be prevented by returning `false` under certain conditions within the hook callback:

```jsx
import {useNavigationStart} from 'routescape';

let App = () => {
    let [hasUnsavedChanges, setUnsavedChanges] = useState(false);

    let handleNavigationStart = useCallback(() => {
        if (hasUnsavedChanges)
            return false;
    }, [hasUnsavedChanges]);

    useNavigationStart(handleNavigationStart);

    return (
        // app content
    );
};
```

In this example, all route navigation is interrupted as long as `hasUnsavedChanges` is `true`.

### Redirection

Redirection to another route can be done by calling `route.assign()` within the hook callback:

```jsx
import {useNavigationStart, useRoute} from 'routescape';

let App = () => {
    let [route] = useRoute();

    let handleNavigationStart = useCallback(nextHref => {
        if (nextHref === '/intro') {
            route.assign('/');
            return false;
        }
    }, [route]);

    useNavigationStart(handleNavigationStart);

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

function handleNavigationComplete(href) {
    if (href === '/intro')
        document.title = 'Intro';
}

let App = () => {
    useNavigationComplete(handleNavigationComplete);

    return (
        // app content
    );
};
```

In this example, we're setting the document title according to the current route location once the route navigation is complete.

## `useRouteLinks()`

A chunk of static HTML content is an example where the route link component `<A>` can't be directly used but it still might be desirable to make plain HTML links in that content behave as SPA route links. The `useRouteLinks()` hook can be helpful here:

```jsx
import {useRef} from 'react';
import {useRouteLinks} from 'routescape';

let Content = ({value}) => {
    let containerRef = useRef(null);

    useRouteLinks(containerRef);

    return (
        <div ref={containerRef}>
            {value}
        </div>
    );
};
```

In this example, the `useRouteLinks()` hook makes all HTML links inside the container referenced by `containerRef` act as SPA route links.

To be more specific as to which elements in the container should be converted to route links, a selector, or an HTML element, or a collection thereof, can be passed as the second parameter of `useRouteLinks()`:

```js
useRouteLinks(containerRef, '.content a');
```

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

class PathRoute extends Route {
    getHref(location) {
        // disregard `search` and `hash`
        return getPath(location, {search: false, hash: false});
    }
}

let App = () => (
    <Router location={new PathRoute(url)}>
        <App/>
    </Router>
);
```

By default, routing relies on the entire URL. In this example, we've redefined this behavior to disregard the `search` and `hash` portions of the URL.

Extending the `Route` class gives plenty of room for customization. This approach allows in fact to go beyond the URL-based routing altogether.

## Lazy routes

Lazy routes are routes whose content is loaded on demand, when the route is visited.

Enabling lazy routes doesn't require a specific routing setup. It's a combination of the [route matching](#useroute) and lazily loaded React components (with `React.lazy()` and React's `<Suspense>`), processed by a code-splitting-capable build tool (like Esbuild, Webpack, Rollup, Vite):

```diff
+ import {Suspense} from 'react';
  import {A, useRoute} from 'routescape';
  import {Intro} from './Intro';
- import {Projects} from './Projects';
+ import {Projects} from './Projects.lazy';

export const App = () => {
    let [, withRoute] = useRoute();

    return (
        <>
            <nav>
                <A href="/">Intro</A>
                <A href="/projects">Projects</A>
            </nav>
            {withRoute('/', (
                <Intro/>
            ))}
            {withRoute('/projects', (
-               <Projects/>
+               <Suspense fallback={<p>Loading...</p>}>
+                   <Projects/>
+               </Suspense>
            ))}
        </>
    );
};
```

```diff
+ // Projects.lazy.js
+ import {lazy} from 'react';
+
+ export const Projects = lazy(() => import('./Projects'));
```

```diff
// Projects.jsx
export const Projects = () => {
    <main>
        <h1>Projects</h1>
    </main>
};
```

```diff
// Intro.jsx
export const Intro = () => (
    <main>
        <h1>Intro</h1>
    </main>
);
```

In this example, the `<Projects>` component isn't loaded until the corresponding `/projects` route is visited. When it's first visited, while the component is being fetched, `<p>Loading...</p>` shows up, as specified with the `fallback` prop of `<Suspense>`.
