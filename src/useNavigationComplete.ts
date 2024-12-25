import {DependencyList, useContext, useMemo, useEffect} from 'react';
import type {NavigationHandler} from '../lib/url/NavigationHandler';
import {RouteContext} from './RouteContext';

export function useNavigationComplete(handler: NavigationHandler, deps: DependencyList) {
    let route = useContext(RouteContext);
    let callback = useMemo(() => handler, deps);

    useEffect(() => route.subscribe(callback), [route, callback]);
}
