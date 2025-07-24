# 🧪 Plan de Pruebas Completo - Expertia CRM

## 📋 Batería de Pruebas Pre-Merge

### **Objetivo**: Verificar funcionalidad completa y flujo de datos entre secciones

---

## ✅ Lista de Verificación

### 1. **Inicialización y Autenticación**
- [ ] La aplicación carga correctamente
- [ ] Firebase se inicializa sin errores
- [ ] Autenticación anónima funciona
- [ ] Se crea perfil de usuario automáticamente
- [ ] Analytics registra eventos de inicio

### 2. **Gestión de Clientes**
- [ ] Crear nuevo cliente
- [ ] Editar cliente existente
- [ ] Eliminar cliente
- [ ] Búsqueda de clientes funciona
- [ ] Validación de campos requeridos
- [ ] Datos persisten en Firebase

### 3. **Gestión de Productos**
- [ ] Crear nuevo producto
- [ ] Editar producto existente
- [ ] Eliminar producto
- [ ] Control de stock funciona
- [ ] Categorías funcionan correctamente
- [ ] Datos persisten en Firebase

### 4. **Gestión de Oportunidades**
- [ ] Crear oportunidad vinculada a cliente
- [ ] Cambiar estado de oportunidad
- [ ] Editar valor y detalles
- [ ] Eliminar oportunidad
- [ ] Pipeline visual funciona
- [ ] Datos persisten en Firebase

### 5. **Actividades y Tareas**
- [ ] Crear actividad vinculada a cliente/oportunidad
- [ ] Marcar actividad como completada
- [ ] Editar actividad existente
- [ ] Eliminar actividad
- [ ] Filtros por estado funcionan
- [ ] Datos persisten en Firebase

### 6. **Sistema de Facturación**
- [ ] Crear factura con productos
- [ ] Cálculos automáticos (subtotal, IVA, total)
- [ ] Generar PDF de factura
- [ ] Marcar factura como pagada
- [ ] Historial de facturas
- [ ] Datos persisten en Firebase

### 7. **Gestión de Ofertas**
- [ ] Crear nueva oferta
- [ ] Convertir oferta a factura
- [ ] Editar oferta existente
- [ ] Eliminar oferta
- [ ] Estados de oferta funcionan
- [ ] Datos persisten en Firebase

### 8. **Reportes y Analytics**
- [ ] Dashboard muestra estadísticas correctas
- [ ] Gráficos cargan datos reales
- [ ] Filtros de fecha funcionan
- [ ] Exportar reportes
- [ ] Analytics registra eventos
- [ ] Datos en tiempo real

### 9. **Panel de Administración**
- [ ] Solo admins pueden acceder
- [ ] Gestión de usuarios funciona
- [ ] Configuración de empresa
- [ ] Gestión de Firebase
- [ ] Permisos funcionan correctamente

### 10. **Storage y Archivos**
- [ ] Subir imagen de producto
- [ ] Subir documento adjunto
- [ ] Validación de tipos de archivo
- [ ] Límites de tamaño funcionan
- [ ] Eliminar archivos
- [ ] URLs de descarga válidas

### 11. **Flujo de Datos Entre Secciones**
- [ ] Cliente → Oportunidad → Actividad
- [ ] Oportunidad → Factura
- [ ] Oferta → Factura
- [ ] Producto → Factura (líneas)
- [ ] Actividades vinculadas a clientes
- [ ] Búsquedas cross-secciones

### 12. **Performance y UX**
- [ ] Carga inicial < 3 segundos
- [ ] Navegación fluida entre secciones
- [ ] Responsive design funciona
- [ ] No hay errores en consola
- [ ] Feedback visual adecuado
- [ ] Estados de carga visibles

### 13. **Seguridad y Validaciones**
- [ ] Validación de campos obligatorios
- [ ] Prevención de datos inválidos
- [ ] Roles y permisos funcionan
- [ ] No hay inyección de código
- [ ] Datos sensibles protegidos

### 14. **Integración Firebase**
- [ ] Firestore reglas funcionan
- [ ] Storage reglas funcionan
- [ ] Analytics registra eventos
- [ ] Tiempo real funciona
- [ ] Backup automático configurado

---

## 🔧 Scripts de Testing Automatizado

### Script 1: Test de Conexión Firebase
```javascript
// Ejecutar en consola del navegador
console.log('🔥 Testing Firebase Connection...');
console.log('DB:', typeof db !== 'undefined' ? '✅' : '❌');
console.log('Auth:', typeof auth !== 'undefined' ? '✅' : '❌');
console.log('Storage:', typeof window.storageManager !== 'undefined' ? '✅' : '❌');
console.log('Analytics:', typeof window.analytics !== 'undefined' ? '✅' : '❌');
```

