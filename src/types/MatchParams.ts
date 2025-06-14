import type {MatchPattern} from './MatchPattern';
import type {MatchShape} from './MatchShape';
import type {UnpackedURLSchema} from './UnpackedURLSchema';
import type {URLSchema} from './URLSchema';

export type MatchParams<P extends MatchPattern> = P extends {
    _schema: URLSchema;
}
    ? UnpackedURLSchema<P['_schema']>
    : MatchShape;
