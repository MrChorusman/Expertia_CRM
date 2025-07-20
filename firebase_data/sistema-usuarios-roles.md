# Sistema de Usuarios y Roles - Expertia CRM

## Arquitectura de Roles

### Roles Disponibles

#### 🔧 Admin (Administrador)
**Permisos completos:**
- ✅ Gestión de usuarios (crear, editar, eliminar)
- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión de clientes (CRUD + recordatorios)
- ✅ Gestión de facturas y ofertas (CRUD)
- ✅ Acceso a panel de administración
- ✅ Acceso a todos los informes
- ✅ Configuración del sistema

#### 👔 Comercial
**Permisos limitados:**
- ✅ Gestión de clientes (CRUD + recordatorios)
- ✅ Gestión de facturas y ofertas (CRUD)
- ✅ Vista de productos (solo lectura)
- ✅ Informes de ventas
- ❌ No puede gestionar productos
- ❌ No puede gestionar usuarios
- ❌ No accede al panel de administración

## Implementación Técnica

### Base de Datos
```javascript
// Estructura del usuario en Firestore
users/{userId} = {
  email: "usuario@expertia.com",
  name: "Nombre Usuario",
  role: "admin" | "comercial",
  createdAt: "2025-07-20T15:00:00.000Z",
  updatedAt: "2025-07-20T15:00:00.000Z",
  photoURL: "https://...", // Opcional
  phone: "+34 XXX XXX XXX" // Opcional
}
```

### Frontend - Verificación de Permisos
```javascript
// Funciones de verificación
const isAdmin = () => userProfile?.role === 'admin';
const isCommercialOrAdmin = () => 
  userProfile?.role === 'admin' || userProfile?.role === 'comercial';

// Uso en componentes
{isAdmin() && (
  <AdminPanel />
)}

{!isCommercialOrAdmin() && (
  <AccessDenied />
)}
```

### Firestore Rules - Seguridad del Backend
```javascript
// Funciones en las reglas
function isAdmin() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

function isCommercialOrAdmin() {
  let userRole = get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
  return userRole == 'admin' || userRole == 'comercial';
}

// Aplicación en colecciones
match /productos/{productoId} {
  allow read: if isCommercialOrAdmin();
  allow write: if isAdmin(); // Solo admins pueden modificar
}
```

## Flujo de Autenticación

### 1. Inicio de Sesión
- Usuario accede a la aplicación
- Firebase Auth verifica credenciales
- Sistema carga perfil de usuario desde Firestore
- UI se adapta según el rol del usuario

### 2. Verificación de Permisos
- Cada acción verifica permisos en frontend
- Firestore Rules valida permisos en backend
- Doble validación para máxima seguridad

### 3. Fallback y Modo Demo
- Si no hay Firebase configurado → Modo demo con rol admin
- Si hay errores de conexión → Mantiene último rol conocido
- Manejo de errores transparente para el usuario

## Gestión de Usuarios (Solo Admins)

### Crear Usuario
1. Admin accede al panel de administración
2. Completa formulario de nuevo usuario
3. Sistema asigna rol (comercial por defecto)
4. Usuario recibe credenciales de acceso

### Modificar Roles
1. Admin ve lista de usuarios
2. Edita perfil de usuario
3. Cambia rol según necesidades
4. Cambios aplicados inmediatamente

### Auditoría
- Todos los cambios registran `createdBy` y `updatedBy`
- Timestamps automáticos en todas las operaciones
- Trazabilidad completa de modificaciones

## Casos de Uso

### Escenario 1: Empresa Pequeña
- 1 Admin (dueño/gerente)
- 2-3 Comerciales
- Admin gestiona productos y configuración
- Comerciales se enfocan en ventas

### Escenario 2: Empresa Mediana
- 2-3 Admins (gerentes de área)
- 5-10 Comerciales
- Admins rotan responsabilidades
- Comerciales especializados por zona/producto

### Escenario 3: Distribución
- 1 Admin principal (configuración)
- Múltiples comerciales (vendedores)
- Admin controla catálogo y precios
- Comerciales gestionan sus clientes

## Seguridad

### Principios
- **Principio de menor privilegio**: Usuarios solo tienen permisos necesarios
- **Defensa en profundidad**: Validación en frontend y backend
- **Auditoría completa**: Trazabilidad de todas las acciones

### Validaciones
- Frontend: UI adaptable y validación inmediata
- Backend: Firestore Rules como última línea de defensa
- Autenticación: Firebase Auth maneja sesiones y tokens

### Recomendaciones
- Revisar permisos periódicamente
- Auditar actividad de usuarios admins
- Cambiar credenciales regularmente
- Usar autenticación de dos factores (cuando esté disponible)
