import {useContext, useEffect, useRef} from 'react';
import type {NavigationHandler} from './types/NavigationHandler';
import {RouteContext} from './RouteContext';

export function useNavigationComplete(callback: NavigationHandler) {
    let initedRef = useRef(false);
    let route = useContext(RouteContext);

    useEffect(() => {
        if (!initedRef.current && route.initialized) {
            callback(route.href, '');

            initedRef.current = true;
        }

        return route.subscribe(callback);
    }, [route, callback]);
}
