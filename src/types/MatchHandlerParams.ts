import type {LocationPattern} from './LocationPattern';
import type {LocationShape} from './LocationShape';
import type {UnpackedURLSchema} from './UnpackedURLSchema';
import type {URLSchema} from './URLSchema';

type WithFallback<T, Fallback> = T extends undefined
    ? Fallback
    : T extends null
      ? Fallback
      : T;

type NormalizedParams<T extends LocationShape | undefined, X> = {
    href: string;
} & WithFallback<
    {
        params: WithFallback<NonNullable<T>['params'], Record<string, X>>;
        query: WithFallback<NonNullable<T>['query'], Record<string, X>>;
    },
    {
        params: Record<string, X>;
        query: Record<string, X>;
    }
>;

export type MatchHandlerParams<P extends LocationPattern> = P extends {
    _schema: URLSchema;
}
    ? NormalizedParams<UnpackedURLSchema<P['_schema']>, never>
    : NormalizedParams<LocationShape<string>, string>;
