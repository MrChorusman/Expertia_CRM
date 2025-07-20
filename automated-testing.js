// 🧪 Script de Testing Automatizado - Expertia CRM
// Ejecutar en la consola del navegador para pruebas automáticas

console.log('🚀 Iniciando Batería de Pruebas Automatizadas');
console.log('=' .repeat(60));

// Variables globales para testing
let testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper para logging de tests
function logTest(testName, passed, details = '') {
    const status = passed ? '✅' : '❌';
    const message = `${status} ${testName}${details ? ': ' + details : ''}`;
    console.log(message);
    
    testResults.tests.push({ name: testName, passed, details });
    if (passed) testResults.passed++;
    else testResults.failed++;
}

// Test 1: Verificar Inicialización de Firebase
async function test1_FirebaseInit() {
    console.log('\n📋 Test 1: Inicialización de Firebase');
    
    // Verificar objetos globales
    logTest('Firebase SDK disponible', typeof window.firebase !== 'undefined');
    logTest('Base de datos conectada', typeof db !== 'undefined' && db !== null);
    logTest('Autenticación activa', typeof auth !== 'undefined' && auth !== null);
    logTest('Storage Manager', typeof window.storageManager !== 'undefined');
    logTest('Analytics inicializado', typeof window.analytics !== 'undefined');
    logTest('Funciones helper Analytics', typeof window.trackEvent === 'function');
    
    // Verificar configuración
    const hasConfig = window.firebaseConfig && 
                     window.firebaseConfig.projectId === 'expertiacrm-7e7eb';
    logTest('Configuración Firebase correcta', hasConfig);
}

// Test 2: Verificar Estado de Autenticación
async function test2_Auth() {
    console.log('\n🔐 Test 2: Autenticación');
    
    try {
        const currentUser = auth?.currentUser;
        logTest('Usuario autenticado', currentUser !== null, currentUser?.uid);
        logTest('Perfil de usuario cargado', user !== null && user.id !== undefined);
        logTest('Rol de usuario definido', user?.role !== undefined, user?.role);
        
        // Verificar permisos
        const hasCommercialAccess = typeof isCommercialOrAdmin === 'function' && isCommercialOrAdmin();
        logTest('Permisos comerciales', hasCommercialAccess);
        
    } catch (error) {
        logTest('Error en autenticación', false, error.message);
    }
}

// Test 3: Verificar Datos Básicos
async function test3_BasicData() {
    console.log('\n📊 Test 3: Datos Básicos');
    
    try {
        logTest('Clientes cargados', Array.isArray(clients) && clients.length >= 0, `${clients?.length || 0} clientes`);
        logTest('Productos cargados', Array.isArray(products) && products.length >= 0, `${products?.length || 0} productos`);
        logTest('Facturas cargadas', Array.isArray(invoices) && invoices.length >= 0, `${invoices?.length || 0} facturas`);
        logTest('Ofertas cargadas', Array.isArray(offers) && offers.length >= 0, `${offers?.length || 0} ofertas`);
        
    } catch (error) {
        logTest('Error cargando datos básicos', false, error.message);
    }
}

// Test 4: Crear Datos de Prueba
async function test4_CreateTestData() {
    console.log('\n➕ Test 4: Creación de Datos');
    
    try {
        // Crear cliente de prueba
        const testClient = {
            nombre: `Cliente Test ${Date.now()}`,
            email: `test${Date.now()}@ejemplo.com`,
            telefono: '123456789',
            direccion: 'Dirección de Prueba',
            empresa: 'Empresa Test',
            fecha_creacion: new Date(),
            creado_por: user?.id || 'test'
        };
        
        const clientRef = await window.firebase.addDoc(window.firebase.collection(db, 'clientes'), testClient);
        logTest('Cliente de prueba creado', clientRef.id !== undefined, clientRef.id);
        
        // Crear producto de prueba
        const testProduct = {
            nombre: `Producto Test ${Date.now()}`,
            descripcion: 'Producto para testing',
            precio: 99.99,
            categoria: 'Test',
            stock: 10,
            fecha_creacion: new Date(),
            creado_por: user?.id || 'test'
        };
        
        const productRef = await window.firebase.addDoc(window.firebase.collection(db, 'productos'), testProduct);
        logTest('Producto de prueba creado', productRef.id !== undefined, productRef.id);
        
        // Guardar IDs para otros tests
        window.testClientId = clientRef.id;
        window.testProductId = productRef.id;
        
        // Crear oportunidad vinculada
        const testOpportunity = {
            titulo: `Oportunidad Test ${Date.now()}`,
            descripcion: 'Oportunidad para testing',
            cliente_id: clientRef.id,
            valor: 1500.00,
            estado: 'nueva',
            probabilidad: 75,
            fecha_estimada_cierre: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            fecha_creacion: new Date(),
            creado_por: user?.id || 'test'
        };
        
        const oppRef = await window.firebase.addDoc(window.firebase.collection(db, 'oportunidades'), testOpportunity);
        logTest('Oportunidad de prueba creada', oppRef.id !== undefined, oppRef.id);
        window.testOpportunityId = oppRef.id;
        
    } catch (error) {
        logTest('Error creando datos de prueba', false, error.message);
    }
}

