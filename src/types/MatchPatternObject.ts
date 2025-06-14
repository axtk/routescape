import type {MatchShape} from './MatchShape';
import type {URLSchema} from './URLSchema';

export type MatchPatternObject = {
    _schema: URLSchema;
    exec: (x: string) => MatchShape | null;
};
