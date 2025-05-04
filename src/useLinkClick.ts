import {type MouseEvent, useCallback, useContext} from 'react';
import {isRouteEvent} from '../lib/isRouteEvent';
import type {AProps} from './AProps';
import type {AreaProps} from './AreaProps';
import {RouteContext} from './RouteContext';
import {getNavigationMode} from './getNavigationMode';

export type UseLinkClickParams = AProps | AreaProps;

export function useLinkClick(props: UseLinkClickParams) {
    let {href, target, onClick} = props;
    let route = useContext(RouteContext);
    let navigationMode = getNavigationMode(props);

    return useCallback(
        (event: MouseEvent<HTMLAnchorElement & HTMLAreaElement>) => {
            onClick?.(event);

            if (
                !event.defaultPrevented &&
                isRouteEvent(event, {href, target})
            ) {
                event.preventDefault();

                if (navigationMode === 'replace') route.replace(href);
                else route.assign(href);
            }
        },
        [route, href, target, onClick, navigationMode],
    );
}
