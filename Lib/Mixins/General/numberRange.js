export function numberRangeMixin({ minNumber = 0, maxNumber = 100, currentNumber = 0, hooks = {} } = {}) {
    currentNumber=Math.max(minNumber,Math.min(maxNumber, currentNumber));
    return {
            minNumber,
            maxNumber,
            currentNumber,
            hooks:{...hooks},
            increase(amount=1) {
                let newValue = this.currentNumber + amount;
                if (newValue > this.maxNumber) {
                    newValue = this.maxNumber;
                }
                if (this.currentNumber !== newValue) {
                    const diff = Math.abs(this.currentNumber - newValue);
                    const call = { oldValue: this.currentNumber, newValue, diff };
                    this.currentNumber = newValue;
                    this._triggerHooks('onIncrease', call);
                    this._triggerHooks('onChange', call);
                }
            },
            decrease(amount = 1) {
                let newValue = this.currentNumber - amount;
                if (newValue < this.minNumber) {
                    newValue = this.minNumber;
                }
                if (this.currentNumber !== newValue) {
                    const diff = Math.abs(this.currentNumber - newValue);
                    const call = { oldValue: this.currentNumber, newValue, diff };
                    this.currentNumber = newValue;
                    this._triggerHooks('onDecrease', call);
                    this._triggerHooks('onChange', call);
                }
            },
            set(value) {
                let newValue = Math.max(this.minNumber, Math.min(this.maxNumber, value));
                if (this.currentNumber !== newValue) {
                    const diff = Math.abs(this.currentNumber - newValue);
                    const call = { oldValue: this.currentNumber, newValue, diff };
                    this.currentNumber = newValue;
                    if (newValue > this.currentNumber) {
                        this._triggerHooks('onIncrease', call);
                    } else if (newValue < this.currentNumber) {
                        this._triggerHooks('onDecrease', call);
                    }
                }
            },
            get() {
                return this.currentNumber;
            },
            _triggerHooks(type, call) {
                if (this.hooks[type]) {
                    this.hooks[type](call);
                }
            }
        }
    };
