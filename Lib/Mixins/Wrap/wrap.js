export const Wrap = (...fns) => {
    return function(...args) {
        fns.forEach(fn => fn(...args));
    };
};