import type {MatchPatternObject} from './MatchPatternObject';

export type MatchPattern = string | RegExp | MatchPatternObject | (string | RegExp | MatchPatternObject)[];
