import type {NavigationMode} from './NavigationMode';

type Handler<R> = (
    nextHref: string,
    prevHref: string,
    navigationMode?: NavigationMode,
) => R | Promise<R>;

export type NavigationHandler = Handler<boolean | undefined> | Handler<void>;
