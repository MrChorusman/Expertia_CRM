/**
 * Gestor de memoria - Expertia CRM
 * Previene memory leaks y optimiza el uso de recursos
 */

const MemoryManager = {
    // Configuración de gestión de memoria
    config: {
        MAX_CACHE_SIZE: 50,
        CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutos
        MEMORY_THRESHOLD: 0.8, // 80% de uso de memoria
        LEAK_DETECTION_INTERVAL: 30 * 1000 // 30 segundos
    },
    
    // Registro de recursos
    resources: new Map(),
    
    // Event listeners registrados
    eventListeners: new Map(),
    
    // Timers registrados
    timers: new Map(),
    
    // Inicializar gestor de memoria
    init: () => {
        // Limpiar recursos periódicamente
        setInterval(() => {
            MemoryManager.cleanup();
        }, MemoryManager.config.CLEANUP_INTERVAL);
        
        // Detectar memory leaks
        setInterval(() => {
            MemoryManager.detectMemoryLeaks();
        }, MemoryManager.config.LEAK_DETECTION_INTERVAL);
        
        // Limpiar al salir de la página
        window.addEventListener('beforeunload', () => {
            MemoryManager.cleanupAll();
        });
        
        SecureLogger.success('Gestor de memoria inicializado');
    },
    
    // Registrar recurso
    registerResource: (id, resource, type = 'unknown') => {
        MemoryManager.resources.set(id, {
            resource,
            type,
            createdAt: Date.now(),
            lastAccessed: Date.now()
        });
        
        SecureLogger.log(`Recurso registrado: ${id} (${type})`);
    },
    
    // Liberar recurso
    releaseResource: (id) => {
        const resource = MemoryManager.resources.get(id);
        if (resource) {
            // Limpiar recurso específico según su tipo
            switch (resource.type) {
                case 'eventListener':
                    if (resource.resource.element && resource.resource.handler) {
                        resource.resource.element.removeEventListener(
                            resource.resource.event,
                            resource.resource.handler
                        );
                    }
                    break;
                case 'timer':
                    if (resource.resource.timerId) {
                        clearTimeout(resource.resource.timerId);
                        clearInterval(resource.resource.timerId);
                    }
                    break;
                case 'cache':
                    if (resource.resource.clear) {
                        resource.resource.clear();
                    }
                    break;
                default:
                    // Limpiar genérico
                    if (resource.resource && typeof resource.resource.dispose === 'function') {
                        resource.resource.dispose();
                    }
            }
            
            MemoryManager.resources.delete(id);
            SecureLogger.log(`Recurso liberado: ${id}`);
        }
    },
    
    // Registrar event listener
    registerEventListener: (element, event, handler, options = {}) => {
        const id = `event_${Date.now()}_${Math.random()}`;
        
        element.addEventListener(event, handler, options);
        
        MemoryManager.registerResource(id, {
            element,
            event,
            handler,
            options
        }, 'eventListener');
        
        return id;
    },
    
    // Registrar timer
    registerTimer: (callback, delay, isInterval = false) => {
        const id = `timer_${Date.now()}_${Math.random()}`;
        
        const timerId = isInterval ? 
            setInterval(callback, delay) : 
            setTimeout(callback, delay);
        
        MemoryManager.registerResource(id, {
            timerId,
            callback,
            delay,
            isInterval
        }, 'timer');
        
        return id;
    },
    
    // Registrar caché
    registerCache: (cache, maxSize = MemoryManager.config.MAX_CACHE_SIZE) => {
        const id = `cache_${Date.now()}_${Math.random()}`;
        
        MemoryManager.registerResource(id, {
            cache,
            maxSize,
            clear: () => cache.clear()
        }, 'cache');
        
        return id;
    },
    
    // Limpiar recursos antiguos
    cleanup: () => {
        const now = Date.now();
        const maxAge = 10 * 60 * 1000; // 10 minutos
        let cleaned = 0;
        
        for (const [id, resource] of MemoryManager.resources.entries()) {
            // Limpiar recursos muy antiguos
            if (now - resource.createdAt > maxAge) {
                MemoryManager.releaseResource(id);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            SecureLogger.log(`Cleanup: ${cleaned} recursos antiguos liberados`);
        }
        
        // Limpiar cachés grandes
        MemoryManager.cleanupLargeCaches();
    },
    
    // Limpiar cachés grandes
    cleanupLargeCaches: () => {
        for (const [id, resource] of MemoryManager.resources.entries()) {
            if (resource.type === 'cache' && resource.resource.cache) {
                const cache = resource.resource.cache;
                const maxSize = resource.resource.maxSize;
                
                if (cache.size > maxSize) {
                    // Eliminar elementos más antiguos
                    const entries = Array.from(cache.entries());
                    const toRemove = entries.length - maxSize;
                    
                    for (let i = 0; i < toRemove; i++) {
                        cache.delete(entries[i][0]);
                    }
                    
                    SecureLogger.log(`Cache cleanup: ${toRemove} elementos removidos de ${id}`);
                }
            }
        }
    },
    
    // Detectar memory leaks
    detectMemoryLeaks: () => {
        const stats = MemoryManager.getMemoryStats();
        
        // Verificar si hay demasiados recursos
        if (stats.totalResources > 100) {
            SecureLogger.warn('Posible memory leak detectado: demasiados recursos registrados', stats);
        }
        
        // Verificar si hay timers sin limpiar
        if (stats.timers > 20) {
            SecureLogger.warn('Posible memory leak detectado: demasiados timers activos', stats);
        }
        
        // Verificar si hay event listeners sin limpiar
        if (stats.eventListeners > 50) {
            SecureLogger.warn('Posible memory leak detectado: demasiados event listeners', stats);
        }
    },
    
    // Limpiar todos los recursos
    cleanupAll: () => {
        const resourceIds = Array.from(MemoryManager.resources.keys());
        
        for (const id of resourceIds) {
            MemoryManager.releaseResource(id);
        }
        
        // Limpiar timers de debounce y throttle
        if (QueryOptimizer && QueryOptimizer.cleanupDebounceTimers) {
            QueryOptimizer.cleanupDebounceTimers();
        }
        
        if (ReactOptimizer && ReactOptimizer.cleanup) {
            ReactOptimizer.cleanup();
        }
        
        // Limpiar caché de Firebase
        if (FirebaseCache && FirebaseCache.invalidate) {
            FirebaseCache.invalidate();
        }
        
        SecureLogger.success('Todos los recursos liberados');
    },
    
    // Obtener estadísticas de memoria
    getMemoryStats: () => {
        const stats = {
            totalResources: MemoryManager.resources.size,
            eventListeners: 0,
            timers: 0,
            caches: 0,
            others: 0
        };
        
        for (const [, resource] of MemoryManager.resources.entries()) {
            switch (resource.type) {
                case 'eventListener':
                    stats.eventListeners++;
                    break;
                case 'timer':
                    stats.timers++;
                    break;
                case 'cache':
                    stats.caches++;
                    break;
                default:
                    stats.others++;
            }
        }
        
        return stats;
    },
    
    // Optimizar imágenes
    optimizeImages: () => {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading nativo
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Optimizar srcset si está disponible
            if (img.srcset) {
                const sizes = img.sizes || '100vw';
                img.sizes = sizes;
            }
            
            // Agregar error handling
            img.onerror = () => {
                img.style.display = 'none';
                SecureLogger.warn(`Error cargando imagen: ${img.src}`);
            };
        });
        
        SecureLogger.log(`Optimizadas ${images.length} imágenes`);
    },
    
    // Optimizar fuentes
    optimizeFonts: () => {
        // Precargar fuentes críticas
        const criticalFonts = [
            'Inter',
            'Inter:wght@400',
            'Inter:wght@500',
            'Inter:wght@600',
            'Inter:wght@700'
        ];
        
        criticalFonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.href = `https://fonts.googleapis.com/css2?family=${font}&display=swap`;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        SecureLogger.log('Fuentes críticas precargadas');
    },
    
    // Optimizar CSS
    optimizeCSS: () => {
        // Remover CSS no utilizado
        const unusedCSS = document.querySelectorAll('style[data-unused="true"]');
        unusedCSS.forEach(style => style.remove());
        
        // Inline CSS crítico
        const criticalCSS = document.querySelectorAll('style[data-critical="true"]');
        criticalCSS.forEach(style => {
            if (!style.hasAttribute('data-inlined')) {
                style.setAttribute('data-inlined', 'true');
            }
        });
        
        SecureLogger.log('CSS optimizado');
    },
    
    // Monitorear uso de memoria
    monitorMemoryUsage: () => {
        if ('memory' in performance) {
            const memory = performance.memory;
            const usagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            
            if (usagePercent > MemoryManager.config.MEMORY_THRESHOLD) {
                SecureLogger.warn('Uso de memoria alto detectado', {
                    used: memory.usedJSHeapSize,
                    total: memory.jsHeapSizeLimit,
                    percentage: (usagePercent * 100).toFixed(2) + '%'
                });
                
                // Forzar limpieza
                MemoryManager.cleanup();
            }
        }
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.MemoryManager = MemoryManager;
}

console.log('💾 Gestor de memoria cargado'); 