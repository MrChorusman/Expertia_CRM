/**
 * Utilidades compartidas para Expertia CRM
 * Centraliza funciones comunes y elimina código duplicado
 */

const SharedUtils = {
    // Utilidades de formato
    formatCurrency: (amount, currency = 'EUR') => {
        if (typeof amount !== 'number' || isNaN(amount)) return '0,00 €';
        
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    formatDate: (date, format = 'short') => {
        if (!date) return 'N/A';
        
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return 'Fecha inválida';
        
        switch (format) {
            case 'short':
                return dateObj.toLocaleDateString('es-ES');
            case 'long':
                return dateObj.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'time':
                return dateObj.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            case 'datetime':
                return dateObj.toLocaleString('es-ES');
            default:
                return dateObj.toLocaleDateString('es-ES');
        }
    },

    formatPercentage: (value, decimals = 1) => {
        if (typeof value !== 'number' || isNaN(value)) return '0%';
        return `${value.toFixed(decimals)}%`;
    },

    // Utilidades de validación
    isValidEmail: (email) => {
        if (!email || typeof email !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    isValidPhone: (phone) => {
        if (!phone || typeof phone !== 'string') return false;
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        return phoneRegex.test(phone.trim());
    },

    isValidAmount: (amount, min = 0, max = 1000000) => {
        const num = Number(amount);
        return !isNaN(num) && num >= min && num <= max;
    },

    // Utilidades de arrays y objetos
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(item);
            return groups;
        }, {});
    },

    sortBy: (array, key, direction = 'asc') => {
        return [...array].sort((a, b) => {
            let aVal = a[key];
            let bVal = b[key];
            
            // Manejar fechas
            if (aVal instanceof Date || bVal instanceof Date) {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }
            
            // Manejar strings
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            
            if (direction === 'desc') {
                return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
        });
    },

    filterBy: (array, filters) => {
        return array.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === null || value === undefined || value === '') return true;
                
                const itemValue = item[key];
                if (typeof value === 'string') {
                    return itemValue && itemValue.toLowerCase().includes(value.toLowerCase());
                }
                return itemValue === value;
            });
        });
    },

    // Utilidades de cálculo
    calculateTotal: (items, key = 'amount') => {
        return items.reduce((total, item) => {
            const value = Number(item[key]) || 0;
            return total + value;
        }, 0);
    },

    calculateAverage: (items, key = 'amount') => {
        if (items.length === 0) return 0;
        const total = SharedUtils.calculateTotal(items, key);
        return total / items.length;
    },

    calculatePercentage: (value, total) => {
        if (total === 0) return 0;
        return (value / total) * 100;
    },

    // Utilidades de UI
    showNotification: (title, message, type = 'info') => {
        // Implementación básica de notificaciones
        const notification = {
            title,
            message,
            type,
            timestamp: new Date().toISOString()
        };
        
        // Si hay un sistema de notificaciones global, usarlo
        if (window.showNotification) {
            window.showNotification(title, message, type);
        } else {
            // Fallback básico
            console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        }
        
        return notification;
    },

    // Utilidades de configuración
    getConfigValue: (config, path, defaultValue = null) => {
        const keys = path.split('.');
        let value = config;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    },

    setConfigValue: (config, path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = config;
        
        for (const key of keys) {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
        return config;
    },

    // Utilidades de exportación
    exportToCSV: (data, filename = 'export.csv') => {
        if (!Array.isArray(data) || data.length === 0) {
            SharedUtils.showNotification('Error', 'No hay datos para exportar', 'error');
            return false;
        }
        
        try {
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => {
                        const value = row[header];
                        return typeof value === 'string' && value.includes(',') 
                            ? `"${value}"` 
                            : value;
                    }).join(',')
                )
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            
            SharedUtils.showNotification('Éxito', 'Datos exportados correctamente', 'success');
            return true;
        } catch (error) {
            SharedUtils.showNotification('Error', 'Error al exportar datos', 'error');
            return false;
        }
    },

    // Utilidades de fecha
    getDateRange: (period = 'month') => {
        const now = new Date();
        const start = new Date();
        
        switch (period) {
            case 'week':
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                start.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                start.setFullYear(now.getFullYear() - 1);
                break;
            default:
                start.setMonth(now.getMonth() - 1);
        }
        
        return { start, end: now };
    },

    isDateInRange: (date, start, end) => {
        const dateObj = new Date(date);
        const startObj = new Date(start);
        const endObj = new Date(end);
        
        return dateObj >= startObj && dateObj <= endObj;
    },

    // Utilidades de strings
    capitalize: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    truncate: (str, length = 50) => {
        if (!str || typeof str !== 'string') return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    slugify: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.SharedUtils = SharedUtils;
}

console.log('🛠️ Utilidades compartidas cargadas'); 