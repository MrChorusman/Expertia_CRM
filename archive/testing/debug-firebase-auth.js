// Script para debugging de Firebase Authentication en tiempo real
// Cargar en la consola del navegador para monitorear el proceso de autenticación

window.firebaseDebugger = {
    isMonitoring: false,
    logs: [],
    
    // Iniciar monitoreo
    startMonitoring() {
        if (this.isMonitoring) {
            console.log('🔍 Ya está monitoreando Firebase');
            return;
        }
        
        this.isMonitoring = true;
        this.logs = [];
        
        console.log('🔍 INICIANDO MONITOREO DE FIREBASE AUTH');
        console.log('='.repeat(50));
        
        // Monitorear cambios de autenticación
        if (window.authManager && window.authManager.auth) {
            const { onAuthStateChanged } = window.firebase || {};
            if (onAuthStateChanged) {
                onAuthStateChanged(window.authManager.auth, (user) => {
                    const timestamp = new Date().toISOString();
                    if (user) {
                        const log = `${timestamp} ✅ AUTH STATE: Usuario autenticado - ${user.email}`;
                        console.log(log);
                        this.logs.push(log);
                        
                        console.log(`   📧 Email: ${user.email}`);
                        console.log(`   🆔 UID: ${user.uid}`);
                        console.log(`   ✅ Email verificado: ${user.emailVerified}`);
                        console.log(`   🔗 Provider: ${user.providerData[0]?.providerId || 'unknown'}`);
                        console.log(`   📱 Display Name: ${user.displayName || 'No establecido'}`);
                        console.log(`   🖼️ Photo URL: ${user.photoURL || 'No establecido'}`);
                    } else {
                        const log = `${timestamp} ❌ AUTH STATE: Usuario no autenticado`;
                        console.log(log);
                        this.logs.push(log);
                    }
                });
            }
        }
        
        // Interceptar console.error para capturar errores de Firebase
        const originalError = console.error;
        console.error = (...args) => {
            const timestamp = new Date().toISOString();
            const errorMsg = args.join(' ');
            
            if (errorMsg.includes('Firebase') || errorMsg.includes('auth') || errorMsg.includes('permissions')) {
                const log = `${timestamp} 🚨 ERROR: ${errorMsg}`;
                this.logs.push(log);
                console.log('🔍 Firebase Debug capturó error:', errorMsg);
            }
            
            originalError.apply(console, args);
        };
        
        console.log('✅ Monitoreo iniciado. Use firebaseDebugger.stopMonitoring() para detener');
    },
    
    // Detener monitoreo
    stopMonitoring() {
        this.isMonitoring = false;
        console.log('🛑 Monitoreo de Firebase detenido');
        console.log('📋 Logs capturados:', this.logs.length);
    },
    
    // Mostrar logs
    showLogs() {
        console.log('📋 LOGS DE FIREBASE DEBUG');
        console.log('='.repeat(50));
        this.logs.forEach((log, index) => {
            console.log(`${index + 1}. ${log}`);
        });
        console.log('='.repeat(50));
    },
    
    // Probar login con Google
    async testGoogleLogin() {
        console.log('🧪 INICIANDO PRUEBA DE LOGIN CON GOOGLE');
        console.log('='.repeat(50));
        
        if (!window.authManager) {
            console.error('❌ AuthManager no disponible');
            return;
        }
        
        try {
            const result = await window.authManager.loginWithGoogle();
            console.log('✅ Login exitoso:', result.email);
            
            // Esperar un momento y verificar perfil
            setTimeout(async () => {
                try {
                    const profile = await window.authManager.getUserProfile();
                    if (profile) {
                        console.log('✅ Perfil obtenido:', profile);
                    } else {
                        console.log('⚠️ Perfil no encontrado');
                    }
                } catch (error) {
                    console.error('❌ Error obteniendo perfil:', error);
                }
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error en login:', error);
            
            // Análisis detallado del error
            this.analyzeError(error);
        }
    },
    
    // Analizar error en detalle
    analyzeError(error) {
        console.log('🔬 ANÁLISIS DETALLADO DEL ERROR');
        console.log('='.repeat(50));
        
        console.log('📝 Tipo:', typeof error);
        console.log('🏷️ Nombre:', error.name || 'No especificado');
        console.log('💬 Mensaje:', error.message || 'No especificado');
        console.log('🔍 Código:', error.code || 'No especificado');
        
        if (error.stack) {
            console.log('📚 Stack trace:');
            console.log(error.stack);
        }
        
        // Sugerencias basadas en el tipo de error
        if (error.message.includes('permissions')) {
            console.log('💡 SUGERENCIAS PARA ERROR DE PERMISOS:');
            console.log('   1. Verificar reglas de Firestore');
            console.log('   2. Confirmar que el usuario tiene documento en /users/{uid}');
            console.log('   3. Revisar configuración de Firebase Auth');
            console.log('   4. Verificar que el dominio está autorizado');
        } else if (error.message.includes('popup')) {
            console.log('💡 SUGERENCIAS PARA ERROR DE POPUP:');
            console.log('   1. Verificar que no hay bloqueador de popups');
            console.log('   2. Asegurar que el dominio está en la lista blanca');
            console.log('   3. Revisar configuración CORS');
        }
        
        console.log('='.repeat(50));
    },
    
    // Verificar estado actual
    checkCurrentState() {
        console.log('📊 ESTADO ACTUAL DE FIREBASE');
        console.log('='.repeat(50));
        
        // AuthManager
        if (window.authManager) {
            console.log('✅ AuthManager disponible');
            console.log(`   🔧 Inicializado: ${window.authManager.isInitialized}`);
            console.log(`   👤 Usuario actual: ${window.authManager.currentUser?.email || 'Ninguno'}`);
        } else {
            console.log('❌ AuthManager no disponible');
        }
        
        // Firebase global
        if (window.firebase) {
            console.log('✅ Firebase SDK disponible');
            const methods = Object.keys(window.firebase);
            console.log(`   🛠️ Métodos disponibles: ${methods.join(', ')}`);
        } else {
            console.log('❌ Firebase SDK no disponible');
        }
        
        // Base de datos
        if (window.firebaseDb) {
            console.log('✅ Firestore DB disponible');
        } else {
            console.log('❌ Firestore DB no disponible');
        }
        
        console.log('='.repeat(50));
    }
};

// Auto-iniciar monitoreo
console.log('🧪 Firebase Debugger cargado');
console.log('📋 Comandos disponibles:');
console.log('   firebaseDebugger.startMonitoring() - Iniciar monitoreo');
console.log('   firebaseDebugger.testGoogleLogin() - Probar login');
console.log('   firebaseDebugger.checkCurrentState() - Ver estado actual');
console.log('   firebaseDebugger.showLogs() - Mostrar logs');
console.log('   firebaseDebugger.stopMonitoring() - Detener monitoreo');
console.log('');

// Verificar estado inicial
window.firebaseDebugger.checkCurrentState();

// Iniciar monitoreo automáticamente
window.firebaseDebugger.startMonitoring(); 