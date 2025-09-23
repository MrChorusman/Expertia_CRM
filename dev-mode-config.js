// Configuración de modo de desarrollo para Expertia CRM
// Permite desarrollo sin verificación de email cuando Firebase bloquea el envío

const DEV_MODE_CONFIG = {
    // Modo de desarrollo (cambiar a false en producción)
    enabled: true,
    
    // Configuraciones específicas
    skipEmailVerification: true,  // Saltar verificación de email en desarrollo
    allowUnverifiedAccess: true, // Permitir acceso sin verificación
    showDevWarnings: true,       // Mostrar advertencias de desarrollo
    
    // Límites de Firebase
    firebaseLimits: {
        maxEmailsPerHour: 100,
        maxUsersPerDay: 1000,
        cooldownPeriod: 3600000 // 1 hora en milisegundos
    }
};

// Función para verificar si estamos en modo desarrollo
function isDevelopmentMode() {
    return DEV_MODE_CONFIG.enabled && 
           (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1');
}

// Función para mostrar advertencia de desarrollo
function showDevWarning(message) {
    if (DEV_MODE_CONFIG.showDevWarnings && isDevelopmentMode()) {
        console.warn('🚧 MODO DESARROLLO:', message);
        
        // Mostrar en la UI si es posible
        if (typeof showAuthStatus === 'function') {
            showAuthStatus('🚧 ' + message, 'warning');
        }
    }
}

// Función para verificar si se debe saltar la verificación de email
function shouldSkipEmailVerification() {
    return DEV_MODE_CONFIG.skipEmailVerification && isDevelopmentMode();
}

// Función para verificar si se debe permitir acceso sin verificación
function shouldAllowUnverifiedAccess() {
    return DEV_MODE_CONFIG.allowUnverifiedAccess && isDevelopmentMode();
}

// Exportar configuración
window.DEV_MODE_CONFIG = DEV_MODE_CONFIG;
window.isDevelopmentMode = isDevelopmentMode;
window.showDevWarning = showDevWarning;
window.shouldSkipEmailVerification = shouldSkipEmailVerification;
window.shouldAllowUnverifiedAccess = shouldAllowUnverifiedAccess;

console.log('🚧 Modo de desarrollo configurado');
console.log('   - Saltar verificación de email:', DEV_MODE_CONFIG.skipEmailVerification);
console.log('   - Permitir acceso sin verificación:', DEV_MODE_CONFIG.allowUnverifiedAccess);
console.log('   - Mostrar advertencias:', DEV_MODE_CONFIG.showDevWarnings);
