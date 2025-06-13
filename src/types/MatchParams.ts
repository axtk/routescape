import type {MatchPattern} from './MatchPattern';
import type {MatchShape} from './MatchShape';

export type MatchParams<P extends MatchPattern> = P extends {
    _schema: MatchShape;
}
    ? P['_schema']
    : MatchShape;
