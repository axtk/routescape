import type {LocationPattern} from './LocationPattern';
import type {MatchParams} from './MatchParams';

export type MatchHandler<P extends LocationPattern, T> = (
    payload: NonNullable<MatchParams<P>>,
) => T;
