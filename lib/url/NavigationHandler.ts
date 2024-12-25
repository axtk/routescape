import type {TransitionType} from './TransitionType';

export type NavigationHandler = (
    nextHref: string,
    prevHref: string,
    transitionType?: TransitionType,
) => boolean | void | undefined | Promise<boolean | void | undefined>;
