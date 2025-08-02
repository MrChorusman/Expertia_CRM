/**
 * Sistema de logging seguro para Expertia CRM
 * Enmascara datos sensibles y solo muestra logs en desarrollo
 */

const SecureLogger = {
    // Configuración del entorno
    isDevelopment: () => {
        return typeof window !== 'undefined' && 
               (window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' ||
                window.location.port === '8000');
    },

    // Enmascarar datos sensibles
    maskSensitiveData: (data) => {
        if (!data) return '[NO_DATA]';
        
        const sensitiveFields = [
            'password', 'token', 'key', 'secret', 'auth', 
            'email', 'phone', 'address', 'id', 'uid'
        ];
        
        if (typeof data === 'object') {
            const masked = {};
            for (const [key, value] of Object.entries(data)) {
                const isSensitive = sensitiveFields.some(field => 
                    key.toLowerCase().includes(field)
                );
                masked[key] = isSensitive ? '[MASKED]' : value;
            }
            return masked;
        }
        
        return '[MASKED]';
    },

    // Log seguro
    log: (message, data = null) => {
        if (!SecureLogger.isDevelopment()) return;
        
        const maskedData = data ? SecureLogger.maskSensitiveData(data) : null;
        console.log(`🔒 [SECURE] ${message}`, maskedData);
    },

    // Log de error seguro
    error: (message, error = null) => {
        if (!SecureLogger.isDevelopment()) return;
        
        const errorInfo = error ? {
            message: error.message,
            stack: error.stack?.split('\n')[0] // Solo primera línea del stack
        } : null;
        
        console.error(`🔒 [ERROR] ${message}`, errorInfo);
    },

    // Log de éxito seguro
    success: (message, data = null) => {
        if (!SecureLogger.isDevelopment()) return;
        
        const maskedData = data ? SecureLogger.maskSensitiveData(data) : null;
        console.log(`✅ [SUCCESS] ${message}`, maskedData);
    },

    // Log de warning seguro
    warn: (message, data = null) => {
        if (!SecureLogger.isDevelopment()) return;
        
        const maskedData = data ? SecureLogger.maskSensitiveData(data) : null;
        console.warn(`⚠️ [WARNING] ${message}`, maskedData);
    },

    // Log de información de Firebase (sin datos sensibles)
    firebase: (message, operation = null) => {
        if (!SecureLogger.isDevelopment()) return;
        
        const operationInfo = operation ? `[${operation}]` : '';
        console.log(`🔥 [FIREBASE] ${message} ${operationInfo}`);
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.SecureLogger = SecureLogger;
}

console.log('🔒 Sistema de logging seguro cargado'); 