import type {MatchPayload} from './MatchPayload';

export type MatchHandler<T> = (payload: MatchPayload) => T;
