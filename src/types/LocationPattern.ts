import type {Config} from './Config';
import type {LocationValue} from './LocationValue';

export type LocationPattern = Config extends {strict: true}
    ? (LocationValue | LocationValue[])
    : (LocationValue | RegExp | (LocationValue | RegExp)[]);
