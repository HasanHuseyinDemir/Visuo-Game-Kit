export function booleanControlMixin(initialValue, onTrue = () => {}, onFalse = () => {}, onChange = () => {}) {
    let value = initialValue;
    return {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue !== value) {
                let before=value
                let call={before,newValue}
                value = newValue;
                onChange(call);
                if (newValue) {
                    return onTrue(call);
                } else {
                    return onFalse(call);
                }
            }
        },
        toggle() {
            this.set(!value);
        }
    };
}
