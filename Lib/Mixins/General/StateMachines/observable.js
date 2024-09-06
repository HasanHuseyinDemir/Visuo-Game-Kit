export function observableMixin(initialState = {}, hooks = {}) {
    let state={...initialState};
    return {
            state,
            hooks:{...hooks},
            setState(newState) {
                for(let key in newState) {
                    if(state[key]!==newState[key]) {
                        const before=state[key];
                        state[key]=newState[key];
                        if (this.hooks.onChange) {
                            this.hooks.onChange({key,before,current:state[key]});
                        }
                    }
                }
            },
            getState() {
                return {...state};
            }
    };
}
