export function methodMixin(initialMethods) {
    let obj = {};
    function isFunction(value) {
        return typeof value === 'function';
    }
    for (const [name, func] of Object.entries(initialMethods)) {
        if (isFunction(func)) {
            obj[name] = func;
        } else {
            throw new Error(`Initial method '${name}' is not a function`);
        }
    }
    return {
        add(name, func) {
            if (!isFunction(func)) {
                throw new Error(`Value for '${name}' is not a function`);
            }
            obj[name] = func;
        },
        clear() {
            obj = {};
        },
        remove(name) {
            if (obj[name]) {
                obj[name]=undefined
            } else {
                throw new Error(`Method '${name}' not found`);
            }
        },
        list() {
            return Object.keys(obj);
        },
        execute(method, ...arg) {
            if (obj[method]) {
                return obj[method](...arg);
            } else if (obj['default']) {
                return obj['default'](...arg);
            } else {
                throw new Error(`Method '${method}' not found`);
            }
        },
        setDefault(func) {
            if (!isFunction(func)) {
                throw new Error('Default value must be a function');
            }
            obj['default'] = func;
        }
    };
}
