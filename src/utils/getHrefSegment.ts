import {syntheticOrigin} from './syntheticOrigin';

export function getHrefSegment(
    href: string,
    segment: 'pathname' | 'search' | 'hash',
): string {
    return new URL(href, syntheticOrigin)[segment];
}
