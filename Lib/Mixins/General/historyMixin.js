export function historyMixin({ initialState = {} } = {}) {
    let history = [];
    let currentIndex = -1;
    let state = { ...initialState };
    return {
            state,
            history,
            currentIndex,
            addState(newState) {
                if (currentIndex < history.length - 1) {
                    history = history.slice(0, currentIndex + 1);
                }
                history.push({ ...state });
                currentIndex++;
                state = { ...newState };
                this._triggerChange();
            },
            undo() {
                if (currentIndex > 0) {
                    currentIndex--;
                    state = { ...history[currentIndex] };
                    this._triggerChange();
                }
            },
            redo() {
                if (currentIndex < history.length - 1) {
                    currentIndex++;
                    state = { ...history[currentIndex] };
                    this._triggerChange();
                }
            },
            getState() {
                return { ...state };
            },
            clearHistory() {
                history = [];
                currentIndex = -1;
            },
            _triggerChange() {
                if (typeof this.onChange === 'function') {
                    this.onChange({ state: { ...state }, history: [...history], currentIndex });
                }
            }
        }
    };