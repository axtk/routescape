import type {MatchParams} from './MatchParams';

export type MatchHandler<T> = (payload: MatchParams) => T;
