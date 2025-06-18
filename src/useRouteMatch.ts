import {useContext} from 'react';
import {RouteContext} from './RouteContext';
import type {LocationPattern} from './types/LocationPattern';

export function useRouteMatch<P extends LocationPattern>(locationPattern: P) {
    return useContext(RouteContext)._getMatch<P>(locationPattern);
}
