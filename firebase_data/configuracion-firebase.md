# Configuración de Firebase para Expertia CRM

## Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre: `expertia-crm` (o el que prefieras)
4. Habilita Google Analytics (opcional)

### 2. Configurar Authentication
1. En el panel izquierdo, ve a "Authentication"
2. Haz clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Anónimo" para el modo demo

### 3. Configurar Firestore Database
1. En el panel izquierdo, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (cambiaremos las reglas después)
4. Elige la ubicación más cercana a tus usuarios

### 4. Obtener configuración del proyecto
1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. Scroll hacia abajo hasta "Tus aplicaciones"
3. Haz clic en "Agregar aplicación" → "Web" (ícono </>) 
4. Registra la aplicación con el nombre "Expertia CRM"
5. Copia la configuración `firebaseConfig`

### 5. Configurar reglas de Firestore
1. Ve a "Firestore Database" → "Reglas"
2. Copia y pega el contenido del archivo `firestore.rules`
3. Haz clic en "Publicar"

### 6. Actualizar firebase-config.js
Reemplaza los placeholders en `firebase-config.js` con tus valores reales.

## Estructura de la base de datos

### Colecciones principales:
- `users/` - Perfiles de usuario con roles
- `clientes/` - Información de clientes
  - `clientes/{id}/recordatorios/` - Recordatorios por cliente
- `productos/` - Catálogo de productos
- `facturas/` - Facturas y proformas
  - `facturas/{id}/payments/` - Pagos por factura
- `ofertas/` - Ofertas comerciales
- `counters/` - Contadores para numeración secuencial

### Roles de usuario:
- `admin` - Acceso completo
- `comercial` - Acceso a clientes, facturas y ofertas (lectura de productos)

## Seguridad
- Todas las operaciones requieren autenticación
- Los roles se verifican en cada operación
- Los recordatorios solo son accesibles por comerciales y admins
- Los productos solo pueden ser modificados por admins
