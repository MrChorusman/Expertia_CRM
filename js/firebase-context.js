/**
 * Contexto de Firebase centralizado para Expertia CRM
 * Maneja inicialización y evita race conditions
 */

const FirebaseContext = {
    // Estado de inicialización
    initializationState: {
        isInitializing: false,
        isInitialized: false,
        error: null,
        retryCount: 0,
        maxRetries: 10
    },

    // Promesas de inicialización
    initializationPromise: null,

    // Configuración de Firebase
    config: {
        maxRetryAttempts: 50,
        retryDelay: 100,
        timeout: 10000
    },

    // Inicializar Firebase de forma segura
    initialize: async () => {
        // Si ya está inicializando, esperar
        if (FirebaseContext.initializationState.isInitializing) {
            return FirebaseContext.initializationPromise;
        }

        // Si ya está inicializado, retornar inmediatamente
        if (FirebaseContext.initializationState.isInitialized) {
            return { success: true, firestore: window.firebase.getFirestore(window.authManager.app) };
        }

        // Marcar como inicializando
        FirebaseContext.initializationState.isInitializing = true;
        FirebaseContext.initializationState.error = null;

        // Crear promesa de inicialización
        FirebaseContext.initializationPromise = new Promise(async (resolve, reject) => {
            try {
                // Esperar a que Firebase esté disponible
                const firebaseReady = await FirebaseContext.waitForFirebase();
                
                if (!firebaseReady) {
                    throw new Error('Firebase no disponible después de esperar');
                }

                // Verificar que todos los componentes necesarios estén disponibles
                const requiredComponents = [
                    'window.authManager',
                    'window.authManager.app',
                    'window.firebase',
                    'window.firebase.getFirestore',
                    'window.firebase.collection',
                    'window.firebase.doc',
                    'window.firebase.getDoc',
                    'window.firebase.updateDoc',
                    'window.firebase.addDoc'
                ];

                for (const component of requiredComponents) {
                    if (!FirebaseContext.checkComponent(component)) {
                        throw new Error(`Componente requerido no disponible: ${component}`);
                    }
                }

                // Obtener instancia de Firestore
                const firestore = window.firebase.getFirestore(window.authManager.app);
                
                if (!firestore) {
                    throw new Error('No se pudo obtener instancia de Firestore');
                }

                // Marcar como inicializado
                FirebaseContext.initializationState.isInitialized = true;
                FirebaseContext.initializationState.isInitializing = false;

                SecureLogger.success('Firebase inicializado correctamente');
                
                resolve({ success: true, firestore });

            } catch (error) {
                FirebaseContext.initializationState.error = error;
                FirebaseContext.initializationState.isInitializing = false;
                FirebaseContext.initializationState.retryCount++;

                SecureLogger.error('Error inicializando Firebase', error);

                // Reintentar si no se ha excedido el límite
                if (FirebaseContext.initializationState.retryCount < FirebaseContext.initializationState.maxRetries) {
                    setTimeout(() => {
                        FirebaseContext.initialize().then(resolve).catch(reject);
                    }, FirebaseContext.config.retryDelay);
                } else {
                    reject(error);
                }
            }
        });

        return FirebaseContext.initializationPromise;
    },

    // Esperar a que Firebase esté disponible
    waitForFirebase: async () => {
        let attempts = 0;
        
        while (attempts < FirebaseContext.config.maxRetryAttempts) {
            if (window.authManager && 
                window.authManager.app && 
                window.firebase && 
                window.firebase.getFirestore) {
                return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, FirebaseContext.config.retryDelay));
            attempts++;
        }
        
        return false;
    },

    // Verificar componente específico
    checkComponent: (componentPath) => {
        const parts = componentPath.split('.');
        let current = window;
        
        for (const part of parts) {
            if (current[part] === undefined) {
                return false;
            }
            current = current[part];
        }
        
        return true;
    },

    // Obtener instancia de Firestore de forma segura
    getFirestore: async () => {
        if (FirebaseContext.initializationState.isInitialized) {
            return window.firebase.getFirestore(window.authManager.app);
        }
        
        const result = await FirebaseContext.initialize();
        return result.firestore;
    },

    // Verificar si Firebase está listo
    isReady: () => {
        return FirebaseContext.initializationState.isInitialized && 
               !FirebaseContext.initializationState.isInitializing;
    },

    // Obtener estado de inicialización
    getState: () => {
        return { ...FirebaseContext.initializationState };
    },

    // Resetear estado (para testing)
    reset: () => {
        FirebaseContext.initializationState = {
            isInitializing: false,
            isInitialized: false,
            error: null,
            retryCount: 0,
            maxRetries: 10
        };
        FirebaseContext.initializationPromise = null;
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.FirebaseContext = FirebaseContext;
}

console.log('🔥 Contexto de Firebase centralizado cargado'); 