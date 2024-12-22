import {TransitionType} from './TransitionType';

export type LocationHandler = (
    nextHref: string,
    prevHref: string | null,
    transitionType?: TransitionType,
) => boolean | void | undefined | Promise<boolean | void | undefined>;
