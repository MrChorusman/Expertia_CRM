// Sistema de Gestión de Roles y Permisos para Expertia CRM
// Versión 1.0 - Septiembre 2025

class RoleManager {
    constructor() {
        this.currentUser = null;
        this.userProfile = null;
        this.isInitialized = false;
    }

    // Inicializar el gestor de roles
    async init() {
        try {
            console.log('🔐 Inicializando RoleManager...');
            
            // Obtener usuario actual
            if (window.authManager && window.authManager.currentUser) {
                this.currentUser = window.authManager.currentUser;
                this.userProfile = await window.authManager.getUserProfile();
                this.isInitialized = true;
                
                console.log('✅ RoleManager inicializado');
                console.log('👤 Usuario:', this.userProfile?.email);
                console.log('👑 Rol:', this.userProfile?.role);
                
                return true;
            } else {
                console.warn('⚠️ AuthManager no disponible');
                return false;
            }
        } catch (error) {
            console.error('❌ Error inicializando RoleManager:', error);
            return false;
        }
    }

    // Obtener rol del usuario actual
    getCurrentRole() {
        if (!this.isInitialized || !this.userProfile) {
            return 'comercial'; // Por defecto comercial si no se puede determinar
        }
        return this.userProfile.role || 'comercial';
    }

    // Verificar si el usuario es administrador
    isAdmin() {
        return this.getCurrentRole() === 'admin';
    }

    // Verificar si el usuario es comercial
    isCommercial() {
        return this.getCurrentRole() === 'comercial';
    }

    // Verificar si el usuario puede acceder al panel de administración
    canAccessAdminPanel() {
        return this.isAdmin();
    }

    // Verificar si el usuario puede modificar su rol
    canModifyRole() {
        return this.isAdmin();
    }

    // Verificar si el usuario puede editar productos
    canEditProducts() {
        return this.isAdmin();
    }

    // Verificar si el usuario puede eliminar productos
    canDeleteProducts() {
        return this.isAdmin();
    }

    // Verificar si el usuario puede crear productos
    canCreateProducts() {
        return true; // Tanto admin como comercial pueden crear
    }

    // Verificar si el usuario puede ver productos
    canViewProducts() {
        return true; // Todos pueden ver productos
    }

    // Verificar si el usuario puede acceder a clientes
    canAccessClients() {
        return true; // Todos pueden acceder a clientes
    }

    // Verificar si el usuario puede acceder a gastos
    canAccessExpenses() {
        return true; // Todos pueden acceder a gastos
    }

    // Verificar si el usuario puede editar un gasto específico
    canEditExpense(expenseData) {
        if (this.isAdmin()) {
            return true; // Admin puede editar cualquier gasto
        }
        
        if (this.isCommercial()) {
            // Comercial solo puede editar sus propios gastos
            return expenseData.createdBy === this.currentUser?.uid;
        }
        
        return false;
    }

    // Verificar si el usuario puede eliminar un gasto específico
    canDeleteExpense(expenseData) {
        if (this.isAdmin()) {
            return true; // Admin puede eliminar cualquier gasto
        }
        
        if (this.isCommercial()) {
            // Comercial solo puede eliminar sus propios gastos
            return expenseData.createdBy === this.currentUser?.uid;
        }
        
        return false;
    }

    // Verificar si el usuario puede acceder a ofertas
    canAccessOffers() {
        return true; // Todos pueden acceder a ofertas
    }

    // Verificar si el usuario puede editar una oferta específica
    canEditOffer(offerData) {
        if (this.isAdmin()) {
            return true; // Admin puede editar cualquier oferta
        }
        
        if (this.isCommercial()) {
            // Comercial solo puede editar sus propias ofertas
            return offerData.createdBy === this.currentUser?.uid;
        }
        
        return false;
    }

    // Verificar si el usuario puede eliminar una oferta específica
    canDeleteOffer(offerData) {
        if (this.isAdmin()) {
            return true; // Admin puede eliminar cualquier oferta
        }
        
        if (this.isCommercial()) {
            // Comercial solo puede eliminar sus propias ofertas
            return offerData.createdBy === this.currentUser?.uid;
        }
        
        return false;
    }

    // Verificar si el usuario puede acceder a facturas
    canAccessInvoices() {
        return true; // Todos pueden acceder a facturas
    }

    // Verificar si el usuario puede ver estadísticas
    canViewStatistics() {
        return true; // Todos pueden ver estadísticas
    }

    // Verificar si el usuario puede ver recordatorios de un cliente específico
    canViewClientReminders(clientData) {
        if (this.isAdmin()) {
            return true; // Admin puede ver todos los recordatorios
        }
        
        if (this.isCommercial()) {
            // Comercial puede ver recordatorios de sus propios clientes
            return clientData.assignedTo === this.currentUser?.uid;
        }
        
        return false;
    }

    // Verificar si el usuario puede ver datos de otros comerciales
    canViewOtherCommercialsData() {
        return true; // Todos pueden ver datos de otros comerciales
    }

