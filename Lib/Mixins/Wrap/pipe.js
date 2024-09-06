export function pipeMixin(base = {}) {
    return {
        ...base,
        pipe(...fns) {
            return fns.reduce((acc, fn) => fn(acc), this);
        }
    };
}