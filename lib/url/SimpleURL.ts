/**
 * A simplified polyfill for the native `URL` class reduced to
 * fulfill the needs of the package.
 */
export class SimpleURL {
    href: string;
    origin: string;
    pathname: string;
    search: string;
    hash: string;

    constructor(location: string, origin?: string) {
        if (location !== null && location !== undefined && typeof location !== 'string')
            location = String(location);

        if (origin !== null && origin !== undefined && typeof origin !== 'string')
            origin = String(origin);

        let urlRegExp = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
        let locationParts = (location && location.match(urlRegExp)) || [];
        let originParts = (origin && origin.match(urlRegExp)) || [];

        if (!locationParts[4] && !originParts[4])
            throw new Error('Invalid URL');

        this.origin = locationParts[4]
            ? locationParts[1] + locationParts[3]
            : originParts[1] + originParts[3];

        this.pathname = ((locationParts[5] || '').startsWith('/') ? '' : '/') +
            (locationParts[5] || '');

        this.search = locationParts[6] || '';
        this.hash = locationParts[8] || '';
        this.href = this.origin + this.pathname + this.search + this.hash;
    }
}
