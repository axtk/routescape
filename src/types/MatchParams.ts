import type {Schema, UnpackedSchema} from 'unpack-schema';
import type {MatchPattern} from './MatchPattern';
import type {MatchShape} from './MatchShape';

export type MatchParams<P extends MatchPattern> = P extends {
    _schema: Schema<MatchShape>;
}
    ? UnpackedSchema<P['_schema']>
    : MatchShape;
