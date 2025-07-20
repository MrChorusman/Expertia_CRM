🧪 EXPERTIA CRM - TESTING SUITE
==============================

## 🚀 INICIO RÁPIDO

### 1. **Automated Tests** (2 minutos)
Abre http://localhost:8080, luego en consola:
```javascript
testSuite.runAllTests()
```

### 2. **Manual Testing** (30-45 minutos)
Sigue: `manual-testing-checklist.md`

### 3. **Cleanup** 
```javascript
testSuite.cleanupTestData()
```

## 📋 ARCHIVOS DE TESTING CREADOS

- `testing-plan.md` - Plan completo de pruebas
- `automated-testing.js` - Scripts automáticos  
- `manual-testing-checklist.md` - Checklist paso a paso
- `quick-start-testing.md` - Este archivo

## 🎯 OBJETIVO

Verificar que TODA la funcionalidad funciona correctamente antes del merge:

✅ Firebase (Firestore, Storage, Analytics)
✅ CRUD completo (Clientes, Productos, Oportunidades, Actividades)
✅ Sistema de facturación y ofertas
✅ Flujos de datos entre secciones
✅ UI/UX y performance
✅ Seguridad y validaciones

## ⚡ CRITERIOS DE APROBACIÓN

- **Tests automáticos**: ≥90% éxito
- **Tests manuales**: 11/12 secciones OK
- **Problemas críticos**: 0
- **Performance**: Carga < 3seg

## 🏁 RESULTADO ESPERADO

✅ **MERGE APPROVED** - Sistema listo para producción
