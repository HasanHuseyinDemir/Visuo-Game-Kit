export function vectorMixin(v = {}, onChange) {
    let _x = v.x ?? 0;
    let _y = v.y ?? 0;
    function triggerOnChange() {
        if (typeof hooks.onChange=="function") {
            hooks.onChange({ x: this.x, y: this.y });
        }
    }
    return {
        hooks: { ...hooks },
        onChange,
        get x() {
            return _x;
        },
        set x(value) {
            if (_x !== value) {
                _x = value;
                triggerOnChange.call(this);
            }
        },
        get y() {
            return _y;
        },
        set y(value) {
            if (_y !== value) {
                _y = value;
                triggerOnChange.call(this);
            }
        },
        add({x = 0, y = 0}) {
            this.x += x;
            this.y += y;
            return this;
        },
        sub({x = 0, y = 0}) {
            this.x -= x;
            this.y -= y;
            return this;
        },
        mult({x = 1, y = 1}) {
            this.x *= x;
            this.y *= y;
            return this;
        },
        scale(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        },
        divide(scalar) {
            if (scalar !== 0) {
                this.x /= scalar;
                this.y /= scalar;
            }
            return this;
        },
        reset() {
            this.x = v.x ?? 0;
            this.y = v.y ?? 0;
            return this;
        },
        lerp({x, y}, t) {
            const xC = this.x + t * (x - this.x);
            const yC = this.y + t * (y - this.y);
            const lerpVector = vectorMixin({ x: xC, y: yC }, this.hooks);
            return lerpVector;
        },
        clone() {
            return vectorMixin({ x: this.x, y: this.y }, this.hooks);
        },
        toString() {
            return `(${this.x}, ${this.y})`;
        },
    };
}
