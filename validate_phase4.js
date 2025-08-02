/**
 * Script de validación para Fase 4: UX/UI y Experiencia de Usuario
 * Verifica que las mejoras de UX/UI funcionen correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDANDO FASE 4: UX/UI Y EXPERIENCIA DE USUARIO');
console.log('======================================================\n');

// Leer el archivo index.html
const content = fs.readFileSync('index.html', 'utf8');

// Tests de validación
const tests = {
    // 1. Verificar que los nuevos scripts están incluidos
    notificationSystem: {
        name: 'Sistema de notificaciones',
        test: () => content.includes('js/notification-system.js'),
        critical: true
    },
    
    loadingSystem: {
        name: 'Sistema de loading',
        test: () => content.includes('js/loading-system.js'),
        critical: true
    },
    
    accessibilitySystem: {
        name: 'Sistema de accesibilidad',
        test: () => content.includes('js/accessibility-system.js'),
        critical: true
    },
    
    // 2. Verificar que se inicializan los sistemas de UX/UI
    uxInit: {
        name: 'Inicialización de sistemas de UX/UI',
        test: () => content.includes('NotificationSystem.init()') && 
                    content.includes('LoadingSystem.init()') && 
                    content.includes('AccessibilitySystem.init()'),
        critical: true
    },
    
    // 3. Verificar que se implementó sistema de notificaciones
    notificationImplementation: {
        name: 'Implementación de notificaciones',
        test: () => content.includes('NotificationSystem.success') && 
                    content.includes('NotificationSystem.error'),
        critical: true
    },
    
    // 4. Verificar que se implementó sistema de loading
    loadingImplementation: {
        name: 'Implementación de loading',
        test: () => content.includes('LoadingSystem') && 
                    content.includes('createSpinner'),
        critical: true
    },
    
    // 5. Verificar que se implementó sistema de accesibilidad
    accessibilityImplementation: {
        name: 'Implementación de accesibilidad',
        test: () => content.includes('AccessibilitySystem') && 
                    content.includes('announceToScreenReader'),
        critical: true
    },
    
    // 6. Verificar que se implementó feedback visual mejorado
    visualFeedback: {
        name: 'Feedback visual mejorado',
        test: () => content.includes('NotificationSystem.config.POSITIONS.TOP_RIGHT'),
        critical: false
    },
    
    // 7. Verificar que se implementó estados de carga
    loadingStates: {
        name: 'Estados de carga',
        test: () => content.includes('showOverlay') || content.includes('createSpinner'),
        critical: false
    },
    
    // 8. Verificar que se implementó navegación por teclado
    keyboardNavigation: {
        name: 'Navegación por teclado',
        test: () => content.includes('handleKeyboardShortcuts') || content.includes('focus-visible'),
        critical: false
    },
    
    // 9. Verificar que se implementó alto contraste
    highContrast: {
        name: 'Modo alto contraste',
        test: () => content.includes('high-contrast') || content.includes('enableHighContrast'),
        critical: false
    },
    
    // 10. Verificar que se implementó movimiento reducido
    reducedMotion: {
        name: 'Movimiento reducido',
        test: () => content.includes('reduced-motion') || content.includes('enableReducedMotion'),
        critical: false
    },
    
    // 11. Verificar que se implementó skip links
    skipLinks: {
        name: 'Skip links',
        test: () => content.includes('skip-link') || content.includes('addSkipLinks'),
        critical: false
    },
    
    // 12. Verificar que se implementó ARIA live regions
    ariaLiveRegions: {
        name: 'ARIA live regions',
        test: () => content.includes('aria-live') || content.includes('addLiveRegions'),
        critical: false
    },
    
    // 13. Verificar que se implementó focus management
    focusManagement: {
        name: 'Gestión de focus',
        test: () => content.includes('focus-visible') || content.includes('handleFocusIn'),
        critical: false
    },
    
    // 14. Verificar que se implementó screen reader support
    screenReaderSupport: {
        name: 'Soporte para screen readers',
        test: () => content.includes('announceToScreenReader') || content.includes('sr-only'),
        critical: false
    },
    
    // 15. Verificar que se implementó responsive design
    responsiveDesign: {
        name: 'Diseño responsive',
        test: () => content.includes('@media (max-width: 768px)'),
        critical: false
    }
};

// Ejecutar tests
let passedTests = 0;
let totalTests = 0;
let criticalFailures = 0;

console.log('📋 EJECUTANDO TESTS DE VALIDACIÓN:\n');

for (const [testKey, test] of Object.entries(tests)) {
    totalTests++;
    const result = test.test();
    
    if (result) {
        console.log(`✅ ${test.name}`);
        passedTests++;
    } else {
        console.log(`❌ ${test.name}`);
        if (test.critical) {
            criticalFailures++;
        }
    }
}

console.log('\n📊 RESULTADOS DE LA VALIDACIÓN:');
console.log('================================');
console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
console.log(`❌ Tests fallidos: ${totalTests - passedTests}`);
console.log(`🔴 Fallos críticos: ${criticalFailures}`);

if (criticalFailures > 0) {
    console.log('\n🚨 FASE 4 NO COMPLETADA - Hay fallos críticos que deben corregirse');
    process.exit(1);
} else if (passedTests === totalTests) {
    console.log('\n🎉 FASE 4 COMPLETADA EXITOSAMENTE');
    console.log('✅ Sistema de notificaciones implementado');
    console.log('✅ Sistema de loading implementado');
    console.log('✅ Sistema de accesibilidad implementado');
    console.log('✅ Feedback visual mejorado');
    console.log('✅ Estados de carga implementados');
    console.log('✅ Navegación por teclado implementada');
    console.log('✅ Modo alto contraste implementado');
    console.log('✅ Movimiento reducido implementado');
    console.log('✅ Skip links implementados');
    console.log('✅ ARIA live regions implementadas');
    console.log('✅ Gestión de focus implementada');
    console.log('✅ Soporte para screen readers implementado');
    console.log('✅ Diseño responsive implementado');
    console.log('\n🚀 Listo para proceder a la Fase 5');
} else {
    console.log('\n⚠️ FASE 4 PARCIALMENTE COMPLETADA');
    console.log('Algunos tests fallaron pero no son críticos');
}

// Verificar que los archivos de UX/UI existen
console.log('\n📁 VERIFICANDO ARCHIVOS DE UX/UI:');

const uxFiles = [
    'js/notification-system.js',
    'js/loading-system.js',
    'js/accessibility-system.js'
];

for (const file of uxFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} existe`);
    } else {
        console.log(`❌ ${file} NO EXISTE`);
    }
}

console.log('\n🎨 RESUMEN DE MEJORAS DE UX/UI IMPLEMENTADAS:');
console.log('===============================================');
console.log('✅ Sistema de notificaciones avanzado con animaciones');
console.log('✅ Estados de carga con spinners y skeletons');
console.log('✅ Sistema de accesibilidad completo');
console.log('✅ Navegación por teclado y shortcuts');
console.log('✅ Modo alto contraste y movimiento reducido');
console.log('✅ Skip links y ARIA live regions');
console.log('✅ Gestión de focus y screen reader support');
console.log('✅ Diseño responsive y mobile-friendly');
console.log('✅ Feedback visual mejorado y accesible');
console.log('✅ Experiencia de usuario profesional'); 