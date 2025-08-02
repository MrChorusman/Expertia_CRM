/**
 * Constantes centralizadas para Expertia CRM
 * Elimina valores hardcodeados y centraliza configuraciones
 */

const AppConstants = {
    // Configuración de Firebase
    FIREBASE: {
        MAX_RETRY_ATTEMPTS: 50,
        RETRY_DELAY: 100,
        TIMEOUT: 10000,
        MAX_RETRIES: 10
    },

    // Configuración de gastos
    EXPENSES: {
        DEFAULT_CATEGORIES: [
            'Alimentación', 'Transporte', 'Material de Oficina', 
            'Servicios', 'Equipamiento', 'Marketing', 'Formación', 'Otros'
        ],
        DEFAULT_SUBCATEGORIES: {
            'Alimentación': ['Comidas', 'Bebidas', 'Catering'],
            'Transporte': ['Gasolina', 'Taxi', 'Transporte público', 'Parking'],
            'Material de Oficina': ['Papelería', 'Equipos', 'Software'],
            'Servicios': ['Limpieza', 'Mantenimiento', 'Consultoría'],
            'Equipamiento': ['Mobiliario', 'Tecnología', 'Herramientas'],
            'Marketing': ['Publicidad', 'Eventos', 'Material promocional'],
            'Formación': ['Cursos', 'Certificaciones', 'Conferencias'],
            'Otros': ['Varios']
        },
        DEFAULT_PAYMENT_TYPES: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque', 'Otros'],
        DEFAULT_STATUSES: ['Pendiente', 'Aprobado', 'Rechazado', 'Pagado'],
        DEFAULT_TAGS: ['Urgente', 'Recurrente', 'Importante', 'Reembolsable'],
        MAX_AMOUNT: 1000000,
        MIN_AMOUNT: 0.01,
        CURRENCY: 'EUR'
    },

    // Configuración de facturas
    INVOICES: {
        DEFAULT_SERIES: ['EXP', 'ALQ', 'PROF'],
        DEFAULT_VAT_RATE: 0.21,
        DEFAULT_PAYMENT_TERMS: 30,
        DEFAULT_CURRENCY: 'EUR',
        MAX_AMOUNT: 1000000,
        MIN_AMOUNT: 0.01
    },

    // Configuración de ventas
    SALES: {
        FUNNEL_STAGES: [
            'Lead', 'Primer Contacto', 'Interesado', 'Demo Realizada',
            'Negociación', 'En Cierre', 'Ganado', 'Perdido'
        ],
        PRIORITIES: ['Alta', 'Media', 'Baja'],
        CONTACT_PREFERENCES: ['Email', 'Teléfono', 'WhatsApp', 'Visita Comercial'],
        SOURCES: ['Web', 'Referido', 'Llamada Fría', 'Evento', 'Partner', 'Publicidad']
    },

    // Configuración de clientes
    CLIENTS: {
        MAX_NAME_LENGTH: 100,
        MAX_EMAIL_LENGTH: 100,
        MAX_PHONE_LENGTH: 20,
        MAX_ADDRESS_LENGTH: 200,
        DEFAULT_STATUS: 'Activo',
        STATUSES: ['Activo', 'Inactivo', 'Prospecto', 'Cliente']
    },

    // Configuración de productos
    PRODUCTS: {
        MAX_NAME_LENGTH: 100,
        MAX_DESCRIPTION_LENGTH: 500,
        MAX_PRICE: 100000,
        MIN_PRICE: 0,
        DEFAULT_CURRENCY: 'EUR',
        DEFAULT_VAT_RATE: 0.21
    },

    // Configuración de UI
    UI: {
        NOTIFICATION_TIMEOUT: 3000,
        LOADING_TIMEOUT: 5000,
        SEARCH_DEBOUNCE: 300,
        PAGINATION_SIZE: 20,
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    },

    // Configuración de validación
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{9,}$/,
        PASSWORD_MIN_LENGTH: 8,
        NAME_MIN_LENGTH: 2,
        DESCRIPTION_MIN_LENGTH: 3,
        MAX_STRING_LENGTH: 1000
    },

    // Configuración de exportación
    EXPORT: {
        CSV_DELIMITER: ',',
        EXCEL_SHEET_NAME: 'Datos',
        PDF_PAGE_SIZE: 'A4',
        PDF_MARGIN: 20
    },

    // Configuración de notificaciones
    NOTIFICATIONS: {
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        },
        POSITIONS: {
            TOP_RIGHT: 'top-right',
            TOP_LEFT: 'top-left',
            BOTTOM_RIGHT: 'bottom-right',
            BOTTOM_LEFT: 'bottom-left'
        }
    },

    // Configuración de roles
    ROLES: {
        ADMIN: 'admin',
        COMERCIAL: 'comercial',
        CONTABLE: 'contable',
        VIEWER: 'viewer'
    },

    // Configuración de permisos
    PERMISSIONS: {
        VIEW_EXPENSES: 'view_expenses',
        CREATE_EXPENSES: 'create_expenses',
        EDIT_EXPENSES: 'edit_expenses',
        DELETE_EXPENSES: 'delete_expenses',
        VIEW_INVOICES: 'view_invoices',
        CREATE_INVOICES: 'create_invoices',
        EDIT_INVOICES: 'edit_invoices',
        DELETE_INVOICES: 'delete_invoices',
        VIEW_CLIENTS: 'view_clients',
        CREATE_CLIENTS: 'create_clients',
        EDIT_CLIENTS: 'edit_clients',
        DELETE_CLIENTS: 'delete_clients',
        VIEW_REPORTS: 'view_reports',
        EXPORT_DATA: 'export_data',
        MANAGE_SETTINGS: 'manage_settings'
    },

    // Configuración de estados
    STATUSES: {
        EXPENSE: {
            PENDING: 'Pendiente',
            APPROVED: 'Aprobado',
            REJECTED: 'Rechazado',
            PAID: 'Pagado'
        },
        INVOICE: {
            DRAFT: 'Borrador',
            SENT: 'Enviada',
            PAID: 'Pagada',
            OVERDUE: 'Vencida'
        },
        CLIENT: {
            ACTIVE: 'Activo',
            INACTIVE: 'Inactivo',
            PROSPECT: 'Prospecto'
        }
    },

    // Configuración de colores
    COLORS: {
        PRIMARY: '#006666',
        SECONDARY: '#008080',
        SUCCESS: '#10B981',
        WARNING: '#F59E0B',
        ERROR: '#EF4444',
        INFO: '#3B82F6',
        GRAY: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827'
        }
    },

    // Configuración de iconos
    ICONS: {
        DASHBOARD: 'BarChartIcon',
        EXPENSES: 'DollarSignIcon',
        INVOICES: 'FileTextIcon',
        CLIENTS: 'UsersIcon',
        REPORTS: 'TrendingUpIcon',
        SETTINGS: 'SettingsIcon',
        ADD: 'PlusIcon',
        EDIT: 'EditIcon',
        DELETE: 'TrashIcon',
        SAVE: 'CheckIcon',
        CANCEL: 'XIcon',
        SEARCH: 'SearchIcon',
        FILTER: 'FilterIcon',
        EXPORT: 'DownloadIcon',
        IMPORT: 'UploadIcon'
    },

    // Configuración de mensajes
    MESSAGES: {
        SUCCESS: {
            SAVE: 'Datos guardados correctamente',
            DELETE: 'Elemento eliminado correctamente',
            UPDATE: 'Datos actualizados correctamente',
            EXPORT: 'Datos exportados correctamente',
            IMPORT: 'Datos importados correctamente'
        },
        ERROR: {
            SAVE: 'Error al guardar los datos',
            DELETE: 'Error al eliminar el elemento',
            UPDATE: 'Error al actualizar los datos',
            EXPORT: 'Error al exportar los datos',
            IMPORT: 'Error al importar los datos',
            VALIDATION: 'Por favor, verifica los datos ingresados',
            NETWORK: 'Error de conexión. Verifica tu internet',
            PERMISSION: 'No tienes permisos para realizar esta acción'
        },
        WARNING: {
            UNSAVED_CHANGES: 'Tienes cambios sin guardar',
            DELETE_CONFIRMATION: '¿Estás seguro de que quieres eliminar este elemento?',
            SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'
        },
        INFO: {
            LOADING: 'Cargando datos...',
            PROCESSING: 'Procesando...',
            NO_DATA: 'No hay datos para mostrar',
            NO_RESULTS: 'No se encontraron resultados'
        }
    },

    // Configuración de fechas
    DATES: {
        FORMATS: {
            SHORT: 'DD/MM/YYYY',
            LONG: 'DD [de] MMMM [de] YYYY',
            TIME: 'HH:mm',
            DATETIME: 'DD/MM/YYYY HH:mm'
        },
        LOCALE: 'es-ES',
        TIMEZONE: 'Europe/Madrid'
    },

    // Configuración de moneda
    CURRENCY: {
        DEFAULT: 'EUR',
        SYMBOL: '€',
        LOCALE: 'es-ES',
        DECIMALS: 2
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.AppConstants = AppConstants;
}

console.log('⚙️ Constantes de aplicación cargadas'); 