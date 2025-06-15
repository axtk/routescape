import type {LocationValue} from './LocationValue';

export type EnhanceHref<T extends {href?: string | undefined}> = Omit<
    T,
    'href'
> & {
    href?: LocationValue;
};
