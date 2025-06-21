import type {
    MouseEvent as ReactMouseEvent,
    TouchEvent as ReactTouchEvent,
} from 'react';
import type {LocationValue} from '../types/LocationValue';
import {isSameOrigin} from './isSameOrigin';

export type LinkProps = {
    href?: LocationValue;
    target?: string | null | undefined;
};

export function isRouteEvent(
    event: MouseEvent | TouchEvent | ReactMouseEvent | ReactTouchEvent,
    {href, target}: LinkProps | HTMLAnchorElement | HTMLAreaElement,
): boolean {
    return (
        (!('button' in event) || event.button === 0) &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey &&
        !event.metaKey &&
        (!target || target === '_self') &&
        (!href || isSameOrigin(href))
    );
}
