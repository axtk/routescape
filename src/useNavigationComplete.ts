import {DependencyList, useContext, useMemo, useEffect} from 'react';
import type {Listener} from '../lib/url/Listener';
import {RouteContext} from './RouteContext';

export function useNavigationComplete(listener: Listener, deps: DependencyList) {
    let route = useContext(RouteContext);
    let callback = useMemo(() => listener, deps);

    useEffect(() => route.subscribe(callback), [route, callback]);
}
