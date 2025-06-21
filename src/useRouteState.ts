import {useCallback, useMemo} from 'react';
import type {LocationShape} from './types/LocationShape';
import type {LocationValue} from './types/LocationValue';
import type {NavigationMode} from './types/NavigationMode';
import {useRoute} from './useRoute';
import {getHrefSegment} from './utils/getHrefSegment';
import {getMatchState} from './utils/getMatchState';
import {isLocationObject} from './utils/isLocationObject';

type Compile = <S extends LocationShape>(data: S) => string;
type SetState = <S extends LocationShape>(data: S) => void;

export function useRouteState<T extends LocationValue>(
    location: T,
    navigationMode?: NavigationMode,
) {
    let {route} = useRoute();

    let compile = useCallback<Compile>(
        data => {
            if (isLocationObject(location)) return location.compile(data);

            if (!data?.query) return location ?? '';

            let path = getHrefSegment(location ?? '', 'pathname');
            let hash = getHrefSegment(location ?? '', 'hash');

            let searchParams = new URLSearchParams();

            for (let [key, value] of Object.entries(data.query)) {
                if (value !== null && value !== undefined)
                    searchParams.append(
                        key,
                        typeof value === 'string'
                            ? value
                            : JSON.stringify(value),
                    );
            }

            let search = searchParams.toString();

            return `${path}${search ? `?${search}` : ''}${hash}`;
        },
        [location],
    );

    let setState = useCallback<SetState>(
        data => {
            let nextLocation = compile(data);

            if (navigationMode === 'replace') route.replace(nextLocation);
            else route.assign(nextLocation);
        },
        [route, navigationMode, compile],
    );

    let state = useMemo(
        () => getMatchState<T>(location, route.href),
        [location, route.href],
    );

    return [state, setState] as [typeof state, SetState];
}
