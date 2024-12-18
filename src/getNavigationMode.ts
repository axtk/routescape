import type {LinkNavigationProps} from './LinkNavigationProps';
import type {NavigationMode} from './NavigationMode';

export function getNavigationMode(x: HTMLElement | LinkNavigationProps): NavigationMode {
    if (x instanceof HTMLElement)
        return x.dataset.navigationMode as NavigationMode;

    return x['data-navigation-mode'];
}
