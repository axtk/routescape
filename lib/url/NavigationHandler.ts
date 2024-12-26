import type {NavigationMode} from './NavigationMode';

export type NavigationHandler = (
    nextHref: string,
    prevHref: string,
    navigationMode?: NavigationMode,
) => boolean | void | undefined | Promise<boolean | void | undefined>;
