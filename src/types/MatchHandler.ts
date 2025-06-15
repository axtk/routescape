import type {MatchParams} from './MatchParams';
import type {LocationPattern} from './LocationPattern';

export type MatchHandler<P extends LocationPattern, T> = (
    payload: NonNullable<MatchParams<P>>,
) => T;
