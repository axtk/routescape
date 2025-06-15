export type EnhanceHref<T extends {href?: string | undefined}> = Omit<T, 'href'> & {
    href?:
        | string
        // allow stringifiable URL pattern objects
        | {_schema: unknown, toString: () => string}
        | undefined;
};
