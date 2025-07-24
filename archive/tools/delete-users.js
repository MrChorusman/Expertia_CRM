const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
// IMPORTANTE: Necesitas tener el archivo de credenciales o usar las variables de entorno
async function initializeFirebase() {
    try {
        // Opción 1: Si tienes un archivo de credenciales JSON
        const serviceAccount = require('./serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        // Opción 2: Usar credenciales por defecto (si estás autenticado con gcloud)
        // admin.initializeApp({
        //     projectId: 'expertiacrm-7e7eb' // Project ID correcto
        // });

        console.log('✅ Firebase Admin SDK inicializado correctamente');
        return admin.firestore();
    } catch (error) {
        console.error('❌ Error al inicializar Firebase Admin:', error.message);
        
        console.log('\n📋 Para usar este script necesitas:');
        console.log('1. Archivo de credenciales JSON del service account, o');
        console.log('2. Estar autenticado con Google Cloud CLI');
        console.log('\n🔗 Instrucciones:');
        console.log('- Ve a Firebase Console > Project Settings > Service Accounts');
        console.log('- Genera una nueva clave privada');
        console.log('- Guarda el archivo JSON y actualiza la ruta en este script');
        
        process.exit(1);
    }
}

async function deleteAllUsers() {
    console.log('🗑️  Iniciando eliminación de todos los usuarios...\n');
    
    try {
        const db = await initializeFirebase();
        
        // Obtener todos los documentos de la colección 'users'
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        
        if (snapshot.empty) {
            console.log('ℹ️  No hay usuarios para eliminar. La colección ya está vacía.');
            return;
        }
        
        console.log(`📊 Encontrados ${snapshot.size} usuarios para eliminar:`);
        
        // Mostrar lista de usuarios antes de eliminar
        snapshot.forEach(doc => {
            const userData = doc.data();
            console.log(`   - ${userData.name || 'Sin nombre'} (${userData.email || 'Sin email'}) - Rol: ${userData.role || 'Sin rol'}`);
        });
        
        console.log('\n🔥 Eliminando usuarios...');
        
        // Crear un batch para eliminar todos los documentos
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // Ejecutar el batch
        await batch.commit();
        
        console.log(`✅ ${snapshot.size} usuarios eliminados exitosamente`);
        console.log('\n🎯 Resultado:');
        console.log('   - La colección "users" está ahora vacía');
        console.log('   - El próximo usuario que se registre será automáticamente ADMINISTRADOR');
        console.log('   - Los usuarios subsecuentes serán COMERCIALES');
        
    } catch (error) {
        console.error('❌ Error al eliminar usuarios:', error);
    } finally {
        // Cerrar la conexión
        process.exit(0);
    }
}

// Función principal con confirmación
async function main() {
    console.log('⚠️  ADVERTENCIA: Este script eliminará TODOS los usuarios de la base de datos');
    console.log('🔍 Project ID configurado: expertia-crm-8f8b2\n');
    
    // En un entorno de producción, podrías agregar una confirmación interactiva
    // Por ahora, procedemos directamente
    await deleteAllUsers();
}

// Ejecutar el script
main().catch(console.error);
