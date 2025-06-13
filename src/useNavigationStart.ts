import {useContext, useEffect} from 'react';
import {RouteContext} from './RouteContext';
import type {NavigationHandler} from './types/NavigationHandler';

export function useNavigationStart(callback: NavigationHandler) {
    let route = useContext(RouteContext);

    useEffect(() => route.use(callback), [route, callback]);
}
