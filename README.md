# Expertia CRM

**Sistema de Gestión de Gastos Empresarial - Versión 1.0.0**

[![Expertia CRM](https://img.shields.io/badge/Expertia-CRM-006666?style=for-the-badge&logo=firebase)](https://expertiacrm.com)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-11.7.3-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

## 📋 Descripción

Expertia CRM es una aplicación web moderna para la gestión integral de gastos empresariales. Desarrollada con React, Firebase y tecnologías web estándar, proporciona una solución completa para el control, seguimiento y análisis de gastos corporativos.

## ✨ Características Principales

### 🏢 Gestión de Gastos
- **Registro completo**: Fecha, importe, descripción, categoría, subcategoría
- **Clasificación avanzada**: Categorías y subcategorías configurables
- **Estados de seguimiento**: Pendiente, aprobado, rechazado, pagado
- **Tipos de pago**: Efectivo, transferencia, tarjeta
- **Adjuntos**: Facturas, tickets, recibos

### 📊 Análisis y Reportes
- **Dashboard interactivo**: Gráficos y métricas en tiempo real
- **Informes personalizables**: PDF y Excel
- **Análisis por categoría**: Evolución temporal y comparativas
- **Exportación de datos**: CSV, Excel, PDF

### 🔐 Seguridad y Control
- **Autenticación robusta**: Firebase Auth con roles
- **Validación de datos**: Sanitización y verificación
- **Logging seguro**: Trazabilidad completa
- **Permisos granulares**: Control de acceso por rol

### 🎨 Experiencia de Usuario
- **Interfaz moderna**: Diseño responsive y accesible
- **Notificaciones avanzadas**: Feedback visual mejorado
- **Estados de carga**: Spinners, skeletons y overlays
- **Accesibilidad completa**: Navegación por teclado, screen readers

### ⚡ Rendimiento Optimizado
- **Caché inteligente**: Reducción de llamadas a Firebase
- **Optimización de queries**: Paginación y filtros eficientes
- **Memoización**: Componentes React optimizados
- **Gestión de memoria**: Prevención de memory leaks

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.2.0**: Framework principal
- **JSX**: Sintaxis de componentes
- **CSS3**: Estilos modernos y responsive
- **HTML5**: Semántica web

### Backend y Base de Datos
- **Firebase 11.7.3**: Plataforma completa
- **Firestore**: Base de datos NoSQL
- **Firebase Auth**: Autenticación y autorización
- **Firebase Storage**: Almacenamiento de archivos

### Herramientas de Desarrollo
- **Babel**: Transpilación de JavaScript
- **Recharts**: Gráficos interactivos
- **PropTypes**: Validación de tipos

## 📦 Instalación

### Prerrequisitos
- Node.js 16+ 
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Cuenta de Firebase
- Conexión a internet

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/expertia/expertia-crm.git
   cd expertia-crm
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

4. **Configurar variables de entorno**
   ```bash
   cp firebase-config.example.js firebase-config.js
   # Editar firebase-config.js con tu configuración
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

6. **Desplegar a producción**
   ```bash
   firebase deploy
   ```

## 🏗️ Arquitectura del Sistema

### Capas de la Aplicación

#### 1. **Capa de Presentación**
- **React Components**: Componentes reutilizables
- **JSX Templates**: Sintaxis declarativa
- **CSS Modules**: Estilos encapsulados
- **Responsive Design**: Adaptación móvil

#### 2. **Capa de Lógica de Negocio**
- **Business Functions**: Funciones de gestión de gastos
- **Validation Logic**: Validación de datos
- **State Management**: Gestión de estado
- **Event Handlers**: Manejo de eventos

#### 3. **Capa de Datos**
- **Firebase Integration**: Conexión con Firebase
- **Data Models**: Modelos de datos
- **Caching Layer**: Caché local
- **Error Handling**: Manejo de errores

### Patrones de Diseño

- **MVC (Model-View-Controller)**: Separación de responsabilidades
- **Observer Pattern**: Reactividad con Firebase
- **Factory Pattern**: Creación de componentes
- **Singleton Pattern**: Sistemas globales

## 🔧 Configuración

### Firebase Configuration
```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### Variables de Entorno
```bash
# .env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
```

## 📚 Documentación

### API Reference

#### Funciones de Gastos
```javascript
// Cargar gastos
await loadExpenses()

// Guardar gasto
await saveExpense({
  amount: 100,
  description: "Comida",
  category: "Alimentación",
  date: "2024-01-15"
})

// Eliminar gasto
await deleteExpense(expenseId)
```

#### Sistemas Principales
```javascript
// Notificaciones
NotificationSystem.success('Título', 'Mensaje')

// Loading
LoadingSystem.showOverlay('Cargando...')

// Logging
SecureLogger.success('Operación exitosa')
```

### Estructura de Datos

#### Colección: expenses
```javascript
{
  id: "string",
  date: "2024-01-15",
  amount: 100.50,
  description: "Descripción del gasto",
  category: "Alimentación",
  subcategory: "Comida",
  paymentType: "tarjeta",
  status: "aprobado",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 🧪 Testing

### Framework de Testing
La aplicación incluye un framework de testing personalizado con:

- **Tests Unitarios**: Funciones individuales
- **Tests de Integración**: Flujos completos
- **Tests de UI**: Componentes React
- **Tests de Accesibilidad**: Navegación por teclado

### Ejecutar Tests
```javascript
// Ejecutar todos los tests
TestingFramework.runAllTests()

// Registrar test personalizado
TestingFramework.registerTest(
  'Mi Test',
  async () => {
    // Lógica del test
    return true;
  },
  { category: 'custom', critical: true }
)
```

### Cobertura de Tests
- **Firebase Connection**: ✅
- **Authentication System**: ✅
- **Notification System**: ✅
- **Loading System**: ✅
- **Accessibility System**: ✅
- **Expense Functions**: ✅
- **Configuration System**: ✅
- **Validation System**: ✅
- **Logging System**: ✅
- **Cache System**: ✅
- **Optimization Systems**: ✅

## 🔒 Seguridad

### Medidas de Seguridad Implementadas

1. **Autenticación**
   - Firebase Auth con roles
   - Tokens JWT seguros
   - Sesiones controladas

2. **Validación de Datos**
   - Sanitización de entradas
   - Validación de tipos
   - Prevención de XSS

3. **Logging Seguro**
   - Enmascaramiento de datos sensibles
   - Trazabilidad completa
   - Logs estructurados

4. **Reglas de Firestore**
   - Control de acceso granular
   - Validación de datos
   - Protección contra inyección

## 📊 Rendimiento

### Optimizaciones Implementadas

1. **Caché Local**
   - FirebaseCache para datos frecuentes
   - Reducción de llamadas a Firebase
   - Invalidación inteligente

2. **Optimización de Queries**
   - QueryOptimizer para consultas eficientes
   - Paginación automática
   - Filtros optimizados

3. **React Optimization**
   - ReactOptimizer para memoización
   - Lazy loading de componentes
   - Virtualización de listas

4. **Gestión de Memoria**
   - MemoryManager para prevención de leaks
   - Cleanup automático
   - Optimización de assets

## 🌐 Despliegue

### Entornos

#### Desarrollo
```bash
npm start
# http://localhost:3000
```

#### Producción
```bash
firebase deploy
# https://tu-proyecto.web.app
```

### Monitoreo
- **Firebase Analytics**: Métricas de uso
- **Firebase Performance**: Rendimiento
- **Error Tracking**: Seguimiento de errores
- **Testing Automático**: Validación continua

## 🤝 Contribución

### Guías de Contribución

1. **Fork del repositorio**
2. **Crear rama feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit cambios**: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push a la rama**: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### Estándares de Código

- **ESLint**: Linting de JavaScript
- **Prettier**: Formateo de código
- **JSDoc**: Documentación de funciones
- **Tests**: Cobertura mínima 80%

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Arquitecto de Software**: [Tu Nombre]
- **Diseñador UX/UI**: [Tu Nombre]

## 📞 Soporte

- **Email**: soporte@expertiacrm.com
- **Documentación**: [docs.expertiacrm.com](https://docs.expertiacrm.com)
- **Issues**: [GitHub Issues](https://github.com/expertia/expertia-crm/issues)

## 🗺️ Roadmap

### Versión 1.1.0 (Próxima)
- [ ] Módulo de facturación
- [ ] Integración bancaria
- [ ] Reportes avanzados
- [ ] API REST completa

### Versión 1.2.0 (Futura)
- [ ] Aplicación móvil
- [ ] IA para categorización
- [ ] Integración con contabilidad
- [ ] Múltiples monedas

---

**Expertia CRM** - Transformando la gestión de gastos empresariales

*Desarrollado con ❤️ por el equipo de Expertia*
