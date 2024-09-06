export function stepCallMixin({ functions = [], loop = false, hooks = {} } = {}) {
    let index = 0;
    index = functions.length > 0 ? index % functions.length : 0;
    return {
            getCurrentFunction() {
                return functions[index];
            },
            next(params = {}) {
                if (functions.length === 0) return;
                const currentFunction = functions[index];
                if (typeof currentFunction === 'function') {
                    currentFunction(params);
                }
                this._triggerHooks('onStep', { index, params });
                this._triggerHooks('onNext', { index, params });
                index = (index + 1) % functions.length;
                if (!loop && index >= functions.length) {
                    index = functions.length - 1;
                }
            },
            previous(params = {}) {
                if (functions.length === 0) return;
                const currentFunction = functions[index];
                if (typeof currentFunction === 'function') {
                    currentFunction(params);
                }
                this._triggerHooks('onStep', { index, params });
                this._triggerHooks('onPrevious', { index, params });
                index = (index - 1 + functions.length) % functions.length;
                if (!loop && index < 0) {
                    index = 0;
                }
            },
            setFunctions(newFunctions) {
                functions = newFunctions;
                index = 0;
            },
            addFunction(fn) {
                functions.push(fn);
            },
            removeFunction(fn) {
                const indexToRemove = functions.indexOf(fn);
                if (indexToRemove !== -1) {
                    functions.splice(indexToRemove, 1);
                    if (index >= functions.length) {
                        index = functions.length - 1;
                    }
                }
            },
            _triggerHooks(type, call) {
                if (hooks[type]) {
                    hooks[type](call);
                }
            }
        }
    };
