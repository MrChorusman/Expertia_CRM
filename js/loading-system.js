/**
 * Sistema de estados de carga - Expertia CRM
 * Proporciona feedback visual durante operaciones asíncronas
 */

const LoadingSystem = {
    // Configuración del sistema
    config: {
        DEFAULT_DURATION: 2000,
        MIN_LOADING_TIME: 500,
        SKELETON_ANIMATION_DURATION: 1500,
        SPINNER_SIZES: {
            SMALL: 'sm',
            MEDIUM: 'md',
            LARGE: 'lg'
        }
    },
    
    // Estados de carga activos
    activeLoadings: new Map(),
    
    // Inicializar sistema
    init: () => {
        LoadingSystem.setupStyles();
        SecureLogger.success('Sistema de loading inicializado');
    },
    
    // Configurar estilos CSS
    setupStyles: () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Spinner Component */
            .loading-spinner {
                display: inline-block;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #006666;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .loading-spinner.sm {
                width: 16px;
                height: 16px;
            }
            
            .loading-spinner.md {
                width: 24px;
                height: 24px;
            }
            
            .loading-spinner.lg {
                width: 32px;
                height: 32px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Skeleton Loading */
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
            }
            
            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            .skeleton-text {
                height: 1em;
                margin-bottom: 0.5em;
            }
            
            .skeleton-text:last-child {
                width: 60%;
            }
            
            .skeleton-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
            
            .skeleton-card {
                padding: 1rem;
                border-radius: 8px;
                background: white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            /* Loading Overlay */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(2px);
            }
            
            .loading-overlay .loading-content {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .loading-overlay .loading-spinner {
                margin-bottom: 1rem;
            }
            
            .loading-overlay .loading-text {
                color: #6B7280;
                font-size: 14px;
                margin: 0;
            }
            
            /* Button Loading States */
            .btn-loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }
            
            .btn-loading .loading-spinner {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
            
            .btn-loading .btn-text {
                opacity: 0;
            }
            
            /* Table Loading */
            .table-loading {
                position: relative;
                min-height: 200px;
            }
            
            .table-loading::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
            }
            
            .table-loading .loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
            }
            
            /* Progress Bar */
            .progress-bar {
                width: 100%;
                height: 4px;
                background: #f3f4f6;
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #006666, #008080);
                border-radius: 2px;
                transition: width 0.3s ease;
                animation: progress-pulse 2s ease-in-out infinite;
            }
            
            @keyframes progress-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            /* Pulse Animation */
            .pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            /* Responsive Loading */
            @media (max-width: 768px) {
                .loading-overlay .loading-content {
                    padding: 1.5rem;
                    margin: 1rem;
                }
                
                .skeleton-card {
                    padding: 0.75rem;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    // Crear spinner
    createSpinner: (size = 'md', className = '') => {
        const spinner = document.createElement('div');
        spinner.className = `loading-spinner ${size} ${className}`;
        return spinner;
    },
    
    // Crear skeleton
    createSkeleton: (type = 'text', lines = 3) => {
        const skeleton = document.createElement('div');
        
        switch (type) {
            case 'text':
                skeleton.innerHTML = Array(lines).fill('<div class="skeleton skeleton-text"></div>').join('');
                break;
            case 'card':
                skeleton.className = 'skeleton-card';
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                `;
                break;
            case 'avatar':
                skeleton.className = 'skeleton-avatar skeleton';
                break;
            default:
                skeleton.className = 'skeleton';
        }
        
        return skeleton;
    },
    
    // Mostrar overlay de carga
    showOverlay: (message = 'Cargando...', options = {}) => {
        const {
            spinnerSize = 'lg',
            showProgress = false,
            progressValue = 0
        } = options;
        
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loading-overlay';
        
        const content = document.createElement('div');
        content.className = 'loading-content';
        
        const spinner = LoadingSystem.createSpinner(spinnerSize);
        const text = document.createElement('p');
        text.className = 'loading-text';
        text.textContent = message;
        
        content.appendChild(spinner);
        content.appendChild(text);
        
        if (showProgress) {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.innerHTML = `<div class="progress-bar-fill" style="width: ${progressValue}%"></div>`;
            content.appendChild(progressBar);
        }
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        return overlay;
    },
    
    // Ocultar overlay de carga
    hideOverlay: () => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    },
    
    // Configurar botón con estado de carga
    setupButtonLoading: (button, loadingText = 'Cargando...') => {
        const originalText = button.textContent;
        const spinner = LoadingSystem.createSpinner('sm');
        
        return {
            start: () => {
                button.classList.add('btn-loading');
                button.disabled = true;
                
                const textSpan = document.createElement('span');
                textSpan.className = 'btn-text';
                textSpan.textContent = loadingText;
                
                button.innerHTML = '';
                button.appendChild(spinner);
                button.appendChild(textSpan);
            },
            
            stop: () => {
                button.classList.remove('btn-loading');
                button.disabled = false;
                button.textContent = originalText;
            }
        };
    },
    
    // Configurar tabla con estado de carga
    setupTableLoading: (table) => {
        const originalContent = table.innerHTML;
        
        return {
            start: () => {
                table.classList.add('table-loading');
                const spinner = LoadingSystem.createSpinner('md');
                table.appendChild(spinner);
            },
            
            stop: () => {
                table.classList.remove('table-loading');
                const spinner = table.querySelector('.loading-spinner');
                if (spinner) {
                    spinner.remove();
                }
            }
        };
    },
    
    // Crear loading con progreso
    createProgressLoading: (container, options = {}) => {
        const {
            message = 'Procesando...',
            showPercentage = true,
            onProgress = null
        } = options;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-loading';
        
        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageEl.style.marginBottom = '10px';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-bar-fill" style="width: 0%"></div>';
        
        const percentageEl = showPercentage ? document.createElement('span') : null;
        if (percentageEl) {
            percentageEl.style.fontSize = '12px';
            percentageEl.style.color = '#6B7280';
            percentageEl.textContent = '0%';
        }
        
        progressContainer.appendChild(messageEl);
        progressContainer.appendChild(progressBar);
        if (percentageEl) {
            progressContainer.appendChild(percentageEl);
        }
        
        container.appendChild(progressContainer);
        
        return {
            update: (percentage) => {
                const fill = progressBar.querySelector('.progress-bar-fill');
                fill.style.width = `${percentage}%`;
                
                if (percentageEl) {
                    percentageEl.textContent = `${Math.round(percentage)}%`;
                }
                
                if (onProgress) {
                    onProgress(percentage);
                }
            },
            
            complete: () => {
                progressContainer.remove();
            }
        };
    },
    
    // Loading con debounce
    createDebouncedLoading: (delay = 300) => {
        let loadingTimeout = null;
        let overlay = null;
        
        return {
            start: (message = 'Cargando...') => {
                if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                }
                
                loadingTimeout = setTimeout(() => {
                    overlay = LoadingSystem.showOverlay(message);
                }, delay);
            },
            
            stop: () => {
                if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                    loadingTimeout = null;
                }
                
                if (overlay) {
                    LoadingSystem.hideOverlay();
                    overlay = null;
                }
            }
        };
    },
    
    // Loading con skeleton
    createSkeletonLoading: (container, type = 'card', count = 3) => {
        const skeletons = [];
        
        for (let i = 0; i < count; i++) {
            const skeleton = LoadingSystem.createSkeleton(type);
            skeletons.push(skeleton);
            container.appendChild(skeleton);
        }
        
        return {
            remove: () => {
                skeletons.forEach(skeleton => {
                    if (skeleton.parentNode) {
                        skeleton.parentNode.removeChild(skeleton);
                    }
                });
            }
        };
    },
    
    // Loading con pulse
    createPulseLoading: (element) => {
        element.classList.add('pulse');
        
        return {
            stop: () => {
                element.classList.remove('pulse');
            }
        };
    },
    
    // Wrapper para operaciones asíncronas
    wrapAsync: async (asyncFunction, options = {}) => {
        const {
            message = 'Procesando...',
            showOverlay = true,
            minDuration = LoadingSystem.config.MIN_LOADING_TIME
        } = options;
        
        let overlay = null;
        const startTime = Date.now();
        
        try {
            if (showOverlay) {
                overlay = LoadingSystem.showOverlay(message);
            }
            
            const result = await asyncFunction();
            
            // Asegurar tiempo mínimo de carga
            const elapsed = Date.now() - startTime;
            if (elapsed < minDuration) {
                await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
            }
            
            return result;
        } finally {
            if (overlay) {
                LoadingSystem.hideOverlay();
            }
        }
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.LoadingSystem = LoadingSystem;
}

console.log('📱 Sistema de loading cargado'); 