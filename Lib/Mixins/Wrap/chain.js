export function createChainable(fn) {
    const middlewares = new Map();
    function addMiddleware(name, middleware) {
        middlewares.set(name, middleware);
        return chainableFunction;
    }
    function removeMiddleware(name) {
        middlewares.delete(name);
        return chainableFunction;
    }
    function run(...args) {
        let result = args;
        for (const middleware of middlewares.values()) {
            result = [middleware(result[0], ...result.slice(1))];
        }
        return fn(...result);
    }
    const chainableFunction = {
        use: addMiddleware,
        remove: removeMiddleware,
        run
    };
    return chainableFunction;
}