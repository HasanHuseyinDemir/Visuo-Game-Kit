import { nodeMixin } from "../../General/nodeMixin.js";

export function storeNodeMixin(initialData = {}) {
    const baseNode = nodeMixin(initialData);

    const obj = Object.assign(baseNode, {
        type: "STORE-NODE",
        dataStore: initialData,
        set(key, value) {
            this.dataStore[key] = value;
        },
        get(key) {
            return this.dataStore[key];
        },
        remove(key) {
            delete this.dataStore[key];
        },
        getAll() {
            return this.dataStore;
        }
    });
    return obj;
}
