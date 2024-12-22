import {createElement, ReactNode} from 'react';
import {Route} from '../lib/url/Route';
import {RouteContext} from './RouteContext';

export type RouterProps = {
    location?: string | null | undefined | Route;
    children?: ReactNode;
};

export const Router = ({location, children}: RouterProps) => {
    let value;

    if (location instanceof Route)
        value = location;
    else if (location === undefined || location === null || typeof location === 'string')
        value = new Route(location);
    else
        throw new Error('Router location of unknown type');

    return createElement(RouteContext.Provider, {value}, children);
};
