function throttleMixin(interval) {
    let lastCall = 0;
    return {
        throttleFn(fn) {
            return (...args) => {
                const now = Date.now();
                if (now - lastCall > interval) {
                    lastCall = now;
                    return fn(...args);
                }
            };
        }
    };
}
