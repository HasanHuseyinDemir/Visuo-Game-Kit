export function timerMixin({ initialDuration = 0, hooks = {} } = {}) {
    let timerId = null;
    let duration = initialDuration;
    return {
            duration,
            hooks: { ...hooks },
            start() {
                if (this.hooks.onStart) {
                    this.hooks.onStart();
                }
                timerId = setTimeout(() => {
                    if (this.hooks.onEnd) {
                        this.hooks.onEnd();
                    }
                }, this.duration);
            },
            stop() {
                if (timerId !== null) {
                    clearTimeout(timerId);
                    timerId = null;
                    if (this.hooks.onStop) {
                        this.hooks.onStop();
                    }
                }
            },
            reset(newDuration) {
                this.stop();
                this.duration = newDuration !== undefined ? newDuration : this.duration;
                if (this.hooks.onReset) {
                    this.hooks.onReset(this.duration);
                }
            },
            getTimeLeft() {
                return Math.max(0, this.duration - (Date.now() - this.startTime));
            }
        }
    };
