export function firstOrUndefined<T>(items: T[]) {
    if (items.length === 0) {
        console.log('no results found')
        return;
    }
    return items[0];
}
