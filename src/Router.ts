import {createElement, type ReactNode, useEffect} from 'react';
import {RouteContext} from './RouteContext';
import {Route} from './utils/Route';

export type RouterProps = {
    location?: string | null | undefined | Route;
    children?: ReactNode;
};

export const Router = ({location, children}: RouterProps) => {
    let route: Route;

    if (location instanceof Route) route = location;
    else if (
        location === undefined ||
        location === null ||
        typeof location === 'string'
    )
        route = new Route(location);
    else throw new Error('Router location of unsupported type');

    useEffect(() => () => route.cleanup(), [route]);

    return createElement(RouteContext.Provider, {value: route}, children);
};
