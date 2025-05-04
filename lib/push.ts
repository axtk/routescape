export function push<T>(list: T[], item: T) {
    list.push(item);

    return () => {
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i] === item) list.splice(i, 1);
        }
    };
}
