import type {LocationValue} from '../url/LocationValue';
import type {MatchParams} from './MatchParams';

export type MatchPayload = {
    href: LocationValue;
    params: MatchParams;
};
