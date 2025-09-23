// Script de diagnóstico para problemas de verificación de email
// Ejecutar en la consola del navegador para diagnosticar problemas

console.log('🔍 DIAGNÓSTICO DE VERIFICACIÓN DE EMAIL - EXPERTIA CRM');
console.log('====================================================');

// Función para diagnosticar la configuración de Firebase
async function diagnoseEmailVerification() {
    try {
        console.log('\n1️⃣ VERIFICANDO CONFIGURACIÓN DE FIREBASE...');
        
        // Verificar configuración
        const config = window.__firebase_config ? JSON.parse(window.__firebase_config) : null;
        if (config) {
            console.log('✅ Configuración Firebase encontrada:');
            console.log('   - Project ID:', config.projectId);
            console.log('   - Auth Domain:', config.authDomain);
            console.log('   - API Key:', config.apiKey ? 'Configurada' : 'No configurada');
        } else {
            console.log('❌ No se encontró configuración de Firebase');
            return;
        }
        
        console.log('\n2️⃣ VERIFICANDO ESTADO DE AUTENTICACIÓN...');
        
        if (!window.authManager) {
            console.log('❌ AuthManager no está disponible');
            return;
        }
        
        const currentUser = window.authManager.getCurrentUser();
        if (!currentUser) {
            console.log('❌ No hay usuario autenticado');
            return;
        }
        
        console.log('✅ Usuario autenticado encontrado:');
        console.log('   - Email:', currentUser.email);
        console.log('   - UID:', currentUser.uid);
        console.log('   - Email verificado:', currentUser.emailVerified);
        console.log('   - Proveedor:', currentUser.providerData[0]?.providerId);
        
        console.log('\n3️⃣ VERIFICANDO CONFIGURACIÓN DE DOMINIOS...');
        
        // Verificar URL actual
        console.log('   - URL actual:', window.location.href);
        console.log('   - Origen:', window.location.origin);
        console.log('   - Hostname:', window.location.hostname);
        
        console.log('\n4️⃣ PROBANDO ENVÍO DE EMAIL DE VERIFICACIÓN...');
        
        try {
            // Configurar actionCodeSettings
            const actionCodeSettings = {
                url: window.location.origin + '/index.html?verified=true',
                handleCodeInApp: false,
            };
            
            console.log('   - Configuración de email:', actionCodeSettings);
            
            // Importar función de Firebase
            const { sendEmailVerification } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            // Enviar email de verificación
            await sendEmailVerification(currentUser, actionCodeSettings);
            console.log('✅ Email de verificación enviado exitosamente');
            
            // Verificar estado después del envío
            await currentUser.reload();
            console.log('   - Estado después del envío:', currentUser.emailVerified);
            
            if (currentUser.emailVerified) {
                console.log('🚨 PROBLEMA CRÍTICO: Usuario marcado como verificado sin haber verificado el email');
            } else {
                console.log('✅ Estado correcto: Usuario sigue sin verificar');
            }
            
        } catch (emailError) {
            console.error('❌ Error enviando email de verificación:', emailError);
            console.error('   - Código:', emailError.code);
            console.error('   - Mensaje:', emailError.message);
        }
        
        console.log('\n5️⃣ VERIFICANDO CONFIGURACIÓN DE FIREBASE CONSOLE...');
        console.log('   - Ve a Firebase Console → Authentication → Settings');
        console.log('   - Verifica que "Email/Password" esté habilitado');
        console.log('   - Verifica que los dominios autorizados incluyan:');
        console.log('     * localhost');
        console.log('     * expertiacrm-7e7eb.firebaseapp.com');
        console.log('     * expertiacrm-7e7eb.web.app');
        
        console.log('\n6️⃣ RECOMENDACIONES...');
        console.log('   - Si el email no llega, verifica la carpeta de spam');
        console.log('   - Prueba con diferentes proveedores de email (Gmail, Outlook, etc.)');
        console.log('   - Verifica que no hay límites de envío alcanzados en Firebase');
        console.log('   - Considera usar un proveedor de email personalizado');
        
    } catch (error) {
        console.error('❌ Error durante el diagnóstico:', error);
    }
}

// Ejecutar diagnóstico
diagnoseEmailVerification();

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Ejecuta este script en la consola del navegador');
console.log('2. Revisa los resultados del diagnóstico');
console.log('3. Si hay problemas, contacta al administrador');
console.log('4. Para probar el envío, usa: diagnoseEmailVerification()');
