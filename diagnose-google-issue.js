// Script de diagnóstico temporal para el problema de Google Auth
// Ejecutar en la consola del navegador

console.log('🔍 SCRIPT DE DIAGNÓSTICO PARA GOOGLE AUTH');
console.log('==========================================');

async function diagnoseGoogleIssue() {
    console.log('\n1️⃣ VERIFICANDO ESTADO GENERAL...');
    
    if (window.authManager) {
        console.log('✅ AuthManager disponible');
        const diagnosis = await window.authManager.diagnoseGoogleAuth();
        console.log('📊 Resultado del diagnóstico:', diagnosis);
    } else {
        console.log('❌ AuthManager no disponible');
        return;
    }
    
    console.log('\n2️⃣ VERIFICANDO CONFIGURACIÓN DE FIREBASE...');
    
    if (window.__firebase_config) {
        const config = JSON.parse(window.__firebase_config);
        console.log('✅ Configuración Firebase disponible');
        console.log('📋 Project ID:', config.projectId);
        console.log('📋 Auth Domain:', config.authDomain);
        console.log('📋 API Key existe:', !!config.apiKey);
    } else {
        console.log('❌ Configuración Firebase no disponible');
    }
    
    console.log('\n3️⃣ VERIFICANDO DOMINIO Y CORS...');
    console.log('📋 Current URL:', window.location.href);
    console.log('📋 Origin:', window.location.origin);
    console.log('📋 Hostname:', window.location.hostname);
    
    // Verificar si estamos en localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('⚠️ Ejecutándose en localhost - esto puede causar problemas de CORS');
        console.log('💡 Recomendación: Verificar configuración de dominios autorizados en Firebase Console');
    }
    
    console.log('\n4️⃣ TESTEO DE FUNCIÓN DE GOOGLE AUTH...');
    console.log('🧪 Preparando test de autenticación...');
    
    // Función de test que no ejecuta el popup real
    window.testGoogleAuthDry = async function() {
        try {
            console.log('🔄 Simulando configuración de Google Auth...');
            
            // Verificar imports
            const { GoogleAuthProvider } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            console.log('✅ Import de GoogleAuthProvider exitoso');
            
            // Crear provider de prueba
            const testProvider = new GoogleAuthProvider();
            testProvider.addScope('email');
            testProvider.addScope('profile');
            
            console.log('✅ Provider de prueba creado');
            console.log('📋 Scopes del provider de prueba:', testProvider.scopes);
            
            return true;
            
        } catch (error) {
            console.error('❌ Error en test dry run:', error);
            return false;
        }
    };
    
    const dryRunResult = await window.testGoogleAuthDry();
    console.log('📊 Resultado del dry run:', dryRunResult ? 'ÉXITO' : 'FALLO');
    
    console.log('\n5️⃣ RECOMENDACIONES...');
    
    if (window.location.hostname === 'localhost') {
        console.log('🔧 RECOMENDACIONES PARA LOCALHOST:');
        console.log('  1. Verificar que localhost esté en dominios autorizados de Firebase');
        console.log('  2. Asegurarse de que el puerto esté correcto');
        console.log('  3. Considerar usar una URL de desarrollo diferente');
    }
    
    console.log('🔧 PASOS DE DEBUGGING:');
    console.log('  1. Ejecutar: window.authManager.diagnoseGoogleAuth()');
    console.log('  2. Verificar Firebase Console > Authentication > Settings > Authorized domains');
    console.log('  3. Revisar Network tab para errores específicos');
    console.log('  4. Intentar login y revisar logs detallados');
    
    console.log('\n✅ DIAGNÓSTICO COMPLETADO');
}

// Ejecutar diagnóstico
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', diagnoseGoogleIssue);
} else {
    diagnoseGoogleIssue();
}

console.log('\n💡 Para ejecutar diagnóstico manual: diagnoseGoogleIssue()');
