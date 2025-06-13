import type {MatchPattern} from '../types/MatchPattern';
import type {LocationValue} from '../types/LocationValue';
import type {MatchHandler} from '../types/MatchHandler';
import type {MatchParams} from '../types/MatchParams';
import type {NavigationHandler} from '../types/NavigationHandler';
import type {NavigationMode} from '../types/NavigationMode';
import {getHrefSegment} from './getHrefSegment';
import {getPath} from './getPath';
import {isSameOrigin} from './isSameOrigin';
import {match} from './match';
import {push} from './push';

export class Route {
    href = '';
    initialized = false;

    _listeners: NavigationHandler[] = [];
    _middleware: NavigationHandler[] = [];
    _cleanup: (() => void) | null = null;

    constructor(location?: LocationValue) {
        this.init();

        Promise.resolve(this.dispatch(location)).then(() => {
            this.initialized = true;
        });
    }

    init(): void {
        if (typeof window === 'undefined') return;

        let handleNavigation = () => {
            this.dispatch();
        };

        window.addEventListener('popstate', handleNavigation);

        this._cleanup = () => {
            window.removeEventListener('popstate', handleNavigation);
        };
    }

    cleanup(): void {
        this._cleanup?.();
    }

    getHref(location?: LocationValue): string {
        return getPath(location);
    }

    subscribe(listener: NavigationHandler) {
        return push(this._listeners, listener);
    }

    use(middleware: NavigationHandler) {
        return push(this._middleware, middleware);
    }

    async dispatch(
        location?: LocationValue,
        navigationMode?: NavigationMode,
    ): Promise<void> {
        let prevHref = this.href;
        let nextHref = this.getHref(location);

        for (let middleware of [...this._middleware, this.transition]) {
            let result = middleware(nextHref, prevHref, navigationMode);

            if ((result instanceof Promise ? await result : result) === false)
                return;
        }

        this.href = nextHref;

        for (let listener of this._listeners) {
            let result = listener(nextHref, prevHref, navigationMode);

            if (result instanceof Promise) await result;
        }
    }

    transition: NavigationHandler = (nextHref, _prevHref, navigationMode) => {
        if (typeof window === 'undefined') return;

        if (
            !this.initialized &&
            this.getHref(window.location.href) === nextHref
        )
            return;

        if (!window.history || !isSameOrigin(nextHref)) {
            switch (navigationMode) {
                case 'assign':
                    window.location.assign(nextHref);
                    break;
                case 'replace':
                    window.location.replace(nextHref);
                    break;
            }

            return;
        }

        switch (navigationMode) {
            case 'assign':
                window.history.pushState({}, '', nextHref);
                break;
            case 'replace':
                window.history.replaceState({}, '', nextHref);
                break;
        }
    };

    /**
     * Matches the current location against the location pattern.
     */
    match(locationPattern: MatchPattern): MatchParams | null {
        return match(locationPattern, this.href);
    }

    /**
     * Checks whether the current location matches the location pattern.
     */
    matches(locationPattern: MatchPattern): boolean {
        return this.match(locationPattern) !== null;
    }

    /**
     * Loosely resembles the conditional ternary operator (`condition ? x : y`):
     * if the current location matches the location pattern the returned value
     * is based on the second parameter, otherwise on the third parameter.
     *
     * `.evaluate(locationPattern, x, y)` returns either `x({href, params})` or
     * `y({href, params})` if they are functions, `x` or `y` themselves otherwise.
     */
    evaluate<X = undefined, Y = undefined>(
        locationPattern: MatchPattern,
        matchOutput?: X | MatchHandler<X>,
        mismatchOutput?: Y | MatchHandler<Y>,
    ): X | Y | undefined {
        let matches = match(locationPattern, this.href);

        if (matches === null)
            return typeof mismatchOutput === 'function'
                ? (mismatchOutput as MatchHandler<Y>)(matches ?? {})
                : mismatchOutput;

        return typeof matchOutput === 'function'
            ? (matchOutput as MatchHandler<X>)(matches ?? {})
            : matchOutput;
    }

    /**
     * Adds an entry to the browser's session history
     * (similarly to [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState).
     */
    async assign(location: LocationValue) {
        return this.dispatch(location, 'assign');
    }

    /**
     * Replaces the current history entry
     * (similarly to [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).
     */
    async replace(location: LocationValue) {
        return this.dispatch(location, 'replace');
    }

    async reload() {
        return this.dispatch();
    }

    /*
     * Jumps the specified number of the browser history entries away
     * from the current entry.
     */
    go(delta: number): void {
        if (typeof window !== 'undefined' && window.history)
            window.history.go(delta);
    }

    back() {
        this.go(-1);
    }

    forward() {
        this.go(1);
    }

    get pathname() {
        return getHrefSegment(this.href, 'pathname');
    }

    get search() {
        return getHrefSegment(this.href, 'search');
    }

    get hash() {
        return getHrefSegment(this.href, 'hash');
    }

    /**
     * Returns the current location, equals `.href`.
     */
    toString(): string {
        return this.href || '';
    }
}