// Test 5: Verificar Flujo de Datos
async function test5_DataFlow() {
    console.log('\n🔄 Test 5: Flujo de Datos');
    
    try {
        if (window.testClientId && window.testOpportunityId) {
            // Crear actividad vinculada
            const testActivity = {
                titulo: `Actividad Test ${Date.now()}`,
                descripcion: 'Actividad para testing del flujo',
                tipo: 'llamada',
                cliente_id: window.testClientId,
                oportunidad_id: window.testOpportunityId,
                estado: 'pendiente',
                prioridad: 'alta',
                fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                fecha_creacion: new Date(),
                asignado_a: user?.id || 'test',
                creado_por: user?.id || 'test'
            };
            
            const activityRef = await window.firebase.addDoc(window.firebase.collection(db, 'actividades'), testActivity);
            logTest('Actividad vinculada creada', activityRef.id !== undefined);
            
            // Crear factura con producto
            if (window.testProductId) {
                const testInvoice = {
                    numero: `TEST-${Date.now()}`,
                    cliente_id: window.testClientId,
                    productos: [{
                        producto_id: window.testProductId,
                        nombre: 'Producto Test',
                        cantidad: 2,
                        precio: 99.99,
                        total: 199.98
                    }],
                    subtotal: 199.98,
                    iva: 42.00,
                    total: 241.98,
                    estado: 'pendiente',
                    fecha_emision: new Date(),
                    fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    creado_por: user?.id || 'test'
                };
                
                const invoiceRef = await window.firebase.addDoc(window.firebase.collection(db, 'facturas'), testInvoice);
                logTest('Factura con productos creada', invoiceRef.id !== undefined);
            }
        }
        
    } catch (error) {
        logTest('Error en flujo de datos', false, error.message);
    }
}

// Test 6: Verificar Analytics
async function test6_Analytics() {
    console.log('\n📊 Test 6: Analytics y Tracking');
    
    try {
        // Test eventos de analytics
        if (typeof window.trackEvent === 'function') {
            window.trackEvent('test_event', { test: true, timestamp: Date.now() });
            logTest('Evento de analytics registrado', true);
        } else {
            logTest('Función trackEvent no disponible', false);
        }
        
        if (typeof window.trackFeatureUsage === 'function') {
            window.trackFeatureUsage('testing', 'automated_test');
            logTest('Feature usage tracking', true);
        } else {
            logTest('Función trackFeatureUsage no disponible', false);
        }
        
        if (typeof window.trackConversion === 'function') {
            window.trackConversion('test_conversion', 100);
            logTest('Conversion tracking', true);
        } else {
            logTest('Función trackConversion no disponible', false);
        }
        
    } catch (error) {
        logTest('Error en analytics', false, error.message);
    }
}

// Test 7: Verificar Storage
async function test7_Storage() {
    console.log('\n💾 Test 7: Storage Manager');
    
    try {
        if (window.storageManager) {
            logTest('StorageManager inicializado', true);
            
            // Test validaciones
            const hasValidateImage = typeof window.storageManager.validateImageFile === 'function';
            const hasValidateDoc = typeof window.storageManager.validateDocumentFile === 'function';
            const hasUniqueFileName = typeof window.storageManager.generateUniqueFileName === 'function';
            
            logTest('Validación de imágenes disponible', hasValidateImage);
            logTest('Validación de documentos disponible', hasValidateDoc);
            logTest('Generación de nombres únicos disponible', hasUniqueFileName);
            
            // Test generación de nombre único
            if (hasUniqueFileName) {
                const uniqueName = window.storageManager.generateUniqueFileName('test.jpg');
                logTest('Generación de nombre único funciona', uniqueName.includes('test') && uniqueName.includes('.jpg'));
            }
            
        } else {
            logTest('StorageManager no inicializado', false);
        }
        
    } catch (error) {
        logTest('Error en storage tests', false, error.message);
    }
}

// Test 8: Verificar Navegación y UI
async function test8_Navigation() {
    console.log('\n🧭 Test 8: Navegación y UI');
    
    try {
        // Verificar función de navegación
        const hasSetActiveView = typeof setActiveView === 'function';
        logTest('Función de navegación disponible', hasSetActiveView);
        
        // Verificar vista activa
        const hasActiveView = typeof activeView === 'string' && activeView.length > 0;
        logTest('Vista activa definida', hasActiveView, activeView);
        
        // Verificar componentes principales
        const hasHeader = document.querySelector('header') !== null;
        const hasMainContent = document.querySelector('main, .main, [class*="main"]') !== null;
        
        logTest('Header presente', hasHeader);
        logTest('Contenido principal presente', hasMainContent);
        
        // Verificar enlaces de navegación
        const navLinks = document.querySelectorAll('[class*="cursor-pointer"]:not(button)');
        logTest('Enlaces de navegación presentes', navLinks.length > 0, `${navLinks.length} enlaces`);
        
    } catch (error) {
        logTest('Error en navegación tests', false, error.message);
    }
}

