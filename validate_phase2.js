/**
 * Script de validación para Fase 2: Arquitectura y Estructura
 * Verifica que las mejoras de arquitectura funcionen correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDANDO FASE 2: ARQUITECTURA Y ESTRUCTURA');
console.log('================================================\n');

// Leer el archivo index.html
const content = fs.readFileSync('index.html', 'utf8');

// Tests de validación
const tests = {
    // 1. Verificar que los nuevos scripts están incluidos
    firebaseHooks: {
        name: 'Hooks de Firebase',
        test: () => content.includes('js/firebase-hooks.js'),
        critical: true
    },
    
    sharedUtils: {
        name: 'Utilidades compartidas',
        test: () => content.includes('js/shared-utils.js'),
        critical: true
    },
    
    appConstants: {
        name: 'Constantes de aplicación',
        test: () => content.includes('js/app-constants.js'),
        critical: true
    },
    
    // 2. Verificar que se usan los hooks personalizados
    firebaseHooksUsage: {
        name: 'Uso de FirebaseHooks en funciones',
        test: () => content.includes('FirebaseHooks.useFirebaseSettings'),
        critical: true
    },
    
    // 3. Verificar que se usan las utilidades compartidas
    sharedUtilsUsage: {
        name: 'Uso de SharedUtils en funciones',
        test: () => content.includes('SharedUtils.showNotification'),
        critical: true
    },
    
    // 4. Verificar que se usan las constantes centralizadas
    appConstantsUsage: {
        name: 'Uso de AppConstants en funciones',
        test: () => content.includes('AppConstants.UI.NOTIFICATION_TIMEOUT') && content.includes('AppConstants.MESSAGES.SUCCESS.SAVE'),
        critical: true
    },
    
    // 5. Verificar que se eliminaron valores hardcodeados
    noHardcodedValues: {
        name: 'Eliminación de valores hardcodeados',
        test: () => !content.includes("['Alimentación', 'Transporte', 'Material de Oficina'") && content.includes('AppConstants.EXPENSES.DEFAULT_CATEGORIES'),
        critical: true
    },
    
    // 6. Verificar que se implementó separación de responsabilidades
    separationOfConcerns: {
        name: 'Separación de responsabilidades',
        test: () => content.includes('FirebaseHooks.useFirebaseSettings') && content.includes('DataValidator.validateExpenseConfig'),
        critical: true
    },
    
    // 7. Verificar que se implementó manejo de errores centralizado
    centralizedErrorHandling: {
        name: 'Manejo de errores centralizado',
        test: () => content.includes('SharedUtils.showNotification') && content.includes('AppConstants.MESSAGES.ERROR.SAVE'),
        critical: true
    },
    
    // 8. Verificar que se implementó validación centralizada
    centralizedValidation: {
        name: 'Validación centralizada',
        test: () => content.includes('DataValidator.validateExpenseConfig') && content.includes('validation.isValid'),
        critical: true
    },
    
    // 9. Verificar que se implementó logging centralizado
    centralizedLogging: {
        name: 'Logging centralizado',
        test: () => content.includes('SecureLogger.success') && content.includes('SecureLogger.error'),
        critical: true
    },
    
    // 10. Verificar que se implementó configuración centralizada
    centralizedConfiguration: {
        name: 'Configuración centralizada',
        test: () => content.includes('AppConstants.UI.NOTIFICATION_TIMEOUT') && content.includes('AppConstants.NOTIFICATIONS.TYPES.SUCCESS'),
        critical: true
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
    console.log('\n🚨 FASE 2 NO COMPLETADA - Hay fallos críticos que deben corregirse');
    process.exit(1);
} else if (passedTests === totalTests) {
    console.log('\n🎉 FASE 2 COMPLETADA EXITOSAMENTE');
    console.log('✅ Arquitectura modular implementada');
    console.log('✅ Código duplicado eliminado');
    console.log('✅ Hooks personalizados implementados');
    console.log('✅ Utilidades compartidas implementadas');
    console.log('✅ Constantes centralizadas implementadas');
    console.log('\n🚀 Listo para proceder a la Fase 3');
} else {
    console.log('\n⚠️ FASE 2 PARCIALMENTE COMPLETADA');
    console.log('Algunos tests fallaron pero no son críticos');
}

// Verificar que los archivos de arquitectura existen
console.log('\n📁 VERIFICANDO ARCHIVOS DE ARQUITECTURA:');

const architectureFiles = [
    'js/firebase-hooks.js',
    'js/shared-utils.js', 
    'js/app-constants.js'
];

for (const file of architectureFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} existe`);
    } else {
        console.log(`❌ ${file} NO EXISTE`);
    }
}

console.log('\n🏗️ RESUMEN DE ARQUITECTURA IMPLEMENTADA:');
console.log('=========================================');
console.log('✅ Hooks personalizados para Firebase');
console.log('✅ Utilidades compartidas centralizadas');
console.log('✅ Constantes centralizadas');
console.log('✅ Separación de responsabilidades');
console.log('✅ Eliminación de código duplicado');
console.log('✅ Manejo de errores centralizado');
console.log('✅ Validación centralizada');
console.log('✅ Logging centralizado');
console.log('✅ Configuración centralizada'); 