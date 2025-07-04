import {useCallback, useMemo} from 'react';
import type {LocationValue} from './types/LocationValue';
import type {MatchState} from './types/MatchState';
import type {NavigationMode} from './types/NavigationMode';
import type {URLData} from './types/URLData';
import {useRoute} from './useRoute';
import {compileHref} from './utils/compileHref';
import {getMatchState} from './utils/getMatchState';

type SetState<T extends LocationValue> = (
    update: URLData<T> | ((state: MatchState<T>) => URLData<T>),
) => void;

export function useRouteState<T extends LocationValue>(
    location?: T,
    navigationMode?: NavigationMode,
) {
    let {route} = useRoute();

    let getState = useCallback(
        (href?: string) => {
            let resolvedHref = href ?? route.href;

            return getMatchState(
                location === undefined ? resolvedHref : location,
                resolvedHref,
            ) as MatchState<T>;
        },
        [location, route],
    );

    let setState = useCallback<SetState<T>>(
        update => {
            let data =
                typeof update === 'function' ? update(getState()) : update;

            let nextLocation = compileHref<T>(location, data);

            if (navigationMode === 'replace') route.replace(nextLocation);
            else route.assign(nextLocation);
        },
        [location, route, navigationMode, getState],
    );

    let state = useMemo(
        () => getState(route.href),
        [getState, route.href],
    ) as MatchState<T>;

    return [state, setState] as [typeof state, SetState<T>];
}
