const admin = require('firebase-admin');

async function initializeFirebase() {
    try {
        const serviceAccount = require('./serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('✅ Firebase Admin SDK inicializado correctamente');
        console.log(`🔍 Project ID: ${serviceAccount.project_id}`);
        return admin.firestore();
    } catch (error) {
        console.error('❌ Error al inicializar Firebase Admin:', error.message);
        process.exit(1);
    }
}

async function verifyAndDeleteUsers() {
    console.log('🔍 Verificando usuarios en la base de datos...\n');
    
    try {
        const db = await initializeFirebase();
        
        // Intentar múltiples veces hasta que no queden usuarios
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
            attempts++;
            console.log(`\n--- Intento ${attempts} ---`);
            
            const usersRef = db.collection('users');
            const snapshot = await usersRef.get();
            
            if (snapshot.empty) {
                console.log('✅ ¡Perfecto! No hay usuarios en la base de datos.');
                console.log('🎯 El próximo usuario registrado será automáticamente ADMINISTRADOR');
                break;
            }
            
            console.log(`📊 Encontrados ${snapshot.size} usuarios:`);
            
            // Mostrar detalles de cada usuario
            snapshot.forEach((doc, index) => {
                const userData = doc.data();
                console.log(`   ${index + 1}. ID: ${doc.id}`);
                console.log(`      Nombre: ${userData.name || 'Sin nombre'}`);
                console.log(`      Email: ${userData.email || 'Sin email'}`);
                console.log(`      Rol: ${userData.role || 'Sin rol'}`);
                console.log(`      Activo: ${userData.isActive || 'No definido'}`);
                console.log(`      Creado: ${userData.createdAt || 'No definido'}`);
                console.log('');
            });
            
            console.log('🗑️ Eliminando usuarios...');
            
            // Eliminar uno por uno para mayor control
            for (const doc of snapshot.docs) {
                try {
                    await doc.ref.delete();
                    console.log(`   ✅ Usuario eliminado: ${doc.id}`);
                } catch (error) {
                    console.log(`   ❌ Error eliminando ${doc.id}:`, error.message);
                }
            }
            
            // Esperar un momento para que se sincronice
            console.log('⏳ Esperando sincronización...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        if (attempts >= maxAttempts) {
            console.log('\n⚠️ Se alcanzó el máximo de intentos. Puede haber un problema de sincronización.');
            console.log('💡 Intenta ejecutar el script nuevamente en unos minutos.');
        }
        
    } catch (error) {
        console.error('❌ Error durante la verificación:', error);
    } finally {
        process.exit(0);
    }
}

// Ejecutar
verifyAndDeleteUsers().catch(console.error);
