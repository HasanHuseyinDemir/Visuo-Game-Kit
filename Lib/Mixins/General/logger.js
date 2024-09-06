function createLoggerMixin({ maxLogs = Infinity, hooks = {} } = {}) {
    const logs = [];
    
    function triggerHook(type, data) {
        if (hooks[type]) {
            hooks[type](data);
        }
    }
    
    return {
        maxLogs,
        logs,

        addLog(type, message) {
            const timestamp = new Date();
            const logEntry = { type, message, timestamp };
            
            if (this.logs.length >= this.maxLogs) {
                this.logs.shift();
            }
            
            this.logs.push(logEntry);
            triggerHook('onLogAdded', logEntry);
        },

        getLogs() {
            return this.logs;
        },

        getLogsByType(type) {
            return this.logs.filter(log => log.type === type);
        },

        getLastLog() {
            return this.logs[this.logs.length - 1] || null;
        },

        clearLogs() {
            this.logs.length = 0;
            triggerHook('onLogsCleared', {});
        }
    };
}

// Example usage

/*
const logger = createLoggerMixin({
    maxLogs: 5,
    hooks: {
        onLogAdded: (log) => console.log('Log added:', log),
        onLogsCleared: () => console.log('Logs cleared')
    }
});

logger.addLog('info', 'Application started');
logger.addLog('warning', 'Low disk space');
logger.addLog('error', 'Failed to load resource');

console.log('All Logs:', logger.getLogs());
console.log('Error Logs:', logger.getLogsByType('error'));
console.log('Last Log:', logger.getLastLog());

logger.clearLogs();
*/
