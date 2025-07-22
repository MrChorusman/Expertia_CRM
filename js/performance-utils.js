// 🚀 MÓDULO EXTRAÍDO: Utilidades de Rendimiento y Caché
// Este archivo contiene las optimizaciones de rendimiento de Expertia CRM

// Cache manager para reducir consultas a Firebase
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.timestamps = new Map();
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }
    
    set(key, data) {
        this.cache.set(key, data);
        this.timestamps.set(key, Date.now());
        console.log(`💾 Cache actualizado: ${key}`);
    }
    
    get(key) {
        if (!this.cache.has(key)) return null;
        
        const timestamp = this.timestamps.get(key);
        if (Date.now() - timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            console.log(`🗑️ Cache expirado: ${key}`);
            return null;
        }
        
        console.log(`⚡ Datos desde cache: ${key}`);
        return this.cache.get(key);
    }
    
    clear(key = null) {
        if (key) {
            this.cache.delete(key);
            this.timestamps.delete(key);
        } else {
            this.cache.clear();
            this.timestamps.clear();
        }
    }
}

// Debounce utility para evitar consultas excesivas
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Sistema de reconexión para Firebase
class ConnectionManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.connectionStatus = 'connected';
        this.retryCount = 0;
        this.maxRetries = 3;
        
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }
    
    handleOnline() {
        this.isOnline = true;
        this.connectionStatus = 'connected';
        this.retryCount = 0;
        console.log('🟢 Conexión restaurada');
        this.notifyConnectionChange('connected');
    }
    
    handleOffline() {
        this.isOnline = false;
        this.connectionStatus = 'disconnected';
        console.log('🔴 Sin conexión a internet');
        this.notifyConnectionChange('disconnected');
    }
    
    async retryConnection() {
        if (this.retryCount >= this.maxRetries) {
            this.connectionStatus = 'failed';
            return false;
        }
        
        this.retryCount++;
        this.connectionStatus = 'retrying';
        console.log(`🔄 Reintentando conexión (${this.retryCount}/${this.maxRetries})`);
        
        // Simular delay antes del reintento
        await new Promise(resolve => setTimeout(resolve, 2000 * this.retryCount));
        
        return this.isOnline;
    }
    
    notifyConnectionChange(status) {
        const event = new CustomEvent('connectionChange', { detail: { status } });
        window.dispatchEvent(event);
    }
}

// Instancias globales
window.cacheManager = new CacheManager();
window.connectionManager = new ConnectionManager();

// Utilidad para consultas optimizadas
window.optimizedQuery = {
    // Wrapper para consultas con cache
    withCache: function(key, queryFunction, forceRefresh = false) {
        return new Promise(async (resolve, reject) => {
            try {
                // Verificar cache primero
                if (!forceRefresh) {
                    const cached = window.cacheManager.get(key);
                    if (cached) {
                        resolve(cached);
                        return;
                    }
                }
                
                // Realizar consulta
                const data = await queryFunction();
                window.cacheManager.set(key, data);
                resolve(data);
            } catch (error) {
                console.error(`❌ Error en consulta ${key}:`, error);
                
                // Intentar usar cache como fallback
                const cached = window.cacheManager.get(key);
                if (cached) {
                    console.log(`🆘 Usando cache como fallback para ${key}`);
                    resolve(cached);
                } else {
                    reject(error);
                }
            }
        });
    }
};

console.log('✅ Módulo de rendimiento cargado correctamente');