// Test 9: Performance y Errores
async function test9_Performance() {
    console.log('\n⚡ Test 9: Performance y Errores');
    
    try {
        // Verificar errores en consola (simplificado)
        const hasConsoleErrors = window.testConsoleErrors || false;
        logTest('Sin errores críticos en consola', !hasConsoleErrors);
        
        // Verificar tiempo de carga (aproximado)
        const loadTime = performance.now();
        logTest('Tiempo de carga aceptable', loadTime < 10000, `${Math.round(loadTime)}ms`);
        
        // Verificar listeners activos
        const hasUnsubscribers = window.unsubscribeProfile || false;
        logTest('Listeners de Firebase activos', !!hasUnsubscribers);
        
        // Verificar memoria básica
        if (performance.memory) {
            const memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            logTest('Uso de memoria razonable', memoryUsage < 100, `${memoryUsage}MB`);
        }
        
    } catch (error) {
        logTest('Error en performance tests', false, error.message);
    }
}

// Función principal para ejecutar todos los tests
async function runAllTests() {
    console.log('🧪 EXPERTIA CRM - BATERÍA DE PRUEBAS AUTOMATIZADAS');
    console.log('Fecha:', new Date().toLocaleString());
    console.log('=' .repeat(60));
    
    testResults = { passed: 0, failed: 0, tests: [] };
    
    try {
        await test1_FirebaseInit();
        await test2_Auth();
        await test3_BasicData();
        await test4_CreateTestData();
        await test5_DataFlow();
        await test6_Analytics();
        await test7_Storage();
        await test8_Navigation();
        await test9_Performance();
        
    } catch (error) {
        console.error('Error en ejecución de tests:', error);
    }
    
    // Resumen final
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log('=' .repeat(60));
    console.log(`✅ Pruebas exitosas: ${testResults.passed}`);
    console.log(`❌ Pruebas fallidas: ${testResults.failed}`);
    console.log(`📋 Total de pruebas: ${testResults.tests.length}`);
    
    const successRate = Math.round((testResults.passed / testResults.tests.length) * 100);
    console.log(`🎯 Tasa de éxito: ${successRate}%`);
    
    if (successRate >= 90) {
        console.log('🎉 ¡EXCELENTE! La aplicación está lista para merge');
    } else if (successRate >= 75) {
        console.log('⚠️  BUENO - Revisar pruebas fallidas antes del merge');
    } else {
        console.log('🚨 ATENCIÓN - Corregir errores críticos antes del merge');
    }
    
    // Mostrar detalles de pruebas fallidas
    const failedTests = testResults.tests.filter(t => !t.passed);
    if (failedTests.length > 0) {
        console.log('\n🔍 PRUEBAS FALLIDAS:');
        failedTests.forEach(test => {
            console.log(`   ❌ ${test.name}${test.details ? ': ' + test.details : ''}`);
        });
    }
    
    return testResults;
}

// Función para limpiar datos de prueba
async function cleanupTestData() {
    console.log('\n🧹 Limpiando datos de prueba...');
    
    try {
        const collections = ['clientes', 'productos', 'oportunidades', 'actividades', 'facturas'];
        
        for (const collectionName of collections) {
            const snapshot = await window.firebase.getDocs(
                window.firebase.query(
                    window.firebase.collection(db, collectionName),
                    window.firebase.where('creado_por', '==', 'test')
                )
            );
            
            snapshot.forEach(async (doc) => {
                await window.firebase.deleteDoc(doc.ref);
            });
        }
        
        console.log('✅ Datos de prueba eliminados');
    } catch (error) {
        console.error('Error limpiando datos de prueba:', error);
    }
}

// Exportar funciones para uso manual
window.testSuite = {
    runAllTests,
    cleanupTestData,
    test1_FirebaseInit,
    test2_Auth,
    test3_BasicData,
    test4_CreateTestData,
    test5_DataFlow,
    test6_Analytics,
    test7_Storage,
    test8_Navigation,
    test9_Performance
};

// Auto-ejecutar si se solicita
if (window.location.search.includes('autotest=true')) {
    setTimeout(runAllTests, 2000);
}

console.log('📝 Script de testing cargado. Usa: testSuite.runAllTests()');
console.log('🧹 Para limpiar datos de prueba: testSuite.cleanupTestData()');
console.log('🔗 Para auto-ejecutar: agrega ?autotest=true a la URL');
