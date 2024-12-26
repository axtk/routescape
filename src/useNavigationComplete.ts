import {DependencyList, useContext, useMemo, useEffect, useRef} from 'react';
import type {NavigationHandler} from '../lib/url/NavigationHandler';
import {RouteContext} from './RouteContext';

export function useNavigationComplete(handler: NavigationHandler, deps: DependencyList) {
    let initedRef = useRef(false);
    let route = useContext(RouteContext);
    let callback = useMemo(() => handler, deps);

    useEffect(() => {
        if (!initedRef.current && route.initialized) {
            callback(route.href, '');

            initedRef.current = true;
        }

        return route.subscribe(callback);
    }, [route, callback]);
}
