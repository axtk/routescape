import type {LocationShape} from './LocationShape';
import type {URLSchema} from './URLSchema';

// URL builder output
export type LocationObject = {
    _schema: URLSchema;
    exec: (x: string) => LocationShape | null;
    toString: () => string;
};
