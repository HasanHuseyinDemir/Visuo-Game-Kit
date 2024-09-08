const NODE_MIXIN = Symbol("NodeMixin");

function isNodeMixin(obj) {
    return obj && typeof obj === 'object' && NODE_MIXIN in obj;
}

export function nodeMixin(initialData = null) {
    const data = {
        nodes: [],
        parent: null,
        data: initialData
    };
    const obj = {
        [NODE_MIXIN]: true,
        type:"NODE",
        addNode(node) {
            if (isNodeMixin(node)) {
                data.nodes.push(node);
                node.parent = this;
                return node;
            } else {
                const newNode = nodeMixin(node);
                newNode.parent = this;
                data.nodes.push(newNode);
                return newNode;
            }
        },
        addNodes(...nodes) {
            nodes.flat().forEach(node => {
                this.addNode(node);
            });
        },
        removeNode(node) {
            data.nodes = data.nodes.filter(n => n !== node);
            if (isNodeMixin(node)) {
                node.parent = null;
            }
        },
        get nodes() {
            return data.nodes;
        },
        get parent() {
            return data.parent || null;
        },
        set parent(p) {
            data.parent = p;
        },
        get data() {
            return data.data;
        },
        set data(newData) {
            data.data = newData;
        },
        fromNode(tr) {
            const newData = tr(this.data, data.nodes.length);
            return this.addNode(newData)
        }
    };
    return obj;
}