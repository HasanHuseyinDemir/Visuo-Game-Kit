import { nodeMixin } from "../../General/nodeMixin.js";

export function eventorNodeMixin(initialData = null) {
    const baseNode = nodeMixin(initialData);

    const eventor = {
        type:"EVENTOR-NODE",
        events: new Map(),
        on(event, listener) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }
            this.events.get(event).push(listener);
        },
        off(event, listener) {
            const listeners = this.events.get(event);
            if (listeners) {
                this.events.set(event, listeners.filter(l => l !== listener));
            }
        },
        dispatch(event, ...args) {
            const listeners = this.events.get(event);
            if (listeners) {
                listeners.forEach(listener => listener(...args));
            }
        }
    };

    return Object.assign(baseNode, eventor);
}