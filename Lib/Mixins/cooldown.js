export function cooldownMixin({ cooldownTime = 0, lastUsed = 0, hooks = {} } = {}) {
    return {
            cooldownTime,
            lastUsed,
            hooks:{...hooks},
            isOnCooldown(currentTime) {
                return currentTime < this.lastUsed + this.cooldownTime;
            },
            startCooldown(currentTime) {
                this.lastUsed=currentTime;
                if (this.hooks.onCooldownStart) {
                    this.hooks.onCooldownStart({cooldownTime:this.cooldownTime});
                }
            },
            resetCooldown() {
                this.lastUsed=0;
                if (this.hooks.onCooldownReset) {
                    this.hooks.onCooldownReset();
                }
            },
            setCooldownTime(newCooldownTime) {
                this.cooldownTime=newCooldownTime;
            }
        }
    };