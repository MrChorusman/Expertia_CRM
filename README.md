# Expertia CRM 🏥

Sistema de gestión de relaciones con clientes (CRM) especializado para el sector médico, desarrollado para Expertia Medical Solutions.

## 🚀 Características Principales

### 🏢 Gestión de Clientes
- Dashboard completo de clientes médicos
- Seguimiento del funnel de ventas
- Gestión de contactos y comunicaciones
- Consentimientos RGPD integrados

### 💰 Gestión Financiera
- Facturación electrónica
- Facturas proforma
- Control de pagos y vencimientos
- Informes financieros

### 📊 Ofertas Comerciales
- Creación de ofertas personalizadas
- Seguimiento de propuestas
- Conversión a facturas

### 👥 Sistema de Roles
- **Administrador**: Acceso completo + gestión de productos y usuarios
- **Comercial**: Gestión de clientes, ofertas y facturación

### 🔧 Panel de Administración
- Gestión completa del catálogo de productos
- Control de usuarios y permisos
- Configuración del sistema

## 🛠️ Tecnologías

- **Frontend**: React 18 + Tailwind CSS
- **Desktop**: Electron
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Gráficos**: Recharts

## 📦 Estructura del Proyecto

```
expertia-crm/
├── index.html              # Aplicación principal (SPA)
├── main.js                 # Configuración Electron
├── package.json            # Dependencias y scripts
├── firebase-config.js      # Configuración Firebase (template)
├── firestore.rules        # Reglas de seguridad Firestore
├── docs/                  # Documentación técnica
└── data/                  # Assets y recursos
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/MrChorusman/Expertia_CRM.git
cd Expertia_CRM
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Firestore Database y Authentication
3. Copiar la configuración y actualizar `firebase-config.js`:

```javascript
const __firebase_config = JSON.stringify({
    apiKey: "tu-api-key",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "tu-app-id"
});
```

### 4. Configurar reglas de Firestore
Aplicar las reglas desde `firestore.rules` en la consola de Firebase.

### 5. Ejecutar la aplicación
```bash
npm start
```

## 📋 Base de Datos

### Colecciones Firestore:
- `users` - Perfiles de usuario con roles
- `clientes` - Información de clientes médicos
- `productos` - Catálogo de productos médicos
- `facturas` - Facturas y proformas
- `ofertas` - Ofertas comerciales
- `counters` - Contadores para numeración automática

### Roles de Usuario:
- `admin` - Acceso completo al sistema
- `comercial` - Acceso a funciones comerciales

## 🔐 Seguridad

- Autenticación Firebase integrada
- Control de roles granular
- Reglas de seguridad Firestore
- Validación de permisos en frontend

## 📱 Características Técnicas

- **Responsive Design**: Compatible con diferentes tamaños de pantalla
- **Modo Demo**: Funciona sin conexión para desarrollo
- **Control de Errores**: Manejo robusto de errores de conexión
- **Tiempo Real**: Sincronización automática con Firestore
- **Optimización**: Lazy loading y componentes optimizados

## 🚦 Scripts Disponibles

```bash
npm start          # Ejecutar en modo desarrollo
npm run build      # Construir para producción (si aplica)
npm test           # Ejecutar tests (si aplica)
```

## 📖 Documentación

Consulta la carpeta `docs/` para documentación técnica detallada:
- Configuración Firebase
- Estructura de datos
- Sistema de usuarios y roles
- Guías de implementación

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Expertia Medical Solutions. Todos los derechos reservados.

## 📞 Contacto

**Expertia Medical Solutions**
- 🌐 Web: [expertia.com](https://expertia.com)
- 📧 Email: info@expertia.com

---

Desarrollado con ❤️ para el sector médico español
