export function arrayMixin({ items = [], hooks = {}, unique = false } = {}) {
    items=unique?[...new Set(items)]:[...items];
    return {
            items,
            unique,
            hooks:{...hooks},
            add(item) {
                if (this.unique) {
                    if (!this.items.includes(item)) {
                        this.items.push(item);
                        this._triggerHooks('onAdd',{item,array: [...this.items]});
                    }
                } else {
                    this.items.push(item);
                    this._triggerHooks('onAdd',{item,array:[...this.items]});
                }
            },
            remove(item) {
                const index=this.items.indexOf(item);
                if (index!==-1) {
                    this.items.splice(index, 1);
                    this._triggerHooks('onRemove',{item,array:[...this.items]});
                }
            },
            getCount() {
                return this.items.length;
            },
            _triggerHooks(type, call) {
                if (this.hooks[type]) {
                    this.hooks[type](call);
                }
            }
        }
    };
