/**
 * Sistema de notificaciones avanzado - Expertia CRM
 * Proporciona feedback visual mejorado y accesible
 */

const NotificationSystem = {
    // Configuración del sistema
    config: {
        DEFAULT_DURATION: 5000,
        ANIMATION_DURATION: 300,
        MAX_NOTIFICATIONS: 5,
        POSITIONS: {
            TOP_RIGHT: 'top-right',
            TOP_LEFT: 'top-left',
            BOTTOM_RIGHT: 'bottom-right',
            BOTTOM_LEFT: 'bottom-left',
            TOP_CENTER: 'top-center',
            BOTTOM_CENTER: 'bottom-center'
        },
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info',
            LOADING: 'loading'
        }
    },
    
    // Contenedor de notificaciones
    container: null,
    
    // Cola de notificaciones
    queue: [],
    
    // Inicializar sistema
    init: () => {
        NotificationSystem.createContainer();
        NotificationSystem.setupStyles();
        SecureLogger.success('Sistema de notificaciones inicializado');
    },
    
    // Crear contenedor de notificaciones
    createContainer: () => {
        // Crear contenedor principal
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
        
        // Crear contenedores para cada posición
        Object.values(NotificationSystem.config.POSITIONS).forEach(position => {
            const positionContainer = document.createElement('div');
            positionContainer.className = `notification-position ${position}`;
            container.appendChild(positionContainer);
        });
        
        NotificationSystem.container = container;
    },
    
    // Configurar estilos CSS
    setupStyles: () => {
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                z-index: 9999;
                pointer-events: none;
            }
            
            .notification-position {
                position: fixed;
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 20px;
                pointer-events: none;
            }
            
            .notification-position.top-right {
                top: 20px;
                right: 20px;
                align-items: flex-end;
            }
            
            .notification-position.top-left {
                top: 20px;
                left: 20px;
                align-items: flex-start;
            }
            
            .notification-position.bottom-right {
                bottom: 20px;
                right: 20px;
                align-items: flex-end;
            }
            
            .notification-position.bottom-left {
                bottom: 20px;
                left: 20px;
                align-items: flex-start;
            }
            
            .notification-position.top-center {
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                align-items: center;
            }
            
            .notification-position.bottom-center {
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                align-items: center;
            }
            
            .notification {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 16px 20px;
                min-width: 300px;
                max-width: 400px;
                pointer-events: auto;
                border-left: 4px solid;
                animation: notification-slide-in 0.3s ease-out;
                position: relative;
                overflow: hidden;
            }
            
            .notification.success {
                border-left-color: #10B981;
                background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%);
            }
            
            .notification.error {
                border-left-color: #EF4444;
                background: linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%);
            }
            
            .notification.warning {
                border-left-color: #F59E0B;
                background: linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%);
            }
            
            .notification.info {
                border-left-color: #3B82F6;
                background: linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%);
            }
            
            .notification.loading {
                border-left-color: #6B7280;
                background: linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%);
            }
            
            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .notification-title {
                font-weight: 600;
                font-size: 14px;
                color: #1F2937;
                margin: 0;
            }
            
            .notification-message {
                font-size: 13px;
                color: #6B7280;
                margin: 0;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #9CA3AF;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
                font-size: 16px;
                line-height: 1;
            }
            
            .notification-close:hover {
                background: rgba(0, 0, 0, 0.05);
                color: #6B7280;
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                animation: notification-progress 5s linear;
            }
            
            .notification-icon {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                flex-shrink: 0;
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                flex: 1;
            }
            
            @keyframes notification-slide-in {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes notification-slide-out {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
            }
            
            @keyframes notification-progress {
                from {
                    width: 100%;
                }
                to {
                    width: 0%;
                }
            }
            
            .notification.loading .notification-icon {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    min-width: 280px;
                    max-width: calc(100vw - 40px);
                }
                
                .notification-position {
                    padding: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    // Mostrar notificación
    show: (title, message, type = 'info', options = {}) => {
        const {
            duration = NotificationSystem.config.DEFAULT_DURATION,
            position = NotificationSystem.config.POSITIONS.TOP_RIGHT,
            closable = true,
            progress = true,
            icon = null
        } = options;
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Icono por defecto según tipo
        const defaultIcon = NotificationSystem.getDefaultIcon(type);
        const iconElement = icon || defaultIcon;
        
        // Contenido de la notificación
        notification.innerHTML = `
            <div class="notification-content">
                ${iconElement}
                <div class="notification-body">
                    <div class="notification-header">
                        <h4 class="notification-title">${title}</h4>
                        ${closable ? '<button class="notification-close" aria-label="Cerrar notificación">×</button>' : ''}
                    </div>
                    <p class="notification-message">${message}</p>
                </div>
            </div>
            ${progress && duration > 0 ? '<div class="notification-progress"></div>' : ''}
        `;
        
        // Agregar al contenedor correspondiente
        const positionContainer = NotificationSystem.container.querySelector(`.${position}`);
        if (positionContainer) {
            positionContainer.appendChild(notification);
            
            // Configurar auto-cierre
            if (duration > 0 && type !== 'loading') {
                setTimeout(() => {
                    NotificationSystem.hide(notification);
                }, duration);
            }
            
            // Configurar botón de cerrar
            const closeButton = notification.querySelector('.notification-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    NotificationSystem.hide(notification);
                });
            }
            
            // Limitar número de notificaciones
            NotificationSystem.limitNotifications(positionContainer);
            
            SecureLogger.log(`Notificación mostrada: ${title} (${type})`);
            return notification;
        }
        
        return null;
    },
    
    // Ocultar notificación
    hide: (notification) => {
        if (notification && notification.parentNode) {
            notification.style.animation = 'notification-slide-out 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    },
    
    // Limitar número de notificaciones
    limitNotifications: (container) => {
        const notifications = container.querySelectorAll('.notification');
        if (notifications.length > NotificationSystem.config.MAX_NOTIFICATIONS) {
            const oldestNotification = notifications[0];
            NotificationSystem.hide(oldestNotification);
        }
    },
    
    // Obtener icono por defecto
    getDefaultIcon: (type) => {
        const icons = {
            success: '<svg class="notification-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
            error: '<svg class="notification-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
            warning: '<svg class="notification-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
            info: '<svg class="notification-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>',
            loading: '<svg class="notification-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>'
        };
        
        return icons[type] || icons.info;
    },
    
    // Métodos de conveniencia
    success: (title, message, options = {}) => {
        return NotificationSystem.show(title, message, 'success', options);
    },
    
    error: (title, message, options = {}) => {
        return NotificationSystem.show(title, message, 'error', options);
    },
    
    warning: (title, message, options = {}) => {
        return NotificationSystem.show(title, message, 'warning', options);
    },
    
    info: (title, message, options = {}) => {
        return NotificationSystem.show(title, message, 'info', options);
    },
    
    loading: (title, message, options = {}) => {
        return NotificationSystem.show(title, message, 'loading', { ...options, duration: 0 });
    },
    
    // Limpiar todas las notificaciones
    clear: () => {
        const notifications = NotificationSystem.container.querySelectorAll('.notification');
        notifications.forEach(notification => {
            NotificationSystem.hide(notification);
        });
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.NotificationSystem = NotificationSystem;
    // Reemplazar función global showNotification
    window.showNotification = (title, message, type = 'info') => {
        return NotificationSystem.show(title, message, type);
    };
}

console.log('🎨 Sistema de notificaciones cargado'); 