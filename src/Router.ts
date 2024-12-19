import {createElement, ReactNode} from 'react';
import {NavigationLocation} from '../lib/url/NavigationLocation';
import {RouteContext} from './RouteContext';

export type RouterProps = {
    location?: string | null | undefined | NavigationLocation;
    children?: ReactNode;
};

export const Router = ({location, children}: RouterProps) => {
    let value;

    if (location instanceof NavigationLocation)
        value = location;
    else if (location === undefined || location === null || typeof location === 'string')
        value = new NavigationLocation(location);
    else
        throw new Error('Router location of unknown type');

    return createElement(RouteContext.Provider, {value}, children);
};
