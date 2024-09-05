function stateMixin({ state = {}, hooks = {} } = {}) {
    return {
            state: { ...state },
            hooks: { ...hooks },

            setState(newState) {
                this.state = { ...this.state, ...newState };
                if (this.hooks.onStateChange) {
                    this.hooks.onStateChange({ newState: this.state });
                }
            },

            getState() {
                return this.state;
            },

            resetState() {
                this.state = {};
                if (this.hooks.onStateReset) {
                    this.hooks.onStateReset();
                }
            }
        }
    };