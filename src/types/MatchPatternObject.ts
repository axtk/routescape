import type {MatchShape} from './MatchShape';

export type MatchPatternObject = {
    _schema: MatchShape;
    exec: (x: string) => MatchShape | null;
};
