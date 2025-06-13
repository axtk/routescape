import type {MatchParams} from './MatchParams';
import type {MatchPattern} from './MatchPattern';

export type MatchHandler<P extends MatchPattern, T> = (
    payload: NonNullable<MatchParams<P>>,
) => T;
