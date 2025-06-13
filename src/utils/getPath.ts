import type {LocationValue} from '../types/LocationValue';
import type {PathProps} from '../types/PathProps';
import {syntheticOrigin} from './syntheticOrigin';

export const getPath = (
    location: LocationValue,
    pathProps: PathProps = {},
): string => {
    let url: URL | null = null;

    if (location === undefined || location === null)
        url =
            typeof window === 'undefined'
                ? null
                : new URL(window.location.href);
    else url = new URL(location, syntheticOrigin);

    if (!url) return '';

    return (
        (pathProps.pathname === false ? '' : url.pathname) +
        (pathProps.search === false ? '' : url.search) +
        (pathProps.hash === false ? '' : url.hash)
    );
};
