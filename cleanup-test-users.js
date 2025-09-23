// Script para limpiar usuarios de prueba y liberar límites de Firebase
// Ejecutar en la consola del navegador cuando Firebase bloquee el envío de emails

console.log('🧹 LIMPIEZA DE USUARIOS DE PRUEBA - EXPERTIA CRM');
console.log('===============================================');

async function cleanupTestUsers() {
    try {
        console.log('\n1️⃣ VERIFICANDO ACCESO ADMINISTRATIVO...');
        
        if (!window.authManager) {
            console.log('❌ AuthManager no está disponible');
            return;
        }
        
        const currentUser = window.authManager.getCurrentUser();
        if (!currentUser) {
            console.log('❌ No hay usuario autenticado');
            return;
        }
        
        console.log('✅ Usuario autenticado:', currentUser.email);
        
        // Verificar si es administrador
        const userProfile = await window.authManager.getUserProfile();
        if (!userProfile || userProfile.role !== 'admin') {
            console.log('❌ Solo los administradores pueden limpiar usuarios de prueba');
            return;
        }
        
        console.log('✅ Acceso administrativo confirmado');
        
        console.log('\n2️⃣ OBTENIENDO LISTA DE USUARIOS...');
        
        // Importar Firestore
        const { getFirestore, collection, getDocs, doc, deleteDoc } = 
            await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const db = getFirestore(window.authManager.app);
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        console.log(`📊 Total de usuarios encontrados: ${usersSnapshot.size}`);
        
        // Identificar usuarios de prueba
        const testUsers = [];
        const testEmailPatterns = [
            'test@',
            'prueba@',
            'demo@',
            'example@',
            'temp@',
            'manforespan@gmail.com', // Usuario específico de prueba
            'machimeno@minsait.com' // Usuario específico de prueba
        ];
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const isTestUser = testEmailPatterns.some(pattern => 
                userData.email && userData.email.includes(pattern)
            );
            
            if (isTestUser) {
                testUsers.push({
                    id: doc.id,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt
                });
            }
        });
        
        console.log(`🧪 Usuarios de prueba identificados: ${testUsers.length}`);
        
        if (testUsers.length === 0) {
            console.log('✅ No hay usuarios de prueba para limpiar');
            return;
        }
        
        console.log('\n3️⃣ LISTA DE USUARIOS DE PRUEBA:');
        testUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.createdAt}`);
        });
        
        console.log('\n4️⃣ LIMPIANDO USUARIOS DE PRUEBA...');
        
        let deletedCount = 0;
        for (const user of testUsers) {
            try {
                // Eliminar de Firestore
                await deleteDoc(doc(db, 'users', user.id));
                console.log(`✅ Eliminado de Firestore: ${user.email}`);
                deletedCount++;
            } catch (error) {
                console.error(`❌ Error eliminando ${user.email}:`, error);
            }
        }
        
        console.log(`\n✅ Limpieza completada: ${deletedCount} usuarios eliminados`);
        
        console.log('\n5️⃣ RECOMENDACIONES:');
        console.log('   - Los usuarios eliminados de Firestore seguirán en Firebase Auth');
        console.log('   - Para eliminarlos completamente, ve a Firebase Console → Authentication');
        console.log('   - Espera 1 hora antes de probar nuevos registros');
        console.log('   - Considera usar un proveedor de email personalizado para desarrollo');
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
    }
}

// Función para verificar límites de Firebase
async function checkFirebaseLimits() {
    console.log('\n📊 VERIFICANDO LÍMITES DE FIREBASE...');
    console.log('   - Límite de emails de verificación: ~100 por IP por hora');
    console.log('   - Límite de usuarios nuevos: ~1000 por día');
    console.log('   - Límite de operaciones de Firestore: 50,000 por día');
    console.log('   - Para más información: https://firebase.google.com/docs/auth/limits');
}

// Ejecutar limpieza
cleanupTestUsers();
checkFirebaseLimits();

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Ejecuta este script solo si eres administrador');
console.log('2. Los usuarios de prueba serán eliminados de Firestore');
console.log('3. Para eliminación completa, ve a Firebase Console');
console.log('4. Espera 1 hora antes de probar nuevos registros');
