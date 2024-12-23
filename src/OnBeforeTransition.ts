import type {Route} from '../lib/url/Route';
import type {TransitionType} from '../lib/url/TransitionType';

export type OnBeforeTransition = (
    route: Route,
    nextHref: string,
    transitionType?: TransitionType,
) => boolean | void | undefined | Promise<boolean | void | undefined>;
