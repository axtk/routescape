import {useCallback, useContext, useEffect, useState} from 'react';
import {Route} from '../lib/url/Route';
import {RouteContext} from './RouteContext';

export type WithRoute = Route['evaluate'];

export function useRoute(): [Route, WithRoute] {
    let route = useContext(RouteContext);
    let [, setHref] = useState(route.href);

    useEffect(
        () => route.subscribe(({href}) => setHref(href)),
        [route],
    );

    let withRoute: WithRoute = useCallback(
        (locationPattern, x, y) => route.evaluate(locationPattern, x, y),
        [route],
    );

    return [route, withRoute];
}