### Script 2: Test de Datos de Ejemplo
```javascript
// Crear datos de prueba
async function crearDatosPrueba() {
    try {
        // Cliente de prueba
        const cliente = await addDoc(collection(db, 'clientes'), {
            nombre: 'Cliente Test',
            email: 'test@ejemplo.com',
            telefono: '123456789',
            direccion: 'Dirección Test',
            fecha_creacion: new Date()
        });
        console.log('✅ Cliente creado:', cliente.id);
        
        // Producto de prueba
        const producto = await addDoc(collection(db, 'productos'), {
            nombre: 'Producto Test',
            precio: 99.99,
            categoria: 'Test',
            stock: 10,
            fecha_creacion: new Date()
        });
        console.log('✅ Producto creado:', producto.id);
        
        return { clienteId: cliente.id, productoId: producto.id };
    } catch (error) {
        console.error('❌ Error creando datos:', error);
    }
}
```

### Script 3: Test de Flujo Completo
```javascript
// Test del flujo completo Cliente → Oportunidad → Factura
async function testFlujoCompleto() {
    const datos = await crearDatosPrueba();
    
    if (datos) {
        // Crear oportunidad
        const oportunidad = await addDoc(collection(db, 'oportunidades'), {
            titulo: 'Oportunidad Test',
            cliente_id: datos.clienteId,
            valor: 1000,
            estado: 'nueva',
            fecha_creacion: new Date()
        });
        console.log('✅ Oportunidad creada:', oportunidad.id);
        
        // Crear factura
        const factura = await addDoc(collection(db, 'facturas'), {
            numero: 'TEST-001',
            cliente_id: datos.clienteId,
            productos: [{
                producto_id: datos.productoId,
                cantidad: 2,
                precio: 99.99
            }],
            subtotal: 199.98,
            iva: 42.00,
            total: 241.98,
            fecha_emision: new Date()
        });
        console.log('✅ Factura creada:', factura.id);
        
        console.log('🎉 Flujo completo exitoso!');
    }
}
```

---

## 📝 Checklist Manual de Testing

### Paso 1: Inicialización
1. Abrir http://localhost:8080
2. Verificar que no hay errores en consola
3. Verificar que aparece "Expertia CRM" correctamente
4. Verificar navegación del header

### Paso 2: Sección Clientes
1. Ir a "Clientes"
2. Crear nuevo cliente con datos completos
3. Verificar que aparece en la lista
4. Editar el cliente creado
5. Verificar cambios se guardan
6. Intentar crear cliente sin campos requeridos

### Paso 3: Sección Productos
1. Ir a "Productos"
2. Crear nuevo producto con imagen
3. Verificar cálculos de stock
4. Editar producto existente
5. Probar diferentes categorías

### Paso 4: Sección Oportunidades
1. Ir a "Oportunidades"
2. Crear oportunidad vinculada a cliente
3. Cambiar estado paso a paso
4. Verificar pipeline visual
5. Editar valor y ver actualización

### Paso 5: Sección Actividades
1. Ir a "Actividades"
2. Crear actividad vinculada
3. Marcar como completada
4. Probar filtros
5. Verificar fechas de vencimiento

### Paso 6: Contabilidad
1. Ir a "Contabilidad"
2. Crear factura con múltiples productos
3. Verificar cálculos automáticos
4. Generar PDF
5. Marcar como pagada

### Paso 7: Ofertas
1. Crear nueva oferta
2. Convertir a factura
3. Verificar datos se transfieren
4. Editar oferta existente

### Paso 8: Reportes
1. Verificar gráficos cargan
2. Cambiar filtros de fecha
3. Exportar reporte
4. Verificar datos son correctos

### Paso 9: Admin Panel
1. Acceder como admin
2. Gestionar usuarios
3. Configurar empresa
4. Verificar Firebase panel

### Paso 10: Cross-Testing
1. Crear cliente → oportunidad → actividad
2. Convertir oportunidad → factura
3. Verificar datos relacionados
4. Probar búsquedas globales

---

## 🚨 Casos de Error a Probar

1. **Conexión Firebase fallida**
2. **Datos inválidos en formularios**
3. **Permisos insuficientes**
4. **Archivos demasiado grandes**
5. **Eliminación de elementos con dependencias**
6. **Estados inconsistentes**
7. **Navegación directa a URLs**

---

## 📊 Métricas de Éxito

- **✅ 90%+ funcionalidades operativas**
- **✅ 0 errores críticos en consola**
- **✅ Datos persisten correctamente**
- **✅ Flujos principales funcionan**
- **✅ Performance aceptable**
- **✅ UX intuitiva**

---

**Tiempo estimado de testing**: 45-60 minutos
**Prerequisito**: Servidor funcionando en localhost:8080
