import type {LocationValue} from './LocationValue';

export type LocationPattern =
    | LocationValue
    | RegExp
    | (LocationValue | RegExp)[];
