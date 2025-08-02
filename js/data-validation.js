/**
 * Sistema de validación de datos para Expertia CRM
 * Previene entradas malformadas y ataques de inyección
 */

const DataValidator = {
    // Sanitizar strings
    sanitizeString: (input) => {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Prevenir HTML injection
            .replace(/javascript:/gi, '') // Prevenir JS injection
            .substring(0, 1000); // Limitar longitud
    },

    // Validar email
    validateEmail: (email) => {
        if (!email || typeof email !== 'string') return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    // Validar número
    validateNumber: (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    // Validar fecha
    validateDate: (dateString) => {
        if (!dateString) return false;
        
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && date <= new Date();
    },

    // Validar datos de gasto
    validateExpense: (expenseData) => {
        const errors = [];
        
        // Validar monto
        if (!DataValidator.validateNumber(expenseData.amount, 0.01, 1000000)) {
            errors.push('Monto inválido (debe ser entre 0.01 y 1,000,000)');
        }
        
        // Validar categoría
        if (!expenseData.category || typeof expenseData.category !== 'string') {
            errors.push('Categoría es requerida');
        }
        
        // Validar fecha
        if (!DataValidator.validateDate(expenseData.date)) {
            errors.push('Fecha inválida');
        }
        
        // Validar descripción
        const description = DataValidator.sanitizeString(expenseData.description);
        if (!description || description.length < 3) {
            errors.push('Descripción debe tener al menos 3 caracteres');
        }
        
        // Validar proveedor
        if (expenseData.provider) {
            const provider = DataValidator.sanitizeString(expenseData.provider);
            if (provider.length > 100) {
                errors.push('Proveedor demasiado largo');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedData: {
                ...expenseData,
                description: DataValidator.sanitizeString(expenseData.description),
                provider: expenseData.provider ? DataValidator.sanitizeString(expenseData.provider) : '',
                category: DataValidator.sanitizeString(expenseData.category)
            }
        };
    },

    // Validar datos de cliente
    validateClient: (clientData) => {
        const errors = [];
        
        // Validar nombre
        const name = DataValidator.sanitizeString(clientData.name);
        if (!name || name.length < 2) {
            errors.push('Nombre debe tener al menos 2 caracteres');
        }
        
        // Validar email
        if (clientData.email && !DataValidator.validateEmail(clientData.email)) {
            errors.push('Email inválido');
        }
        
        // Validar teléfono
        if (clientData.phone) {
            const phone = DataValidator.sanitizeString(clientData.phone);
            if (phone.length > 20) {
                errors.push('Teléfono demasiado largo');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedData: {
                ...clientData,
                name: DataValidator.sanitizeString(clientData.name),
                email: clientData.email ? clientData.email.trim() : '',
                phone: clientData.phone ? DataValidator.sanitizeString(clientData.phone) : '',
                address: clientData.address ? DataValidator.sanitizeString(clientData.address) : ''
            }
        };
    },

    // Validar configuración de gastos
    validateExpenseConfig: (config) => {
        const errors = [];
        
        // Validar categorías
        if (!Array.isArray(config.categories) || config.categories.length === 0) {
            errors.push('Debe haber al menos una categoría');
        }
        
        // Validar subcategorías
        if (config.subcategories && typeof config.subcategories === 'object') {
            for (const [category, subcategories] of Object.entries(config.subcategories)) {
                if (!Array.isArray(subcategories)) {
                    errors.push(`Subcategorías de "${category}" deben ser un array`);
                }
            }
        }
        
        // Validar tipos de pago
        if (!Array.isArray(config.paymentTypes) || config.paymentTypes.length === 0) {
            errors.push('Debe haber al menos un tipo de pago');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Validar entrada de usuario
    validateUserInput: (input, type = 'string') => {
        switch (type) {
            case 'email':
                return DataValidator.validateEmail(input);
            case 'number':
                return DataValidator.validateNumber(input);
            case 'date':
                return DataValidator.validateDate(input);
            case 'string':
            default:
                return DataValidator.sanitizeString(input).length > 0;
        }
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.DataValidator = DataValidator;
}

console.log('🔒 Sistema de validación de datos cargado'); 