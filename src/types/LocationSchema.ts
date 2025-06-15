import type {Schema} from 'unpack-schema';

export type LocationSchema = {
    params?: Schema<Record<string, unknown>>;
    query?: Schema<Record<string, unknown>>;
} | null;
