import {useCallback, useMemo} from 'react';
import {getHrefSegment} from './utils/getHrefSegment';
import {isLocationObject} from './utils/isLocationObject';
import type {LocationValue} from './types/LocationValue';
import type {LocationShape} from './types/LocationShape';
import type {NavigationMode} from './types/NavigationMode';
import {useRoute} from './useRoute';

type Compile = <S extends LocationShape>(data: S) => string;
type SetState = <S extends LocationShape>(data: S) => void;

export function useRouteState<T extends LocationValue>(
    location: T,
    navigationMode?: NavigationMode,
) {
    let {route} = useRoute();

    let setState = useCallback(() => {
        let compile: Compile;

        if (isLocationObject(location))
            compile = location.compile.bind(location);
        else {
            compile = (data: LocationShape) => {
                if (!data?.query)
                    return location ?? '';

                let path = getHrefSegment(location ?? '', 'pathname');
                let hash = getHrefSegment(location ?? '', 'hash');

                let search = new URLSearchParams();

                for (let [key, value] of Object.entries(data.query)) {
                    if (value !== null && value !== undefined)
                        search.append(
                            key,
                            typeof value === 'string' ? value : JSON.stringify(value),
                        );
                }

                let searchString = search.toString();

                return `${path}${searchString ? `?${searchString}` : ''}${hash}`;
            };
        }

        let setState: SetState = data => {
            let nextLocation = compile(data);

            if (navigationMode === 'replace')
                route.replace(nextLocation);
            else route.assign(nextLocation);
        };

        return setState;
    }, [route, location, navigationMode]);

    let state = useMemo(
        () => route._getMatch<T>(location),
        [route, route.href, location],
    );

    return [state, setState] as [typeof state, SetState];
}
