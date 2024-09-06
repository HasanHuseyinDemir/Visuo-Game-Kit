export function logExecutionTime(fn) {
    return function(...args) {
        console.time('E.T.');
        const result = fn(...args);
        console.timeEnd('E.T.');
        return result;
    };
}