import {useContext, useEffect, useRef} from 'react';
import {RouteContext} from './RouteContext';
import type {NavigationHandler} from './types/NavigationHandler';

export function useNavigationStart(callback: NavigationHandler) {
    let initedRef = useRef(false);
    let route = useContext(RouteContext);

    useEffect(() => {
        if (!initedRef.current && route.initialized) {
            callback(route.href, '');

            initedRef.current = true;
        }

        return route.use(callback);
    }, [route, callback]);
}
