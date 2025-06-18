import type {LocationPattern} from './LocationPattern';
import type {MatchHandlerParams} from './MatchHandlerParams';

export type MatchHandler<P extends LocationPattern, T> = (
    payload: MatchHandlerParams<P>,
) => T;
