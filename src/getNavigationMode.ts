import type {NavigationMode} from '../lib/url/NavigationMode';
import type {LinkNavigationProps} from './LinkNavigationProps';

export function getNavigationMode(
    x: HTMLElement | LinkNavigationProps,
): NavigationMode | undefined {
    if ('dataset' in x)
        return x.dataset.navigationMode as NavigationMode | undefined;

    return x['data-navigation-mode'];
}
