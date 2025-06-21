export type LocationShape<T = unknown> = {
    params?: Record<string, T> | undefined;
    query?: Record<string, T> | undefined;
} | null;
