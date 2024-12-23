import {createElement, ReactNode} from 'react';
import {Route, Middleware} from '../lib/url/Route';
import {RouteContext} from './RouteContext';

export type RouterProps = {
    location?: string | null | undefined;
    children?: ReactNode;
    onBeforeTransition?: Middleware;
} | {
    location?: Route;
    children?: ReactNode;
};

export const Router = ({location, children, ...props}: RouterProps) => {
    let route: Route;

    if (location instanceof Route)
        route = location;
    else if (location === undefined || location === null || typeof location === 'string')
        route = new Route(
            location,
            'onBeforeTransition' in props ? props.onBeforeTransition : undefined,
        );
    else
        throw new Error('Router location of unsupported type');

    return createElement(RouteContext.Provider, {value: route}, children);
};
