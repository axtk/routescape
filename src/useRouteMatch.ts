import {useMemo} from 'react';
import {useRoute} from './useRoute';
import type {LocationPattern} from './types/LocationPattern';

export function useRouteMatch<P extends LocationPattern>(locationPattern: P) {
    let {route} = useRoute();

    return useMemo(
        () => route._getMatch<P>(locationPattern),
        [route, route.href, locationPattern],
    );
}
