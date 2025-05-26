import type {LocationValue} from './LocationValue';
import type {PathProps} from './PathProps';
import {syntheticOrigin} from './syntheticOrigin';

export const getPath = (
    location: LocationValue,
    pathProps: PathProps = {},
): string => {
    let url =
        location === undefined || location === null
            ? typeof window === 'undefined'
                ? undefined
                : new URL(window.location.href)
            : new URL(location, syntheticOrigin);

    if (!url) return '';

    return (
        (pathProps.pathname === false ? '' : url.pathname) +
        (pathProps.search === false ? '' : url.search) +
        (pathProps.hash === false ? '' : url.hash)
    );
};
