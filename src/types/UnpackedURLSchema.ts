import type {UnpackedSchema} from 'unpack-schema';
import type {URLSchema} from './URLSchema';

export type UnpackedURLSchema<T extends URLSchema> = T extends null
    ? undefined
    : NonNullable<T> extends {params: unknown; query: unknown}
      ? {
            params: UnpackedSchema<NonNullable<T>['params']>;
            query: UnpackedSchema<NonNullable<T>['query']>;
        }
      : NonNullable<T> extends {params: unknown}
        ? {
              params: UnpackedSchema<NonNullable<T>['params']>;
              query?: Record<string, never>;
          }
        : NonNullable<T> extends {query: unknown}
          ? {
                params?: Record<string, never>;
                query: UnpackedSchema<NonNullable<T>['query']>;
            }
          : undefined;
