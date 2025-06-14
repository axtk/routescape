import type {Schema} from 'unpack-schema';
import type {MatchShape} from './MatchShape';

export type MatchPatternObject = {
    _schema: Schema<MatchShape>;
    exec: (x: string) => MatchShape | null;
};
