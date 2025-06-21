import type {LocationValue} from '../types/LocationValue';

export const isSameOrigin = (url: LocationValue): boolean => {
    if (url === undefined) return false;

    try {
        return (
            new URL(String(url), window.location.href).origin ===
            window.location.origin
        );
    } catch {
        return false;
    }
};
