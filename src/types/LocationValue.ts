import type {Config} from './Config';
import type {LocationObject} from './LocationObject';

export type LocationValue = Config extends {strict: true}
    ? (LocationObject | undefined)
    : (string | LocationObject | undefined);
