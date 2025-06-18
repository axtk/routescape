import type {LocationPattern} from './LocationPattern';
import type {LocationShape} from './LocationShape';
import type {UnpackedURLSchema} from './UnpackedURLSchema';
import type {URLSchema} from './URLSchema';

type WithFallback<T, Fallback> = T extends undefined
    ? Fallback
    : T extends null
      ? Fallback
      : T;

type NormalizedMatchParams<T extends LocationShape | undefined> = {
    href: string;
} & WithFallback<
    {
        params: WithFallback<NonNullable<T>['params'], Record<string, string>>;
        query: WithFallback<NonNullable<T>['query'], Record<string, string>>;
    },
    {
        params: Record<string, string>;
        query: Record<string, string>;
    }
>;

export type MatchParams<P extends LocationPattern> = NormalizedMatchParams<
    P extends {_schema: URLSchema}
        ? UnpackedURLSchema<P['_schema']>
        : LocationShape<string>
>;
