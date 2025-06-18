import {useContext, useEffect, useMemo, useState} from 'react';
import {RouteContext} from './RouteContext';
import type {Route} from './utils/Route';

export type WithRoute = Route['evaluate'];

export function useRoute(): [Route, WithRoute] {
    let route = useContext(RouteContext);
    let [, setHref] = useState(route.href);

    useEffect(() => route.subscribe(href => setHref(href)), [route]);

    return useMemo(() => {
        let withRoute = route.evaluate.bind(route);

        return [route, withRoute];
    }, [route]);
}
