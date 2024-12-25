import {DependencyList, useContext, useMemo, useEffect} from 'react';
import type {Middleware} from '../lib/url/Middleware';
import {RouteContext} from './RouteContext';

export function useRouteMiddleware(middleware: Middleware, deps: DependencyList) {
    let route = useContext(RouteContext);
    let callback = useMemo(() => middleware, deps);

    useEffect(() => route.use(callback), [route, callback]);
}
