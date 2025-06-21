import type {URLSchema} from 'unpack-schema';
import type {LocationShape} from './LocationShape';

// URL builder output
export type LocationObject = {
    _schema: URLSchema;
    exec: (x: string) => LocationShape | null;
    compile: (x: unknown) => string;
    toString: () => string;
};
