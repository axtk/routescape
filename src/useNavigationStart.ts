import {useContext, useEffect} from 'react';
import type {NavigationHandler} from './types/NavigationHandler';
import {RouteContext} from './RouteContext';

export function useNavigationStart(callback: NavigationHandler) {
    let route = useContext(RouteContext);

    useEffect(() => route.use(callback), [route, callback]);
}
