import {useMemo} from 'react';
import type {LocationPattern} from './types/LocationPattern';
import type {MatchState} from './types/MatchState';
import {useRoute} from './useRoute';
import {getMatchState} from './utils/getMatchState';

export function useRouteMatch<P extends LocationPattern>(locationPattern?: P) {
    let {route} = useRoute();

    return useMemo(
        () =>
            getMatchState(
                locationPattern === undefined ? route.href : locationPattern,
                route.href,
            ),
        [locationPattern, route.href],
    ) as MatchState<P>;
}
