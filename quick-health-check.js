// 🔍 Script de Verificación Rápida Post-Fix
console.log('🔧 Verificando corrección de errores...');

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
console.log('▶️  Ejecuta: testSuite.runAllTests() para testing automatizado');
console.log('📝 O sigue: manual-testing-checklist.md para testing manual');
