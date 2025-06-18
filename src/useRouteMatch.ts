import {useContext} from 'react';
import type {LocationPattern} from './types/LocationPattern';
import {RouteContext} from './RouteContext';

export function useRouteMatch<P extends LocationPattern>(locationPattern: P) {
    return useContext(RouteContext)._getMatch<P>(locationPattern);
}
