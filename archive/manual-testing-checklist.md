# ✅ Checklist Interactivo de Pruebas - Expertia CRM

## 🎯 **OBJETIVO**: Verificar funcionalidad completa antes del merge

---

## 📋 **INSTRUCCIONES**
1. Abre http://localhost:8080 en tu navegador
2. Abre la consola de desarrollador (F12)
3. Sigue cada paso y marca como completado
4. Anota cualquier problema encontrado

---

## 🧪 **PRUEBAS AUTOMATIZADAS**

### **Paso 1: Ejecutar Script Automatizado**
```javascript
// Ejecuta en la consola del navegador:
testSuite.runAllTests()
```

**Resultado esperado**: Tasa de éxito ≥ 90%
- [ ] ✅ Script ejecutado sin errores
- [ ] ✅ Tasa de éxito ≥ 90%
- [ ] ❌ Problemas encontrados: ________________

---

## 🖱️ **PRUEBAS MANUALES**

### **Test 1: Inicialización** ⏱️ 3 min
- [ ] La aplicación carga sin errores en consola
- [ ] Header aparece con logo de Expertia
- [ ] Navegación principal visible
- [ ] No hay mensajes de error visibles
- [ ] Usuario autenticado automáticamente

**🐛 Problemas**: ________________________________

### **Test 2: Gestión de Clientes** ⏱️ 5 min
**2.1 Crear Cliente**
- [ ] Ir a sección "Clientes"
- [ ] Clic en "Nuevo Cliente"
- [ ] Rellenar formulario completo
- [ ] Guardar cliente
- [ ] Cliente aparece en la lista

**2.2 Editar Cliente**
- [ ] Seleccionar cliente existente
- [ ] Modificar datos
- [ ] Guardar cambios
- [ ] Cambios se reflejan en la lista

**2.3 Validaciones**
- [ ] Intentar guardar sin nombre (debe fallar)
- [ ] Intentar email inválido (debe fallar)
- [ ] Campos requeridos marcados claramente

**🐛 Problemas**: ________________________________

### **Test 3: Gestión de Productos** ⏱️ 5 min
**3.1 Crear Producto**
- [ ] Ir a sección "Productos"
- [ ] Crear nuevo producto
- [ ] Subir imagen (opcional)
- [ ] Establecer precio y stock
- [ ] Guardar producto

**3.2 Gestión de Stock**
- [ ] Verificar stock se muestra correctamente
- [ ] Editar cantidad de stock
- [ ] Cambios persisten

**3.3 Categorías**
- [ ] Crear producto con categoría
- [ ] Filtrar por categoría funciona

**🐛 Problemas**: ________________________________

### **Test 4: Oportunidades** ⏱️ 5 min
**4.1 Crear Oportunidad**
- [ ] Ir a "Oportunidades"
- [ ] Crear nueva oportunidad
- [ ] Vincular a cliente existente
- [ ] Establecer valor y probabilidad
- [ ] Guardar oportunidad

**4.2 Pipeline**
- [ ] Cambiar estado de oportunidad
- [ ] Verificar posición en pipeline
- [ ] Estados se actualizan correctamente

**4.3 Vinculación**
- [ ] Oportunidad aparece vinculada al cliente
- [ ] Datos consistentes entre secciones

**🐛 Problemas**: ________________________________

### **Test 5: Actividades** ⏱️ 4 min
**5.1 Crear Actividad**
- [ ] Ir a "Actividades"
- [ ] Crear nueva actividad
- [ ] Vincular a cliente y oportunidad
- [ ] Establecer fecha de vencimiento
- [ ] Guardar actividad

**5.2 Gestión Estados**
- [ ] Marcar actividad como completada
- [ ] Filtrar por estado
- [ ] Ordenar por fecha

**🐛 Problemas**: ________________________________

### **Test 6: Facturación** ⏱️ 7 min
**6.1 Crear Factura**
- [ ] Ir a "Contabilidad"
- [ ] Crear nueva factura
- [ ] Seleccionar cliente
- [ ] Agregar múltiples productos
- [ ] Verificar cálculos automáticos

