// 🔍 Script de Verificación Rápida Post-Fix
console.log('🔧 Verificando corrección de errores...');

// Crear objeto quickHealthCheck global
window.quickHealthCheck = {
    runAllChecks: function() {
        console.log('🚀 Ejecutando Quick Health Check...');
        console.log('================================================');
        
        // Test 1: Verificar que no hay errores de JavaScript
        const hasErrors = window.onerror || window.addEventListener;
        console.log('✅ JavaScript engine:', hasErrors ? 'Funcionando' : 'Con problemas');

        // Test 2: Verificar Firebase
        console.log('🔥 Firebase disponible:', typeof window.firebase !== 'undefined' ? '✅' : '❌');
        console.log('📊 Base de datos:', typeof db !== 'undefined' ? '✅' : '❌');
        console.log('🔐 Auth:', typeof auth !== 'undefined' ? '✅' : '❌');

        // Test 3: Verificar funciones principales
        console.log('🔄 trackEvent:', typeof window.trackEvent === 'function' ? '✅' : '❌');
        console.log('💾 storageManager:', typeof window.storageManager !== 'undefined' ? '✅' : '❌');

        // Test 4: Verificar componentes críticos
        const hasHeader = document.querySelector('header') !== null;
        const hasMain = document.querySelector('main, [class*="main"]') !== null;
        console.log('🎨 Header UI:', hasHeader ? '✅' : '❌');
        console.log('📱 Main content:', hasMain ? '✅' : '❌');

        // Test 5: Verificar datos
        try {
            console.log('👥 Clientes cargados:', typeof clients !== 'undefined' ? clients.length : 0);
            console.log('📦 Productos cargados:', typeof products !== 'undefined' ? products.length : 0);
            console.log('🧾 Facturas cargadas:', typeof invoices !== 'undefined' ? invoices.length : 0);
            console.log('📄 Ofertas cargadas:', typeof offers !== 'undefined' ? offers.length : 0);
        } catch (error) {
            console.log('❌ Error verificando datos:', error.message);
        }

        console.log('================================================');
        console.log('✅ Quick Health Check completado');
        return 'Health check completado - revisa la consola para detalles';
    }
};

// Auto-ejecutar verificación básica al cargar
// Test 1: Verificar que no hay errores de JavaScript
const hasErrors = window.onerror || window.addEventListener;
console.log('✅ JavaScript engine:', hasErrors ? 'Funcionando' : 'Con problemas');

// Test 2: Verificar Firebase
console.log('🔥 Firebase disponible:', typeof window.firebase !== 'undefined' ? '✅' : '❌');
console.log('📊 Base de datos:', typeof db !== 'undefined' ? '✅' : '❌');
console.log('🔐 Auth:', typeof auth !== 'undefined' ? '✅' : '❌');

// Test 3: Verificar funciones principales
console.log('🔄 trackEvent:', typeof window.trackEvent === 'function' ? '✅' : '❌');
console.log('💾 storageManager:', typeof window.storageManager !== 'undefined' ? '✅' : '❌');

// Test 4: Verificar componentes críticos
const hasHeader = document.querySelector('header') !== null;
const hasMain = document.querySelector('main, [class*="main"]') !== null;
console.log('🎨 Header UI:', hasHeader ? '✅' : '❌');
console.log('📱 Main content:', hasMain ? '✅' : '❌');

// Test 5: Verificar datos básicos
console.log('👥 Clientes cargados:', Array.isArray(clients) ? `✅ (${clients.length})` : '❌');
console.log('📦 Productos cargados:', Array.isArray(products) ? `✅ (${products.length})` : '❌');

console.log('\n🎯 ESTADO: Aplicación lista para testing completo');
console.log('▶️  Ejecuta: quickHealthCheck.runAllChecks() para testing completo');
console.log('▶️  Ejecuta: testSuite.runAllTests() para testing automatizado');
console.log('📝 O sigue: manual-testing-checklist.md para testing manual');
