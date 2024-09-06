export function eventEmitterMixin() {
    const events={};
    return {
            on(event,listener) {
                if (!events[event]){
                    events[event]=[];
                }
                events[event].push(listener);
            },
            off(event,listener){
                if (!events[event]) return;
                events[event]=events[event].filter(l=>l!==listener);
            },
            emit(event,...args) {
                if (events[event]){
                    events[event].forEach(listener =>listener(...args));
                }
            }
        }
    };