**6.2 Funcionalidades**
- [ ] Subtotal calculado correctamente
- [ ] IVA calculado correctamente
- [ ] Total final correcto
- [ ] Guardar factura
- [ ] Generar PDF (si disponible)

**6.3 Estados**
- [ ] Marcar como pagada
- [ ] Estado se actualiza

**🐛 Problemas**: ________________________________

### **Test 7: Ofertas** ⏱️ 5 min
**7.1 Crear Oferta**
- [ ] Crear nueva oferta
- [ ] Vincular a cliente
- [ ] Agregar productos
- [ ] Establecer validez

**7.2 Conversión**
- [ ] Convertir oferta a factura
- [ ] Datos se transfieren correctamente
- [ ] Factura creada automáticamente

**🐛 Problemas**: ________________________________

### **Test 8: Reportes** ⏱️ 3 min
- [ ] Ir a "Reportes"
- [ ] Gráficos cargan con datos
- [ ] Cambiar filtros de fecha
- [ ] Datos se actualizan
- [ ] Estadísticas son consistentes

**🐛 Problemas**: ________________________________

### **Test 9: Admin Panel** ⏱️ 4 min
**9.1 Acceso**
- [ ] Ir a "Admin" (solo si eres admin)
- [ ] Panel carga correctamente

**9.2 Gestión Firebase**
- [ ] Panel Firebase funciona
- [ ] Estadísticas se muestran
- [ ] No hay errores de permisos

**🐛 Problemas**: ________________________________

### **Test 10: Flujo Completo** ⏱️ 8 min
**Escenario**: Cliente → Oportunidad → Actividad → Factura

**10.1 Flujo Lineal**
- [ ] Crear cliente "Test Flujo"
- [ ] Crear oportunidad para ese cliente
- [ ] Crear actividad vinculada
- [ ] Convertir oportunidad en factura
- [ ] Verificar todos los vínculos

**10.2 Navegación Cross-Secciones**
- [ ] Desde cliente, ver sus oportunidades
- [ ] Desde oportunidad, ver actividades
- [ ] Desde actividad, navegar a cliente
- [ ] Búsqueda global encuentra elementos

**🐛 Problemas**: ________________________________

### **Test 11: Storage y Archivos** ⏱️ 5 min
**11.1 Upload de Archivos**
- [ ] Subir imagen a producto
- [ ] Archivo se sube correctamente
- [ ] Imagen se muestra
- [ ] URL de descarga funciona

**11.2 Validaciones**
- [ ] Intentar subir archivo muy grande (debe fallar)
- [ ] Intentar formato no válido (debe fallar)
- [ ] Mensajes de error claros

**🐛 Problemas**: ________________________________

### **Test 12: Performance y UX** ⏱️ 3 min
- [ ] Navegación entre secciones es fluida
- [ ] Cargas de datos < 3 segundos
- [ ] Feedbacks visuales en operaciones
- [ ] Responsive design en móvil
- [ ] Sin errores en consola durante uso

**🐛 Problemas**: ________________________________

---

## 🧹 **LIMPIEZA POST-PRUEBAS**
```javascript
// Ejecuta en consola para limpiar datos de prueba:
testSuite.cleanupTestData()
```

- [ ] Datos de prueba eliminados
- [ ] Base de datos limpia

---

## 📊 **RESUMEN FINAL**

### **Estadísticas**
- **Tiempo total**: _______ minutos
- **Tests automáticos**: ___% éxito
- **Tests manuales completados**: ___/12
- **Problemas críticos**: ___
- **Problemas menores**: ___

### **Decisión de Merge**
- [ ] ✅ **APROBADO PARA MERGE** - Sin problemas críticos
- [ ] ⚠️ **MERGE CON RESERVAS** - Problemas menores documentados
- [ ] ❌ **NO APROBAR MERGE** - Problemas críticos requieren corrección

### **Problemas Críticos Encontrados**
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### **Problemas Menores**
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### **Recomendaciones**
- ________________________________________________
- ________________________________________________
- ________________________________________________

---

**✍️ Tester**: _________________ **📅 Fecha**: _________________
**⏱️ Duración total**: _________ **🎯 Resultado**: _____________
