import { nodeMixin } from "../../General/nodeMixin.js";

export function behaviorNodeMixin(behaviorFunction,data) {
    const baseNode = nodeMixin(data);

    const obj = Object.assign(baseNode, {
        type:"BEHAVIOR-NODE",
        behaviorFunction,
        setBehavior(b){
            if(typeof b=="function"){
                this.behaviorFunction=b
            }
        },
        applyBehavior() {
            this.nodes.forEach(node => {
                if (typeof this.behaviorFunction === 'function') {
                    this.behaviorFunction(node,baseNode.data);
                }
            });
        }
    });
    return obj;
}