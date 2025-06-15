import type {LocationPattern} from './LocationPattern';
import type {LocationShape} from './LocationShape';
import type {URLSchema} from './URLSchema';
import type {UnpackedURLSchema} from './UnpackedURLSchema';

export type MatchParams<P extends LocationPattern> = P extends {
    _schema: URLSchema;
}
    ? UnpackedURLSchema<P['_schema']>
    : LocationShape<string>;
