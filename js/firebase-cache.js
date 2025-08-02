/**
 * Sistema de caché local para Firebase - Expertia CRM
 * Optimiza consultas y reduce llamadas innecesarias a Firebase
 */

const FirebaseCache = {
    // Almacén de caché
    cache: new Map(),
    
    // Configuración de caché
    config: {
        DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
        MAX_SIZE: 100, // Máximo 100 elementos en caché
        CLEANUP_INTERVAL: 10 * 60 * 1000 // Limpiar cada 10 minutos
    },
    
    // Inicializar sistema de caché
    init: () => {
        // Limpiar caché periódicamente
        setInterval(() => {
            FirebaseCache.cleanup();
        }, FirebaseCache.config.CLEANUP_INTERVAL);
        
        SecureLogger.success('Sistema de caché de Firebase inicializado');
    },
    
    // Generar clave de caché
    generateKey: (collection, documentId = null, query = null) => {
        let key = collection;
        if (documentId) key += `:${documentId}`;
        if (query) key += `:${JSON.stringify(query)}`;
        return key;
    },
    
    // Obtener elemento del caché
    get: (key) => {
        const item = FirebaseCache.cache.get(key);
        if (!item) return null;
        
        // Verificar si ha expirado
        if (Date.now() > item.expiresAt) {
            FirebaseCache.cache.delete(key);
            return null;
        }
        
        SecureLogger.log(`Cache hit: ${key}`);
        return item.data;
    },
    
    // Guardar elemento en caché
    set: (key, data, ttl = FirebaseCache.config.DEFAULT_TTL) => {
        // Limpiar caché si está lleno
        if (FirebaseCache.cache.size >= FirebaseCache.config.MAX_SIZE) {
            FirebaseCache.cleanup();
        }
        
        const item = {
            data,
            expiresAt: Date.now() + ttl,
            createdAt: Date.now()
        };
        
        FirebaseCache.cache.set(key, item);
        SecureLogger.log(`Cache set: ${key} (TTL: ${ttl}ms)`);
    },
    
    // Limpiar caché expirado
    cleanup: () => {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, item] of FirebaseCache.cache.entries()) {
            if (now > item.expiresAt) {
                FirebaseCache.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            SecureLogger.log(`Cache cleanup: ${cleaned} items removed`);
        }
    },
    
    // Invalidar caché
    invalidate: (pattern = null) => {
        if (!pattern) {
            // Limpiar todo el caché
            const size = FirebaseCache.cache.size;
            FirebaseCache.cache.clear();
            SecureLogger.log(`Cache invalidated: ${size} items removed`);
            return;
        }
        
        // Limpiar elementos que coincidan con el patrón
        let cleaned = 0;
        for (const [key] of FirebaseCache.cache.entries()) {
            if (key.includes(pattern)) {
                FirebaseCache.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            SecureLogger.log(`Cache invalidated: ${cleaned} items matching '${pattern}' removed`);
        }
    },
    
    // Obtener estadísticas del caché
    getStats: () => {
        const now = Date.now();
        let expired = 0;
        let valid = 0;
        
        for (const [, item] of FirebaseCache.cache.entries()) {
            if (now > item.expiresAt) {
                expired++;
            } else {
                valid++;
            }
        }
        
        return {
            total: FirebaseCache.cache.size,
            valid,
            expired,
            maxSize: FirebaseCache.config.MAX_SIZE
        };
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.FirebaseCache = FirebaseCache;
}

console.log('⚡ Sistema de caché de Firebase cargado'); 