/**
 * Optimizador de React - Expertia CRM
 * Implementa memo, lazy loading y optimización de re-renders
 */

const ReactOptimizer = {
    // Configuración de optimización
    config: {
        MEMO_THRESHOLD: 100, // Componentes con más de 100 elementos se memoizan
        LAZY_LOAD_THRESHOLD: 50, // Componentes con más de 50 elementos se cargan lazy
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100
    },
    
    // Cache de componentes memoizados
    memoCache: new Map(),
    
    // Timers para debounce y throttle
    debounceTimers: new Map(),
    throttleTimers: new Map(),
    
    // Crear componente memoizado
    createMemoizedComponent: (Component, propsAreEqual = null) => {
        const MemoizedComponent = React.memo(Component, propsAreEqual);
        
        // Agregar metadata para debugging
        MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`;
        
        return MemoizedComponent;
    },
    
    // Crear componente con lazy loading
    createLazyComponent: (importFunc, fallback = null) => {
        const LazyComponent = React.lazy(importFunc);
        
        // Wrapper con fallback personalizado
        const LazyWrapper = (props) => {
            return (
                <React.Suspense fallback={fallback || <div>Cargando...</div>}>
                    <LazyComponent {...props} />
                </React.Suspense>
            );
        };
        
        LazyWrapper.displayName = `Lazy(${LazyComponent.displayName || 'Component'})`;
        return LazyWrapper;
    },
    
    // Hook para optimizar listas grandes
    useOptimizedList: (data, options = {}) => {
        const {
            pageSize = 20,
            sortBy = null,
            filterBy = null,
            searchTerm = null
        } = options;
        
        const [currentPage, setCurrentPage] = React.useState(1);
        const [optimizedData, setOptimizedData] = React.useState([]);
        
        // Memoizar datos optimizados
        React.useMemo(() => {
            let processedData = [...data];
            
            // Aplicar filtro
            if (filterBy) {
                processedData = processedData.filter(filterBy);
            }
            
            // Aplicar búsqueda
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                processedData = processedData.filter(item => {
                    return Object.values(item).some(value => 
                        String(value).toLowerCase().includes(searchLower)
                    );
                });
            }
            
            // Aplicar ordenación
            if (sortBy) {
                processedData.sort((a, b) => {
                    let aVal = a[sortBy];
                    let bVal = b[sortBy];
                    
                    if (aVal instanceof Date || bVal instanceof Date) {
                        aVal = new Date(aVal).getTime();
                        bVal = new Date(bVal).getTime();
                    }
                    
                    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
                    
                    return aVal > bVal ? 1 : -1;
                });
            }
            
            setOptimizedData(processedData);
        }, [data, filterBy, searchTerm, sortBy]);
        
        // Calcular paginación
        const totalPages = Math.ceil(optimizedData.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, optimizedData.length);
        const currentData = optimizedData.slice(startIndex, endIndex);
        
        return {
            data: currentData,
            totalItems: optimizedData.length,
            currentPage,
            totalPages,
            setCurrentPage,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        };
    },
    
    // Hook para debounce
    useDebounce: (value, delay = ReactOptimizer.config.DEBOUNCE_DELAY) => {
        const [debouncedValue, setDebouncedValue] = React.useState(value);
        
        React.useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            
            return () => {
                clearTimeout(timer);
            };
        }, [value, delay]);
        
        return debouncedValue;
    },
    
    // Hook para throttle
    useThrottle: (value, delay = ReactOptimizer.config.THROTTLE_DELAY) => {
        const [throttledValue, setThrottledValue] = React.useState(value);
        const lastRun = React.useRef(Date.now());
        
        React.useEffect(() => {
            const handler = setTimeout(() => {
                if (Date.now() - lastRun.current >= delay) {
                    setThrottledValue(value);
                    lastRun.current = Date.now();
                }
            }, delay - (Date.now() - lastRun.current));
            
            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);
        
        return throttledValue;
    },
    
    // Hook para lazy loading de imágenes
    useLazyImage: (src, placeholder = null) => {
        const [isLoaded, setIsLoaded] = React.useState(false);
        const [error, setError] = React.useState(false);
        
        React.useEffect(() => {
            const img = new Image();
            
            img.onload = () => {
                setIsLoaded(true);
            };
            
            img.onerror = () => {
                setError(true);
            };
            
            img.src = src;
            
            return () => {
                img.onload = null;
                img.onerror = null;
            };
        }, [src]);
        
        return {
            isLoaded,
            error,
            src: isLoaded ? src : placeholder
        };
    },
    
    // Hook para virtualización de listas
    useVirtualList: (items, itemHeight = 50, containerHeight = 400) => {
        const [scrollTop, setScrollTop] = React.useState(0);
        
        const visibleItemCount = Math.ceil(containerHeight / itemHeight);
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleItemCount, items.length);
        
        const visibleItems = items.slice(startIndex, endIndex);
        const totalHeight = items.length * itemHeight;
        const offsetY = startIndex * itemHeight;
        
        return {
            visibleItems,
            totalHeight,
            offsetY,
            onScroll: (e) => setScrollTop(e.target.scrollTop)
        };
    },
    
    // Optimizar re-renders con useCallback
    useOptimizedCallback: (callback, deps) => {
        return React.useCallback(callback, deps);
    },
    
    // Optimizar cálculos costosos con useMemo
    useOptimizedMemo: (factory, deps) => {
        return React.useMemo(factory, deps);
    },
    
    // Crear componente con optimización automática
    createOptimizedComponent: (Component, options = {}) => {
        const {
            memo = true,
            lazy = false,
            virtualized = false,
            debounced = false
        } = options;
        
        let OptimizedComponent = Component;
        
        // Aplicar memo si está habilitado
        if (memo) {
            OptimizedComponent = ReactOptimizer.createMemoizedComponent(OptimizedComponent);
        }
        
        // Aplicar lazy loading si está habilitado
        if (lazy) {
            OptimizedComponent = ReactOptimizer.createLazyComponent(() => 
                Promise.resolve({ default: OptimizedComponent })
            );
        }
        
        return OptimizedComponent;
    },
    
    // Limpiar timers
    cleanup: () => {
        // Limpiar debounce timers
        for (const [key, timer] of ReactOptimizer.debounceTimers.entries()) {
            clearTimeout(timer);
        }
        ReactOptimizer.debounceTimers.clear();
        
        // Limpiar throttle timers
        for (const [key, timer] of ReactOptimizer.throttleTimers.entries()) {
            clearTimeout(timer);
        }
        ReactOptimizer.throttleTimers.clear();
        
        // Limpiar cache de memo
        ReactOptimizer.memoCache.clear();
    },
    
    // Obtener estadísticas de optimización
    getOptimizationStats: () => {
        return {
            memoCacheSize: ReactOptimizer.memoCache.size,
            debounceTimers: ReactOptimizer.debounceTimers.size,
            throttleTimers: ReactOptimizer.throttleTimers.size
        };
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.ReactOptimizer = ReactOptimizer;
}

console.log('🚀 Optimizador de React cargado'); 