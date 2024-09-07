export function switcherMixin(config) {
    let prints = config.prints || {};
    let method = config.method || (() => "default");
    return {
        execute(...arg) {
            const methodName = method(...arg);
            const calledMethodName = prints[methodName] ? methodName : "default";
            if (prints[calledMethodName]) {
                return prints[calledMethodName](...arg);
            } else {
                throw new Error(`Method '${calledMethodName}' not found`);
            }
        },
        onPrint(name, func) {
            prints[name] = func;
        },
        setMethod(func) {
            method = func;
        },
        send(name, arg) {
            const calledName = prints[name] ? name : "default";
            if (prints[calledName]) {
                return prints[calledName](arg);
            } else {
                throw new Error(`Print function '${calledName}' not found`);
            }
        },
    };
}