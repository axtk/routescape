import {IsomorphicURL} from './IsomorphicURL';
import type {LocationValue} from './LocationValue';
import type {PathProps} from './PathProps';
import {syntheticOrigin} from './syntheticOrigin';

export const getPath = (
    location: LocationValue,
    pathProps: PathProps = {},
): string => {
    let url = location === undefined || location === null
        ? typeof window === 'undefined' ? undefined : new IsomorphicURL(window.location.href)
        : new IsomorphicURL(location, syntheticOrigin);

    if (!url)
        return '';

    return (
        (pathProps.pathname === false ? '' : url.pathname) +
        (pathProps.search === false ? '' : url.search) +
        (pathProps.hash === false ? '' : url.hash)
    );
};
