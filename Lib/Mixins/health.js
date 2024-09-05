function healthMixin({ maxHealth = 100, currentHealth = 100, hooks = {} } = {}) {
    return {
            maxHealth,
            currentHealth,
            hooks: { ...hooks },
            takeDamage(amount) {
                if (amount > 0 && this.hooks.onDamage) {
                    this.hooks.onDamage({ takedDamage: amount, currentHealth: this.currentHealth });
                }
                this.currentHealth = Math.max(0, this.currentHealth - amount);
                if (this.isDead() && this.hooks.onDead) {
                    this.hooks.onDead({ takedDamage: amount, currentHealth: 0 });
                }
            },
            heal(amount) {
                if (amount > 0 && this.hooks.onHeal) {
                    this.hooks.onHeal({ heal: amount, currentHealth: this.currentHealth });
                }
                this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
            },
            setHealth(amount) {
                let current = this.currentHealth;
                if (amount <= 0) {
                    let call = { takedDamage: current, currentHealth: 0 };
                    if (current !== 0) {
                        if (this.hooks.onDamage) this.hooks.onDamage(call); 
                        if (this.hooks.onDead) this.hooks.onDead(call);
                    }
                    this.currentHealth = 0;
                } else if (current > amount) {
                    let damage = current - amount;
                    if (this.hooks.onDamage) {
                        this.hooks.onDamage({ takedDamage: damage, currentHealth: amount });
                    }
                    this.currentHealth = amount;
                } else if (current < amount) {
                    let healed = amount - current;
                    if (this.hooks.onHeal) {
                        this.hooks.onHeal({ heal: healed, currentHealth: amount });
                    }
                    this.currentHealth = amount;
                }
                this.currentHealth = Math.min(this.maxHealth, this.currentHealth);
            },
            setMaxHealth(newMaxHealth) {
                this.maxHealth = newMaxHealth;
                if (this.currentHealth > newMaxHealth) {
                    this.setHealth(newMaxHealth);
                }
            },
            isDead() {
                return this.currentHealth <= 0;
            },
            kill(){
                this.setHealth(0)
            }
        }
    };