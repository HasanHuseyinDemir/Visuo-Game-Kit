export function createVector(v = {}) {
    let x = v.x ?? 0;
    let y = v.y ?? 0;

    return {
        x: x,
        y: y,
        add(a) {
            this.x += a.x ?? 0;
            this.y += a.y ?? 0;
        },
        sub(a) {
            this.x -= a.x ?? 0;
            this.y -= a.y ?? 0;
        },
        mult(a) {
            this.x *= a.x ?? 1;
            this.y *= a.y ?? 1;
        },
        scale(scalar) {
            this.x *= scalar;
            this.y *= scalar;
        },
        divide(scalar) {
            if (scalar !== 0) {
                this.x /= scalar;
                this.y /= scalar;
            }
        },
        distance(a) {
            const dx = this.x - (a.x ?? 0);
            const dy = this.y - (a.y ?? 0);
            return Math.sqrt(dx * dx + dy * dy);
        },
        angle(a) {
            const dotProduct = this.x * a.x + this.y * a.y;
            const magnitudeA = this.magnitude();
            const magnitudeB = a.magnitude();
            return Math.acos(dotProduct / (magnitudeA * magnitudeB));
        },
        magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        normalize() {
            const mag = this.magnitude();
            if (mag !== 0) {
                this.x /= mag;
                this.y /= mag;
            }
        },
        lerp(v, t) {
            const xC = this.x + t * (v.x - this.x);
            const yC = this.y + t * (v.y - this.y);
            return createVector({ x: xC, y: yC });
        },
        clone() {
            return createVector({ x: this.x, y: this.y });
        },
        reset() {
            this.x = v.x ?? 0;
            this.y = v.y ?? 0;
        },
        toString() {
            return `(${this.x}, ${this.y})`;
        },
    };
}
