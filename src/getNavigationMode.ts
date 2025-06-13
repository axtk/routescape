import type {NavigationMode} from './types/NavigationMode';
import type {LinkNavigationProps} from './types/LinkNavigationProps';

export function getNavigationMode(
    x: HTMLElement | LinkNavigationProps,
): NavigationMode | undefined {
    if ('dataset' in x)
        return x.dataset.navigationMode as NavigationMode | undefined;

    return x['data-navigation-mode'];
}
