import {RefObject, useContext, useEffect} from 'react';
import {isArrayLike} from '../lib/isArrayLike';
import {isLinkElement} from '../lib/isLinkElement';
import {isRouteEvent} from '../lib/isRouteEvent';
import {getNavigationMode} from './getNavigationMode';
import {RouteContext} from './RouteContext';

/**
 * Subscribes links to route changes to enable history navigation
 * without page reloading.
 *
 * The links can be represented as a selector, or an HTML element,
 * or a collection of HTML elements.
 */
export function useRouteLinks(
    scopeRef: RefObject<Element | Document | null | undefined>,
    links: string | Node | (string | Node)[] | HTMLCollection | NodeList,
): void {
    let route = useContext(RouteContext);

    useEffect(() => {
        let handleClick = (event: MouseEvent) => {
            if (event.defaultPrevented)
                return;

            let scope = scopeRef.current;

            if (!scope)
                return;

            let elements = (isArrayLike(links) ? Array.from(links) : [links])
                .reduce<(HTMLAnchorElement | HTMLAreaElement)[]>((items, item) => {
                    let element: Node | null = null;

                    if (typeof item === 'string') {
                        element = event.target instanceof Element
                            ? event.target.closest(item)
                            : null;
                    }
                    else element = item;

                    if (
                        isLinkElement(element) &&
                        scope.contains(element) &&
                        isRouteEvent(event, element)
                    )
                        items.push(element);

                    return items;
                }, []);

            if (elements.length === 0)
                return;

            let element = elements[0];

            event.preventDefault();

            if (getNavigationMode(element) === 'replace')
                route.replace(element.href);
            else route.assign(element.href);
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [route, links, scopeRef]);
}
