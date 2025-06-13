import type {MatchParams} from '../types/MatchParams';
import type {MatchPattern} from '../types/MatchPattern';
import type {MatchPatternObject} from '../types/MatchPatternObject';
import type {MatchShape} from '../types/MatchShape';

function toObject(x: string[]) {
    return x.reduce<Record<string, unknown>>((p, v, k) => {
        p[String(k)] = v;

        return p;
    }, {});
}

function isMatchPatternObject(x: unknown): x is MatchPatternObject {
    return x !== null && typeof x === 'object' && 'exec' in x && '_schema' in x;
}

export function match<P extends MatchPattern>(
    pattern: P,
    value: unknown,
): MatchParams<P> {
    let result: MatchShape = null;

    if (Array.isArray(pattern)) {
        for (let p of pattern) {
            let matches = match(p, value);

            if (matches) {
                result = matches;
                break;
            }
        }
    }
    else if (typeof pattern === 'string')
        result = pattern === '*' || pattern === value ? {} : null;
    else if (pattern instanceof RegExp) {
        let matches = pattern.exec(String(value));

        result = matches ? {
            params: {
                ...toObject(Array.from(matches).slice(1)),
                ...matches.groups,
            },
        } : null;
    }
    else if (isMatchPatternObject(pattern))
        result = pattern.exec(String(value));

    return result as MatchParams<P>;
}
