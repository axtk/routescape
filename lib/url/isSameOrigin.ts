import {IsomorphicURL} from './IsomorphicURL';

export const isSameOrigin = (url: string): boolean => {
    try {
        return new IsomorphicURL(url, window.location.href).origin === window.location.origin;
    }
    catch {
        return false;
    }
};
