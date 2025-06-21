import {useMemo} from 'react';
import {getMatchState} from './utils/getMatchState';
import {useRoute} from './useRoute';
import type {LocationPattern} from './types/LocationPattern';

export function useRouteMatch<P extends LocationPattern>(locationPattern: P) {
    let {route} = useRoute();

    return useMemo(
        () => getMatchState<P>(locationPattern, route.href),
        [locationPattern, route.href],
    );
}
