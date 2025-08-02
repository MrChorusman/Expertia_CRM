/**
 * Sistema de accesibilidad - Expertia CRM
 * Mejora la experiencia para usuarios con discapacidades
 */

const AccessibilitySystem = {
    // Configuración del sistema
    config: {
        FOCUS_INDICATOR_COLOR: '#006666',
        HIGH_CONTRAST_MODE: false,
        REDUCED_MOTION: false,
        FONT_SIZE_MULTIPLIER: 1,
        KEYBOARD_NAVIGATION: true
    },
    
    // Estado del sistema
    state: {
        isHighContrast: false,
        isReducedMotion: false,
        fontSizeMultiplier: 1,
        isKeyboardNavigation: true
    },
    
    // Inicializar sistema
    init: () => {
        AccessibilitySystem.setupStyles();
        AccessibilitySystem.setupEventListeners();
        AccessibilitySystem.detectUserPreferences();
        AccessibilitySystem.setupKeyboardNavigation();
        SecureLogger.success('Sistema de accesibilidad inicializado');
    },
    
    // Configurar estilos CSS
    setupStyles: () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Focus Indicators */
            .focus-visible {
                outline: 2px solid #006666 !important;
                outline-offset: 2px !important;
            }
            
            /* High Contrast Mode */
            .high-contrast {
                background: #000000 !important;
                color: #FFFFFF !important;
            }
            
            .high-contrast * {
                background: #000000 !important;
                color: #FFFFFF !important;
                border-color: #FFFFFF !important;
            }
            
            .high-contrast .btn {
                background: #FFFFFF !important;
                color: #000000 !important;
                border: 2px solid #FFFFFF !important;
            }
            
            .high-contrast .card {
                background: #000000 !important;
                border: 2px solid #FFFFFF !important;
            }
            
            /* Reduced Motion */
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            /* Large Text */
            .large-text {
                font-size: 1.2em !important;
            }
            
            .large-text * {
                font-size: 1.2em !important;
            }
            
            /* Skip Links */
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #006666;
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
            }
            
            .skip-link:focus {
                top: 6px;
            }
            
            /* Screen Reader Only */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            /* ARIA Live Regions */
            .aria-live {
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }
            
            /* Keyboard Navigation */
            .keyboard-nav *:focus {
                outline: 2px solid #006666 !important;
                outline-offset: 2px !important;
            }
            
            /* Focus Trap */
            .focus-trap {
                position: relative;
            }
            
            /* Error States */
            .error-state {
                border-color: #EF4444 !important;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
            }
            
            .error-message {
                color: #EF4444;
                font-size: 0.875em;
                margin-top: 0.25rem;
            }
            
            /* Success States */
            .success-state {
                border-color: #10B981 !important;
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2) !important;
            }
            
            /* Loading States for Screen Readers */
            .loading-announcement {
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }
            
            /* Responsive Accessibility */
            @media (max-width: 768px) {
                .focus-visible {
                    outline-width: 3px !important;
                    outline-offset: 3px !important;
                }
                
                .large-text {
                    font-size: 1.1em !important;
                }
            }
            
            /* Print Styles */
            @media print {
                .skip-link,
                .aria-live,
                .loading-announcement {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    // Configurar event listeners
    setupEventListeners: () => {
        // Detectar preferencias del usuario
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        AccessibilitySystem.handleReducedMotion(mediaQuery);
        mediaQuery.addListener(AccessibilitySystem.handleReducedMotion);
        
        // Detectar preferencias de contraste
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        AccessibilitySystem.handleHighContrast(contrastQuery);
        contrastQuery.addListener(AccessibilitySystem.handleHighContrast);
        
        // Focus management
        document.addEventListener('focusin', AccessibilitySystem.handleFocusIn);
        document.addEventListener('focusout', AccessibilitySystem.handleFocusOut);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', AccessibilitySystem.handleKeyboardShortcuts);
    },
    
    // Detectar preferencias del usuario
    detectUserPreferences: () => {
        // Reducir movimiento
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            AccessibilitySystem.enableReducedMotion();
        }
        
        // Alto contraste
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            AccessibilitySystem.enableHighContrast();
        }
        
        // Tamaño de fuente del sistema
        const systemFontSize = window.getComputedStyle(document.body).fontSize;
        const fontSize = parseFloat(systemFontSize);
        if (fontSize > 16) {
            AccessibilitySystem.setFontSize(fontSize / 16);
        }
    },
    
    // Configurar navegación por teclado
    setupKeyboardNavigation: () => {
        // Agregar skip links
        AccessibilitySystem.addSkipLinks();
        
        // Configurar focus trap
        AccessibilitySystem.setupFocusTraps();
        
        // Agregar ARIA live regions
        AccessibilitySystem.addLiveRegions();
    },
    
    // Agregar skip links
    addSkipLinks: () => {
        const skipLinks = [
            { href: '#main-content', text: 'Saltar al contenido principal' },
            { href: '#navigation', text: 'Saltar a la navegación' },
            { href: '#search', text: 'Saltar a la búsqueda' }
        ];
        
        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.className = 'skip-link';
            skipLink.textContent = link.text;
            document.body.insertBefore(skipLink, document.body.firstChild);
        });
    },
    
    // Configurar focus traps
    setupFocusTraps: () => {
        const modals = document.querySelectorAll('[role="dialog"], [role="modal"]');
        modals.forEach(modal => {
            AccessibilitySystem.createFocusTrap(modal);
        });
    },
    
    // Crear focus trap
    createFocusTrap: (element) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    },
    
    // Agregar live regions
    addLiveRegions: () => {
        const liveRegions = [
            { id: 'status-messages', ariaLive: 'polite' },
            { id: 'error-messages', ariaLive: 'assertive' },
            { id: 'loading-announcements', ariaLive: 'polite' }
        ];
        
        liveRegions.forEach(region => {
            const liveRegion = document.createElement('div');
            liveRegion.id = region.id;
            liveRegion.className = 'aria-live';
            liveRegion.setAttribute('aria-live', region.ariaLive);
            document.body.appendChild(liveRegion);
        });
    },
    
    // Manejar focus in
    handleFocusIn: (event) => {
        const target = event.target;
        
        // Agregar clase de focus visible
        if (AccessibilitySystem.state.isKeyboardNavigation) {
            target.classList.add('focus-visible');
        }
        
        // Anunciar al screen reader si es necesario
        if (target.hasAttribute('aria-describedby')) {
            const description = document.getElementById(target.getAttribute('aria-describedby'));
            if (description) {
                AccessibilitySystem.announceToScreenReader(description.textContent);
            }
        }
    },
    
    // Manejar focus out
    handleFocusOut: (event) => {
        const target = event.target;
        target.classList.remove('focus-visible');
    },
    
    // Manejar shortcuts de teclado
    handleKeyboardShortcuts: (event) => {
        // Alt + 1: Ir al contenido principal
        if (event.altKey && event.key === '1') {
            event.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
            }
        }
        
        // Alt + 2: Ir a la navegación
        if (event.altKey && event.key === '2') {
            event.preventDefault();
            const navigation = document.getElementById('navigation');
            if (navigation) {
                navigation.focus();
            }
        }
        
        // Alt + 3: Ir a la búsqueda
        if (event.altKey && event.key === '3') {
            event.preventDefault();
            const search = document.getElementById('search');
            if (search) {
                search.focus();
            }
        }
        
        // Alt + H: Toggle alto contraste
        if (event.altKey && event.key === 'h') {
            event.preventDefault();
            AccessibilitySystem.toggleHighContrast();
        }
        
        // Alt + M: Toggle movimiento reducido
        if (event.altKey && event.key === 'm') {
            event.preventDefault();
            AccessibilitySystem.toggleReducedMotion();
        }
        
        // Alt + F: Toggle tamaño de fuente
        if (event.altKey && event.key === 'f') {
            event.preventDefault();
            AccessibilitySystem.toggleFontSize();
        }
    },
    
    // Manejar movimiento reducido
    handleReducedMotion: (mediaQuery) => {
        if (mediaQuery.matches) {
            AccessibilitySystem.enableReducedMotion();
        } else {
            AccessibilitySystem.disableReducedMotion();
        }
    },
    
    // Manejar alto contraste
    handleHighContrast: (mediaQuery) => {
        if (mediaQuery.matches) {
            AccessibilitySystem.enableHighContrast();
        } else {
            AccessibilitySystem.disableHighContrast();
        }
    },
    
    // Habilitar movimiento reducido
    enableReducedMotion: () => {
        document.documentElement.classList.add('reduced-motion');
        AccessibilitySystem.state.isReducedMotion = true;
        AccessibilitySystem.announceToScreenReader('Movimiento reducido activado');
    },
    
    // Deshabilitar movimiento reducido
    disableReducedMotion: () => {
        document.documentElement.classList.remove('reduced-motion');
        AccessibilitySystem.state.isReducedMotion = false;
    },
    
    // Habilitar alto contraste
    enableHighContrast: () => {
        document.documentElement.classList.add('high-contrast');
        AccessibilitySystem.state.isHighContrast = true;
        AccessibilitySystem.announceToScreenReader('Alto contraste activado');
    },
    
    // Deshabilitar alto contraste
    disableHighContrast: () => {
        document.documentElement.classList.remove('high-contrast');
        AccessibilitySystem.state.isHighContrast = false;
    },
    
    // Toggle alto contraste
    toggleHighContrast: () => {
        if (AccessibilitySystem.state.isHighContrast) {
            AccessibilitySystem.disableHighContrast();
        } else {
            AccessibilitySystem.enableHighContrast();
        }
    },
    
    // Toggle movimiento reducido
    toggleReducedMotion: () => {
        if (AccessibilitySystem.state.isReducedMotion) {
            AccessibilitySystem.disableReducedMotion();
        } else {
            AccessibilitySystem.enableReducedMotion();
        }
    },
    
    // Configurar tamaño de fuente
    setFontSize: (multiplier) => {
        AccessibilitySystem.state.fontSizeMultiplier = multiplier;
        document.documentElement.style.fontSize = `${multiplier * 100}%`;
        
        if (multiplier > 1) {
            document.documentElement.classList.add('large-text');
        } else {
            document.documentElement.classList.remove('large-text');
        }
    },
    
    // Toggle tamaño de fuente
    toggleFontSize: () => {
        const currentMultiplier = AccessibilitySystem.state.fontSizeMultiplier;
        const newMultiplier = currentMultiplier === 1 ? 1.2 : 1;
        AccessibilitySystem.setFontSize(newMultiplier);
        
        const message = newMultiplier > 1 ? 'Texto grande activado' : 'Texto normal activado';
        AccessibilitySystem.announceToScreenReader(message);
    },
    
    // Anunciar al screen reader
    announceToScreenReader: (message) => {
        const liveRegion = document.getElementById('status-messages');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Limpiar después de un tiempo
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },
    
    // Anunciar error al screen reader
    announceError: (message) => {
        const liveRegion = document.getElementById('error-messages');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 3000);
        }
    },
    
    // Anunciar carga al screen reader
    announceLoading: (message) => {
        const liveRegion = document.getElementById('loading-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    },
    
    // Limpiar anuncio de carga
    clearLoadingAnnouncement: () => {
        const liveRegion = document.getElementById('loading-announcements');
        if (liveRegion) {
            liveRegion.textContent = '';
        }
    },
    
    // Validar accesibilidad de un elemento
    validateAccessibility: (element) => {
        const issues = [];
        
        // Verificar alt text en imágenes
        const images = element.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                issues.push('Imagen sin texto alternativo');
            }
        });
        
        // Verificar labels en formularios
        const inputs = element.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                const label = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
                if (!label) {
                    issues.push('Campo sin etiqueta');
                }
            }
        });
        
        // Verificar contraste de colores
        const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
        textElements.forEach(textEl => {
            const style = window.getComputedStyle(textEl);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // Verificación básica de contraste
            if (color === backgroundColor) {
                issues.push('Problema de contraste detectado');
            }
        });
        
        return issues;
    },
    
    // Generar reporte de accesibilidad
    generateAccessibilityReport: () => {
        const issues = AccessibilitySystem.validateAccessibility(document.body);
        
        return {
            totalIssues: issues.length,
            issues: issues,
            recommendations: [
                'Agregar texto alternativo a todas las imágenes',
                'Asegurar que todos los campos de formulario tengan etiquetas',
                'Verificar el contraste de colores',
                'Probar navegación por teclado',
                'Verificar que el contenido sea accesible para screen readers'
            ]
        };
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.AccessibilitySystem = AccessibilitySystem;
}

console.log('♿ Sistema de accesibilidad cargado'); 