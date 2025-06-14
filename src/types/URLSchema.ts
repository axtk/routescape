import type {Schema} from 'unpack-schema';

export type URLSchema = {
    params?: Schema<Record<string, unknown>>;
    query?: Schema<Record<string, unknown>>;
} | null;
