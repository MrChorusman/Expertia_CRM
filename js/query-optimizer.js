/**
 * Optimizador de queries para Firebase - Expertia CRM
 * Implementa paginación, filtros eficientes y optimización de consultas
 */

const QueryOptimizer = {
    // Configuración de paginación
    pagination: {
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100,
        MIN_PAGE_SIZE: 5
    },
    
    // Configuración de debounce para búsquedas
    debounce: {
        SEARCH_DELAY: 300,
        FILTER_DELAY: 500
    },
    
    // Timers de debounce
    debounceTimers: new Map(),
    
    // Crear query optimizada
    createOptimizedQuery: (collection, options = {}) => {
        const {
            page = 1,
            pageSize = QueryOptimizer.pagination.DEFAULT_PAGE_SIZE,
            orderBy = null,
            orderDirection = 'desc',
            filters = {},
            search = null,
            limit = null
        } = options;
        
        try {
            const firestore = FirebaseContext.getFirestore();
            const { collection: firebaseCollection, query, where, orderBy: firebaseOrderBy, limit: firebaseLimit, startAfter } = window.firebase;
            
            let q = firebaseCollection(firestore, collection);
            
            // Aplicar filtros
            for (const [field, value] of Object.entries(filters)) {
                if (value !== null && value !== undefined && value !== '') {
                    q = query(q, where(field, '==', value));
                }
            }
            
            // Aplicar ordenación
            if (orderBy) {
                q = query(q, firebaseOrderBy(orderBy, orderDirection));
            }
            
            // Aplicar límite
            const finalLimit = limit || pageSize;
            if (finalLimit <= QueryOptimizer.pagination.MAX_PAGE_SIZE) {
                q = query(q, firebaseLimit(finalLimit));
            }
            
            return q;
        } catch (error) {
            SecureLogger.error('Error creando query optimizada', error);
            throw error;
        }
    },
    
    // Ejecutar query con caché
    executeQuery: async (collection, options = {}) => {
        const cacheKey = FirebaseCache.generateKey(collection, null, options);
        
        // Intentar obtener del caché
        const cachedResult = FirebaseCache.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        
        try {
            const q = QueryOptimizer.createOptimizedQuery(collection, options);
            const { getDocs } = window.firebase;
            
            const startTime = performance.now();
            const snapshot = await getDocs(q);
            const endTime = performance.now();
            
            const data = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            
            const result = {
                data,
                total: data.length,
                queryTime: endTime - startTime,
                timestamp: Date.now()
            };
            
            // Guardar en caché
            FirebaseCache.set(cacheKey, result);
            
            SecureLogger.success(`Query ejecutada en ${result.queryTime.toFixed(2)}ms`);
            return result;
            
        } catch (error) {
            SecureLogger.error('Error ejecutando query optimizada', error);
            throw error;
        }
    },
    
    // Implementar búsqueda con debounce
    debouncedSearch: (callback, delay = QueryOptimizer.debounce.SEARCH_DELAY) => {
        return (...args) => {
            const key = callback.toString();
            
            // Limpiar timer anterior
            if (QueryOptimizer.debounceTimers.has(key)) {
                clearTimeout(QueryOptimizer.debounceTimers.get(key));
            }
            
            // Crear nuevo timer
            const timer = setTimeout(() => {
                callback(...args);
                QueryOptimizer.debounceTimers.delete(key);
            }, delay);
            
            QueryOptimizer.debounceTimers.set(key, timer);
        };
    },
    
    // Implementar filtros con debounce
    debouncedFilter: (callback, delay = QueryOptimizer.debounce.FILTER_DELAY) => {
        return QueryOptimizer.debouncedSearch(callback, delay);
    },
    
    // Paginación inteligente
    createPagination: (totalItems, currentPage = 1, pageSize = QueryOptimizer.pagination.DEFAULT_PAGE_SIZE) => {
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        
        return {
            currentPage,
            totalPages,
            pageSize,
            totalItems,
            startIndex,
            endIndex,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
            pages: QueryOptimizer.generatePageNumbers(currentPage, totalPages)
        };
    },
    
    // Generar números de página para navegación
    generatePageNumbers: (currentPage, totalPages, maxVisible = 5) => {
        const pages = [];
        const halfVisible = Math.floor(maxVisible / 2);
        
        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        // Ajustar si no hay suficientes páginas
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    },
    
    // Optimizar lista de datos
    optimizeList: (data, options = {}) => {
        const {
            sortBy = null,
            sortDirection = 'asc',
            filterBy = null,
            searchTerm = null,
            limit = null
        } = options;
        
        let optimizedData = [...data];
        
        // Aplicar filtro
        if (filterBy) {
            optimizedData = optimizedData.filter(filterBy);
        }
        
        // Aplicar búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            optimizedData = optimizedData.filter(item => {
                return Object.values(item).some(value => 
                    String(value).toLowerCase().includes(searchLower)
                );
            });
        }
        
        // Aplicar ordenación
        if (sortBy) {
            optimizedData.sort((a, b) => {
                let aVal = a[sortBy];
                let bVal = b[sortBy];
                
                // Manejar fechas
                if (aVal instanceof Date || bVal instanceof Date) {
                    aVal = new Date(aVal).getTime();
                    bVal = new Date(bVal).getTime();
                }
                
                // Manejar strings
                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();
                
                if (sortDirection === 'desc') {
                    return bVal > aVal ? 1 : -1;
                }
                return aVal > bVal ? 1 : -1;
            });
        }
        
        // Aplicar límite
        if (limit) {
            optimizedData = optimizedData.slice(0, limit);
        }
        
        return optimizedData;
    },
    
    // Prefetch de datos
    prefetchData: async (collection, options = {}) => {
        try {
            const cacheKey = FirebaseCache.generateKey(collection, null, options);
            
            // Solo prefetch si no está en caché
            if (!FirebaseCache.get(cacheKey)) {
                SecureLogger.log(`Prefetching data for ${collection}`);
                await QueryOptimizer.executeQuery(collection, options);
            }
        } catch (error) {
            SecureLogger.error('Error en prefetch', error);
        }
    },
    
    // Limpiar timers de debounce
    cleanupDebounceTimers: () => {
        for (const [key, timer] of QueryOptimizer.debounceTimers.entries()) {
            clearTimeout(timer);
        }
        QueryOptimizer.debounceTimers.clear();
    },
    
    // Obtener estadísticas de queries
    getQueryStats: () => {
        return {
            debounceTimers: QueryOptimizer.debounceTimers.size,
            cacheStats: FirebaseCache.getStats()
        };
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.QueryOptimizer = QueryOptimizer;
}

console.log('⚡ Optimizador de queries cargado'); 