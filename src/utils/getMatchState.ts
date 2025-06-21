import type {LocationPattern} from '../types/LocationPattern';
import type {MatchState} from '../types/MatchState';
import {getQuery} from './getQuery';
import {isLocationObject} from './isLocationObject';
import {match} from './match';

export function getMatchState<P extends LocationPattern>(
    locationPattern: P,
    href: string,
) {
    let matches = match<P>(locationPattern, href);

    return {
        ok: matches !== null,
        href,
        params: matches?.params ?? {},
        query:
            matches?.query ??
            (isLocationObject(locationPattern) ? null : getQuery(href)) ??
            {},
    } as MatchState<P>;
}
