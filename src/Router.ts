import {createElement, ReactNode} from 'react';
import {Route} from '../lib/url/Route';
import {OnBeforeTransition} from './OnBeforeTransition';
import {RouteContext} from './RouteContext';

export type RouterProps = {
    location?: string | null | undefined | Route;
    children?: ReactNode;
    onBeforeTransition?: OnBeforeTransition;
};

export const Router = ({
    location,
    children,
    onBeforeTransition,
}: RouterProps) => {
    let route: Route;

    if (location instanceof Route)
        route = location;
    else if (location === undefined || location === null || typeof location === 'string')
        route = new Route(location);
    else
        throw new Error('Router location of unsupported type');

    if (onBeforeTransition)
        route.use((nextHref, _prevHref, transitionType) => {
            return onBeforeTransition(route, nextHref, transitionType);
        });

    return createElement(RouteContext.Provider, {value: route}, children);
};
