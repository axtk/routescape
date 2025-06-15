import type {MatchPattern} from './MatchPattern';
import type {MatchShape} from './MatchShape';
import type {URLSchema} from './URLSchema';
import type {UnpackedURLSchema} from './UnpackedURLSchema';

export type MatchParams<P extends MatchPattern> = P extends {
    _schema: URLSchema;
}
    ? UnpackedURLSchema<P['_schema']>
    : MatchShape<string>;
