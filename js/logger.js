// js/logger.js
export const Logger = {
    log: (action, details = {}) => {
        console.log(`[SYSTEM LOG] ${action}`, details);
        // Save to storage for project evaluation proof
        const logs = JSON.parse(localStorage.getItem('system_logs')) || [];
        logs.push({ time: new Date().toISOString(), action, details });
        localStorage.setItem('system_logs', JSON.stringify(logs));
    }
};