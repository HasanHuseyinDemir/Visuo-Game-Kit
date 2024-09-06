//Minimalistic version of v1 stateMachine
export function stateMixin({ state = {}, onChange } = {}) {
    return {
        state,
        onChange,
        set(state) {
            if (this.state!==state) {
                const before=this.state;
                this.state=state;
                if (this.onChange) {
                    this.onChange({before,current:this.state});
                }
            }
        },
        get() {
            return this.state;
        }
    };
}
