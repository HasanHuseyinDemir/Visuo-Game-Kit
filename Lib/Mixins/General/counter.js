export function counterMixin({ initialValue = 0, hooks = {} } = {}) {
    let count = initialValue;
    return {
            hooks,
            getValue(){
                return count;
            },
            increment(amount = 1){
                const oldValue=count;
                count+=amount;
                this._triggerHooks('onIncrement',{ oldValue,newValue:count});
                this._triggerHooks('onChange',{oldValue,newValue:count});
            },
            decrement(amount = 1) {
                const oldValue=count;
                count -= amount;
                this._triggerHooks('onDecrement',{oldValue,newValue:count});
                this._triggerHooks('onChange',{oldValue,newValue:count});
            },
            reset() {
                const oldValue=count;
                const diff=(count!==0)
                count=0;
                this._triggerHooks('onReset',{oldValue,newValue:count});
                diff?this._triggerHooks('onChange',{oldValue,newValue:count}):""
            },
            _triggerHooks(type, call) {
                if (this.hooks[type]) {
                    this.hooks[type](call);
                }
            }
        }
    };

