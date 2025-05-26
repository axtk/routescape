export const isSameOrigin = (url: string): boolean => {
    try {
        return (
            new URL(url, window.location.href).origin ===
            window.location.origin
        );
    } catch {
        return false;
    }
};
