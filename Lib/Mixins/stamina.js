function staminaMixin({ maxStamina = 100, currentStamina = 100, hooks = {} } = {}) {
    return {
            maxStamina,
            currentStamina,
            hooks: { ...hooks },

            use(amount) {
                if (amount > 0) {
                    this.currentStamina = Math.max(0, this.currentStamina - amount);
                    if (this.hooks.onUse) {
                        this.hooks.onUse({ usedAmount: amount, currentStamina: this.currentStamina });
                    }
                    if (this.currentStamina === 0 && this.hooks.onExhausted) {
                        this.hooks.onExhausted();
                    }
                }
            },

            recover(amount) {
                if (amount > 0) {
                    this.currentStamina = Math.min(this.maxStamina, this.currentStamina + amount);
                    if (this.hooks.onRecover) {
                        this.hooks.onRecover({ recoveredAmount: amount, currentStamina: this.currentStamina });
                    }
                }
            },

            setStamina(amount) {
                if (amount <= 0) {
                    this.currentStamina = 0;
                    if (this.hooks.onExhausted) {
                        this.hooks.onExhausted();
                    }
                } else if (amount > this.maxStamina) {
                    this.currentStamina = this.maxStamina;
                } else {
                    this.currentStamina = amount;
                }
            },

            setMaxStamina(newMaxStamina) {
                this.maxStamina = newMaxStamina;
                this.currentStamina = Math.min(this.currentStamina, newMaxStamina);
            }
        }
    };
