import type {MatchHandler} from '../match/MatchHandler';
import type {MatchParams} from '../match/MatchParams';
import {matchPattern} from '../match/matchPattern';
import {syntheticOrigin} from './syntheticOrigin';
import {getPath} from './getPath';
import {isSameOrigin} from './isSameOrigin';
import {IsomorphicURL} from './IsomorphicURL';
import type {LocationHandler} from './LocationHandler';
import type {LocationPattern} from './LocationPattern';
import type {LocationValue} from './LocationValue';
import type {TransitionType} from './TransitionType';

export class NavigationLocation {
    href: string;

    _listeners: LocationHandler[];
    _middleware: LocationHandler[];

    constructor(location?: LocationValue) {
        this._listeners = [];
        this._middleware = [];

        this.href = this.getHref(location);
    }

    init(): void {
        if (typeof window !== 'undefined')
            window.addEventListener('popstate', () => this.dispatch());
    }

    getHref(location?: LocationValue): string {
        return getPath(location);
    }

    subscribe(listener: LocationHandler): () => void {
        this._listeners.push(listener);

        return () => {
            for (let i = this._listeners.length - 1; i >= 0; i--) {
                if (this._listeners[i] === listener)
                    this._listeners.splice(i, 1);
            }
        };
    }

    use(middleware: LocationHandler): void {
        this._middleware.push(middleware);
    }

    dispatch(location?: LocationValue, transitionType?: TransitionType): void {
        if (this.transition(location, transitionType) === false)
            return;

        let prev = this.href;
        let next = this.getHref(location);

        this.href = next;

        for (let listener of this._listeners)
            listener(next, prev);
    }

    transition(location: LocationValue, type?: TransitionType): boolean | void | undefined {
        if (typeof window === 'undefined')
            return;

        let prev = this.href;
        let next = this.getHref(location);

        if (this._middleware.some(middleware => middleware(next, prev) === false))
            return false;

        if (!window.history || !isSameOrigin(next)) {
            switch (type) {
                case 'assign':
                    window.location.assign(next);
                    break;
                case 'replace':
                    window.location.replace(next);
                    break;
            }

            return;
        }

        switch (type) {
            case 'assign':
                window.history.pushState({}, '', next);
                break;
            case 'replace':
                window.history.replaceState({}, '', next);
                break;
        }
    }

    /*
     * Jumps the specified number of the browser history entries away
     * from the current entry.
     */
    go(delta: number): void {
        if (typeof window !== 'undefined' && window.history)
            window.history.go(delta);
    }

    /**
     * Matches the current location against the location pattern.
     */
    match(locationPattern: LocationPattern): MatchParams | null {
        return matchPattern(locationPattern, this.href);
    }

    /**
     * Checks whether the current location matches the location pattern.
     */
    matches(locationPattern: LocationPattern): boolean {
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
        locationPattern: LocationPattern,
        matchOutput?: X | MatchHandler<X>,
        mismatchOutput?: Y | MatchHandler<Y>,
    ): X | Y | undefined {
        let matches = matchPattern(locationPattern, this.href);

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
    assign(location: LocationValue): void {
        this.dispatch(location, 'assign');
    }

    /**
     * Replaces the current history entry
     * (similarly to [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).
     */
    replace(location: LocationValue): void {
        this.dispatch(location, 'replace');
    }

    reload(): void {
        this.dispatch();
    }

    back(): void {
        this.go(-1);
    }

    forward(): void {
        this.go(1);
    }

    get pathname() {
        return new IsomorphicURL(this.href, syntheticOrigin).pathname;
    }

    get search() {
        return new IsomorphicURL(this.href, syntheticOrigin).search;
    }

    get hash() {
        return new IsomorphicURL(this.href, syntheticOrigin).hash;
    }

    /**
     * Returns the current location, equals `.href`.
     */
    toString(): string {
        return this.href || '';
    }
}