    // Obtener mensaje de error para operación no permitida
    getAccessDeniedMessage(operation) {
        const role = this.getCurrentRole();
        const messages = {
            'admin_panel': 'No tienes permisos para acceder al panel de administración',
            'edit_product': 'No tienes permisos para editar productos',
            'delete_product': 'No tienes permisos para eliminar productos',
            'edit_expense': 'Solo puedes editar tus propios gastos',
            'delete_expense': 'Solo puedes eliminar tus propios gastos',
            'edit_offer': 'Solo puedes editar tus propias ofertas',
            'delete_offer': 'Solo puedes eliminar tus propias ofertas',
            'modify_role': 'No tienes permisos para modificar roles'
        };
        
        return messages[operation] || 'No tienes permisos para realizar esta operación';
    }

    // Aplicar restricciones de UI basadas en el rol
    applyUIRestrictions() {
        console.log('🎨 Aplicando restricciones de UI para rol:', this.getCurrentRole());
        
        // Ocultar panel de administración para comerciales
        if (!this.canAccessAdminPanel()) {
            this.hideAdminPanel();
        }
        
        // Aplicar restricciones de productos
        this.applyProductRestrictions();
        
        // Aplicar restricciones de gastos
        this.applyExpenseRestrictions();
        
        // Aplicar restricciones de ofertas
        this.applyOfferRestrictions();
    }

    // Ocultar panel de administración
    hideAdminPanel() {
        const adminMenuItems = document.querySelectorAll('[data-role="admin"]');
        adminMenuItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // También ocultar en el menú principal si existe
        const adminMenuItem = document.querySelector('#admin-menu-item, [href*="admin"]');
        if (adminMenuItem) {
            adminMenuItem.style.display = 'none';
        }
        
        console.log('🚫 Panel de administración oculto para rol comercial');
    }

    // Aplicar restricciones de productos
    applyProductRestrictions() {
        // Ocultar botones de editar/eliminar productos para comerciales
        if (!this.canEditProducts()) {
            const editButtons = document.querySelectorAll('[data-action="edit-product"]');
            editButtons.forEach(button => {
                button.style.display = 'none';
            });
        }
        
        if (!this.canDeleteProducts()) {
            const deleteButtons = document.querySelectorAll('[data-action="delete-product"]');
            deleteButtons.forEach(button => {
                button.style.display = 'none';
            });
        }
    }

    // Aplicar restricciones de gastos
    applyExpenseRestrictions() {
        // Los botones de editar/eliminar se mostrarán/ocultarán dinámicamente
        // basándose en el creador del gasto específico
        console.log('💰 Restricciones de gastos aplicadas');
    }

    // Aplicar restricciones de ofertas
    applyOfferRestrictions() {
        // Los botones de editar/eliminar se mostrarán/ocultarán dinámicamente
        // basándose en el creador de la oferta específica
        console.log('📋 Restricciones de ofertas aplicadas');
    }

    // Verificar acceso antes de ejecutar una función
    checkAccess(operation, data = null) {
        let hasAccess = false;
        
        switch (operation) {
            case 'admin_panel':
                hasAccess = this.canAccessAdminPanel();
                break;
            case 'edit_product':
                hasAccess = this.canEditProducts();
                break;
            case 'delete_product':
                hasAccess = this.canDeleteProducts();
                break;
            case 'edit_expense':
                hasAccess = this.canEditExpense(data);
                break;
            case 'delete_expense':
                hasAccess = this.canDeleteExpense(data);
                break;
            case 'edit_offer':
                hasAccess = this.canEditOffer(data);
                break;
            case 'delete_offer':
                hasAccess = this.canDeleteOffer(data);
                break;
            default:
                hasAccess = true;
        }
        
        if (!hasAccess) {
            const message = this.getAccessDeniedMessage(operation);
            alert(message);
            console.warn('🚫 Acceso denegado:', operation, 'para rol:', this.getCurrentRole());
        }
        
        return hasAccess;
    }

    // Actualizar perfil de usuario (cuando cambie el rol)
    async updateUserProfile(newProfile) {
        this.userProfile = newProfile;
        console.log('👤 Perfil de usuario actualizado:', newProfile);
        
        // Reaplicar restricciones de UI
        this.applyUIRestrictions();
    }
}

// Crear instancia global
window.roleManager = new RoleManager();

// Inicializar cuando esté disponible el AuthManager y el usuario
document.addEventListener('DOMContentLoaded', function() {
    const initRoleManager = setInterval(() => {
        if (window.authManager && window.authManager.isInitialized && window.authManager.currentUser) {
            clearInterval(initRoleManager);
            window.roleManager.init().then(() => {
                console.log('✅ RoleManager listo para usar');
                // Aplicar restricciones de UI después de inicializar
                setTimeout(() => {
                    window.roleManager.applyUIRestrictions();
                }, 500);
            });
        }
    }, 1000);
    
    // Timeout después de 15 segundos
    setTimeout(() => {
        clearInterval(initRoleManager);
        if (!window.roleManager.isInitialized) {
            console.warn('⚠️ RoleManager no se pudo inicializar');
        }
    }, 15000);
});

// También escuchar cambios de autenticación
if (window.authManager) {
    window.authManager.auth?.onAuthStateChanged((user) => {
        if (user && window.roleManager && !window.roleManager.isInitialized) {
            window.roleManager.init().then(() => {
                console.log('✅ RoleManager inicializado por cambio de auth');
                setTimeout(() => {
                    window.roleManager.applyUIRestrictions();
                }, 500);
            });
        }
    });
}

console.log('🔐 RoleManager cargado - Sistema de roles y permisos listo');
