import { vectorMixin } from "../Vectors/pointWHooks.js";

export function mergeVectorOps() {
    let vec = vectorMixin();
    const additionalFunctions = {
        rotate(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const newX = this.x * cos - this.y * sin;
            const newY = this.x * sin + this.y * cos;
            this.x = newX;
            this.y = newY;
            return this;
        },
        dot(v) {
            return this.x * v.x + this.y * v.y;
        },
        cross(v) {
            return this.x * v.y - this.y * v.x;
        },
        normalize() {
            const mag = this.magnitude();
            if (mag !== 0) {
                this.x /= mag;
                this.y /= mag;
            }
            return this;
        },
        angleBetween(v) {
            const dotProduct = this.dot(v);
            const magnitudeA = this.magnitude();
            const magnitudeB = v.magnitude();
            return Math.acos(dotProduct / (magnitudeA * magnitudeB));
        },
        limit(max) {
            if (this.magnitude() > max) {
                this.normalize();
                this.scale(max);
            }
            return this;
        },
        toPolar() {
            const r = this.magnitude();
            const theta = Math.atan2(this.y, this.x);
            return { r, theta };
        },
        equals(v) {
            return this.x === v.x && this.y === v.y;
        },
        round(decimals = 2) {
            const factor = Math.pow(10, decimals);
            this.x = Math.round(this.x * factor) / factor;
            this.y = Math.round(this.y * factor) / factor;
            return this;
        },
        inverse() {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        },
        toJSON() {
            return { x: this.x, y: this.y };
        }
    };
    Object.assign(vec, additionalFunctions);
    return vec;
}
