//Animasyonlar için kullanılabilir
export function stepMixin({ start = 0, end = 10, step = 1, loop = false, hooks = {} } = {}) {
    let current = start;
    current = Math.max(start, Math.min(end, current));
    return {
        getValue() {
            return current;
        },
        next() {
            const oldValue = current;
            current += step;
            if (current > end) {
                if (loop) {
                    current = start;
                } else {
                    current = end;
                }
            }
            this._triggerHooks('onNext', { oldValue, newValue: current });
            this._triggerHooks('onChange', { oldValue, newValue: current });
        },
        previous() {
            const oldValue = current;
            current -= step;
            if (current < start) {
                if (loop) {
                    current = end;
                } else {
                    current = start;
                }
            }
            this._triggerHooks('onPrevious', { oldValue, newValue: current });
            this._triggerHooks('onChange', { oldValue, newValue: current });
        },
        push(value) {
            const oldValue = current;
            current = value;
            if (current > end) {
                if (loop) {
                    current = start + (current - end - 1);
                } else {
                    current = end;
                }
            } else if (current < start) {
                if (loop) {
                    current = end - (start - current - 1);
                } else {
                    current = start;
                }
            }
            this._triggerHooks('onPush', { oldValue, newValue: current });
            this._triggerHooks('onChange', { oldValue, newValue: current });
        },
        setStep(newStep) {
            step = newStep;
        },
        _triggerHooks(type, call) {
            if (this.hooks[type]) {
                this.hooks[type](call);
            }
        }
    },
    hooks
};

