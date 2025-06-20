[![npm](https://flat.badgen.net/npm/v/routescape?labelColor=345&color=46e)](https://www.npmjs.com/package/routescape) ![Lightweight](https://flat.badgen.net/bundlephobia/minzip/routescape/?label=minzip&labelColor=345&color=46e&r=0) ![TypeScript ✓](https://flat.badgen.net/badge/TypeScript/✓?labelColor=345&color=345) ![CSR ✓](https://flat.badgen.net/badge/CSR/✓?labelColor=345&color=345) ![SSR ✓](https://flat.badgen.net/badge/SSR/✓?labelColor=345&color=345)

# routescape

*Straightforward and minimalist router for React apps*

- Single way to match routes with components and prop values
- Similar to native APIs
- Decoupled routes: no hierarchy as a prerequisite
- Straightforward middleware hooks, lazy routes, compatibility with CSR and SSR
- Progressive type-safe routing
- Utility hook to convert HTML links to SPA route links

Installation: `npm i routescape`

## Route matching

Routescape offers a simple and consistent way to render both components and prop values in a single manner (unlike component-, config-, or file-based approaches) based on the current location:

```jsx
import {useRoute} from 'routescape';

let App = () => {
    let {route, withRoute} = useRoute();

    // `withRoute(routePattern, x, y)` acts similarly to
    // `matchesRoutePattern ? x : y`
    return (
        <>
            <header className={withRoute('/', 'full', 'compact')}>
                <h1>App</h1>
            </header>
            {withRoute('/', (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(/^\/section\/(?<id>\d+)\/?$/, ({params}) => (
                <main>
                    <h1>Section {params.id}</h1>
                </main>
            ))}
        </>
    );
};
```

[Live demo](https://codesandbox.io/p/sandbox/routescape-demo-fqlyhs?file=%2Fsrc%2FApp.jsx)

Note that both the header's `className` prop and the `<main>` component are rendered in a single way using the same route-matching function.

(With the component-based, config-based, or file-based route matching adopted by some routers, conditionally rendering a component and a prop value have to be handled differently.)

🔹 The ternary route-matching function `withRoute(routePattern, x, y)` returned from the `useRoute()` hook has the semantics similar to the ternary conditional operator `matchesRoutePattern ? x : y`, commonly seen with the conditional rendering pattern, which reflects the fact that route-based rendering also falls under this category.

🔹 `withRoute()` doesn't impose any route hierarchy by default, as it can be used with any route pattern anywhere in the app's components, offering sufficient flexibility to handle an arbitrary route-based logic.

🔹 `withRoute()` accepts route patterns of various types: `string | RegExp | (string | RegExp)[]`. The parameters of a regular expression route pattern (or of the first `RegExp` match in the array) are passed to the second and the third parameter of `withRoute()` if they are functions, as shown in the example above.

## Route navigation

The Routescape's route navigation API is largely aligned with the similar native APIs familiar to most web developers, such as `<a href="/x">` and `window.location`, which helps reduce cognitive load and shorten the migration path from the native APIs:

```diff
+ import {A, useRoute} from 'routescape';

  let UserNav = ({signedIn}) => {
+     let {route} = useRoute();

      let handleClick = () => {
-         window.location.assign(signedIn ? '/profile' : '/login');
+         route.assign(signedIn ? '/profile' : '/login');
      };

      return (
          <nav>
-             <a href="/">Home</a>
+             <A href="/">Home</A>
              <button onClick={handleClick}>Profile</button>
          </nav>
      );
  };
```

### Route link component

#### `<A>`

The route link component `<A>` enabling SPA navigation has the same props as the HTML link tag `<a>`. Apart from reducing some cognitive load, sticking to the similar API allows to quickly migrate from plain HTML links to route links (or the other way around).

```jsx
import {A} from 'routescape';

let Nav = () => (
    <nav>
        <A href="/intro">Intro</A>
    </nav>
);
```

#### `<Area>`

`<Area>`, the image map route link component, has the same props and semantics as the HTML image map tag `<area>`, with the SPA navigation enabled.

#### Navigation mode

By default, after the link navigation occurs, the user can navigate back by pressing the browser's *back* button. Optionally, by setting `data-navigation-mode="replace"`, a route link component can be configured to replace the navigation history entry, which will prevent the user from returning to the previous location by clicking the browser's *back* button.

### Imperative route navigation

To jump to another route programmatically, there's the `route` object returned from the `useRoute()` hook:

```jsx
import {useRoute} from 'routescape';

let ProfileButton = ({signedIn}) => {
    let {route} = useRoute();

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

## Routing middleware

The Routescape's hooks `useNavigationStart()` and `useNavigationComplete()` define routing *middleware*, that is intermediate actions to be done before and after the route navigation occurs:

```jsx
import {useNavigationComplete, useNavigationStart} from 'routescape';

function setTitle(href) {
    if (href === '/intro')
        document.title = 'Intro';
}

let App = () => {
    let {route} = useRoute();
    let [hasUnsavedChanges, setUnsavedChanges] = useState(false);

    let handleNavigationStart = useCallback(nextHref => {
        if (hasUnsavedChanges)
            return false; // prevents navigation

        if (nextHref === '/intro') {
            route.assign('/'); // redirection
            return false;
        }
    }, [hasUnsavedChanges, route]);

    useNavigationStart(handleNavigationStart);
    useNavigationComplete(setTitle);

    return (
        // app content
    );
};
```

This example shows some common examples of what can be handled with routing middleware: preventing navigation with unsaved user input, redirecting to another location, setting the page title based on the current location.

🔹 The `useNavigationComplete()` callback is first called when the component gets mounted if the route is already in the navigation-complete state.

## Converting HTML links to SPA route links

A chunk of static HTML content is an example where the route link component can't be directly used but it still might be desirable to make plain HTML links in that content behave as SPA route links. The `useRouteLinks()` hook can be helpful here:

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
let {route, withRoute} = useRoute();

console.log(route.href); // returns the router's `location`
```

Both `route` and `withRoute()` returned from `useRoute()` operate based on the router's `location`.

`<Router>` can be used with client-side rendering as well. In most cases, it is unnecessary since by default the route context takes the global location from `window.location` if it's available.

### Custom routing

The location provider component `<Router>` can be used to redefine the route matching behavior.

```jsx
import {Route, Router, getPath} from 'routescape';

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

## Unknown routes

The fallback parameter of the route-matching function `withRoute(routePattern, x, y)` can be used as a way to handle unknown routes:

```jsx
import {A, useRoute} from 'routescape';

const routeMap = {
    intro: '/intro',
    sections: /^\/section\/(?<id>\d+)\/?$/,
};

const knownRoutes = Object.values(routeMap);

let App = () => {
    let {withRoute} = useRoute();

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
            {withRoute(routeMap.sections, ({params}) => (
                <main>
                    <h1>Section {params.id}</h1>
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

The last `withRoute()` in this example results in `null` (that is no content) for all known routes and renders the error content for the rest unknown routes.

🔹 `withRoute()` calls don't have to maintain a specific order, and the unknown route handling `withRoute()` doesn't have to be the last.

🔹 `withRoute()` calls don't have to be grouped side by side like in the example above, their collocation is not a requirement. `withRoute()` calls are not coupled together, they can be split across separate components and files (like any other conditionally rendered components).

## Lazy routes

Lazy routes are routes whose content is loaded on demand, when the route is visited.

Enabling lazy routes doesn't require a specific routing setup. It's a combination of the [route matching](#route-matching) and lazily loaded React components (with `React.lazy()` and React's `<Suspense>`), processed by a code-splitting-capable build tool (like Esbuild, Webpack, Rollup, Vite):

```diff
+ import {Suspense} from 'react';
  import {A, useRoute} from 'routescape';
  import {Intro} from './Intro';
- import {Projects} from './Projects';
+ import {Projects} from './Projects.lazy';

  export const App = () => {
      let {withRoute} = useRoute();

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
-                 <Projects/>
+                 <Suspense fallback={<p>Loading...</p>}>
+                     <Projects/>
+                 </Suspense>
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

[Live demo](https://codesandbox.io/p/sandbox/routescape-lazy-routes-demo-dr5246?file=%2Fsrc%2FApp.jsx)

In this example, the `<Projects>` component isn't loaded until the corresponding `/projects` route is visited. When it's first visited, while the component is being fetched, `<p>Loading...</p>` shows up, as specified with the `fallback` prop of `<Suspense>`.

## URL parameters

The URL parameters, such as path parameters and query parameters, can be retrieved from the current location with the `useRouteMatch(pattern)` hook:

```js
import {useRouteMatch} from 'routescape';

let Section = ({content}) => {
    let {params} = useRouteMatch(/^\/section\/(?<id>\d+)\/?$/);

    return (
        <section className={params.id === '1' ? 'cover' : 'regular'}>
            {content}
        </section>
    );
};
```

🔹 To make sure the current location actually matches the given pattern, the boolean `ok` flag returned from the hook can be used.

## Type-safe routing

As an optional enhancement, Routescape supports progressive schema-based route type safety.

Type-safe routing is enabled by Routescape's support of routes created with a type-safe URL builder like `url-shape` coupled with a schema created with `zod` or `yup`. This approach allows for gradual or partial adoption of type-safe routing in an application.

```tsx
import {A, useRoute} from 'routescape';
import {createURLSchema} from 'url-shape';
import {z} from 'zod';

const {url} = createURLSchema({
    '/': null, // goes without parameters
    '/sections/:id': {
        params: z.object({
            id: z.coerce.number(),
        }),
    },
    '/search': {
        query: z.object({
            term: z.string(),
            lang: z.optional(z.enum(['current', 'all'])),
        }),
    },
});

let App = () => {
    let {withRoute} = useRoute();

    // `withRoute(routePattern, x, y)` acts similarly to
    // `matchesRoutePattern ? x : y`
    return (
        <>
            <header className={withRoute(url('/'), 'full', 'compact')}>
                <h1>App</h1>
                <nav>
                    <A href={url('/')}>
                        Intro
                    </A>
                    {' | '}
                    <A href={url('/sections/:id', {params: {id: 1}})}>
                        Start
                    </A>
                </nav>
            </header>
            {withRoute(url('/'), (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(url('/sections/:id'), ({params}) => (
                <main>
                    <h1>Section {params.id}</h1>
                </main>
            ))}
        </>
    );
};
```

[Live demo](https://codesandbox.io/p/sandbox/routescape-type-safety-demo-393y94?file=%2Fsrc%2FApp.tsx)

🔹 The `url()` function in the example above helps validate the routes against the given URL schema: a type-aware code editor highlights typos and type mismatches of its parameters.

🔹 The `match()` function returned from `createURLSchema()` can be used to parse the URL paramaters in a type-safe manner.

🔹 A URL schema doesn't have to cover the entire app. Standalone portions of an app can have their own URL schemas.

🔹 Stricter type safety can be achieved by disallowing URLs and URL patterns other than provided by the URL builder (the `url()` function in the example above) throughout the app:

```ts
declare module 'routescape' {
    interface Config {
        strict: true;
    }
}
```

Adding this type declaration to an app effectively disallows passing `string` and `RegExp` values to the link `href` prop and the ternary route-matching function `withRoute(routePattern, x, y)`, only allowing values returned from the URL builder.

🔹 A URL builder pattern (like `url('/sections/:id')`) can also be used with the `useRouteMatch(pattern)` hook to get typed [URL parameters](#url-parameters).
