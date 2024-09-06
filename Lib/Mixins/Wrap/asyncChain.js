export function createAsyncChainable(fn) {
    const middlewares = new Map();
    async function addMiddleware(name, middleware) {
        middlewares.set(name, middleware);
        return chainableFunction;
    }
    function removeMiddleware(name) {
        middlewares.delete(name);
        return chainableFunction;
    }
    async function run(...args) {
        let result = args;
        for (const middleware of middlewares.values()) {
            result = [await middleware(result[0], ...result.slice(1))];
        }
        return await fn(...result);
    }
    const chainableFunction = {
        use: addMiddleware,
        remove: removeMiddleware,
        run
    };
    return chainableFunction;
}
