# 📦 Archive - Archivos No Activos

Este directorio contiene archivos que **NO son parte activa** de la aplicación principal pero se mantienen por valor histórico, testing o herramientas especializadas.

## 📁 Estructura

### 🗂️ `/backups/`
**Respaldos históricos** del archivo principal:
- `index_backup*.html` - Versiones anteriores de la aplicación
- `index_with_duplicate.html` - Versión con componentes duplicados
- `index_before_cleanup.html` - Estado pre-limpieza

### 🧪 `/testing/`
**Scripts de pruebas y depuración**:
- `automated-testing.js` - Suite completa de pruebas automatizadas
- `debug-*.js` - Scripts especializados de depuración
- `test-*.html/.js` - Páginas y scripts de prueba
- `quick-health-check.js` - Diagnósticos rápidos del sistema

### 🔧 `/tools/`
**Herramientas especializadas**:
- `firebase-analyzer.js` - Análisis de configuración Firebase
- `create-activities-system.js` - Sistema de actividades (no implementado)
- `firebase-storage.js` - Gestión de archivos (no integrado)
- `query-*.js` - Scripts de consultas manuales a Firebase
- `*-users.js` - Herramientas de gestión de usuarios

### 📋 `/migrations/`
**Scripts de migración completados**:
- `migrate-config-data.mjs` - Migración de configuración
- `analyze-config-tables.mjs` - Análisis de estructura de datos
- `verify-*.mjs/.js` - Scripts de verificación post-migración

## 🚨 Importante

### ❌ **NO USAR EN PRODUCCIÓN**
Los archivos en este directorio **NO son parte activa** de la aplicación. Son:
- Históricos
- De testing/debugging  
- Herramientas especializadas
- Scripts completados/obsoletos

### 🔄 **Para Usar Herramientas**
Si necesitas usar alguna herramienta:
1. Copia el archivo al directorio principal
2. Úsalo según sea necesario
3. Vuélvelo a mover aquí cuando termines

### 📚 **Para Referencia**
Estos archivos se mantienen para:
- Consulta histórica
- Debugging especializado
- Recuperación de funcionalidad pasada
- Análisis de evolución del proyecto

## 📊 Contenido Total
- **46 archivos** organizados
- **~10MB** de código histórico
- **4 categorías** bien diferenciadas
- **100% funcionalidad** preservada para consulta

---

*Archivado el 24 de julio de 2025*  
*No modificar sin documentar el cambio* 