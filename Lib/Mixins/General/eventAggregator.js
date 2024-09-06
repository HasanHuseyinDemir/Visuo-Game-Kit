export function eventAggregatorMixin(){
    const events={};
    return {
        eventAggregator:{
            subscribe(event, listener) {
                if (!events[event]) {
                    events[event] = [];
                }
                events[event].push(listener);
            },
            unsubscribe(event, listener) {
                if (!events[event]) return;
                events[event] = events[event].filter(l => l !== listener);
            },
            publish(event, data) {
                if (events[event]) {
                    events[event].forEach(listener => listener(data));
                }
            }
        }
    };
}
