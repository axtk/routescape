import {IsomorphicURL} from './IsomorphicURL';
import {syntheticOrigin} from './syntheticOrigin';

export function getHrefSegment(
    href: string,
    segment: 'pathname' | 'search' | 'hash',
): string {
    return new IsomorphicURL(href, syntheticOrigin)[segment];
}
