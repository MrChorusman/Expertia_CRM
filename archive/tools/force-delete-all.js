const admin = require('firebase-admin');

async function forceDeleteUser() {
    try {
        const serviceAccount = require('./serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore();
        const auth = admin.auth();
        
        console.log('🔥 Eliminación forzada de usuarios...\n');
        
        // 1. Eliminar de Firestore
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        
        console.log(`📊 Usuarios en Firestore: ${snapshot.size}`);
        
        for (const doc of snapshot.docs) {
            await doc.ref.delete();
            console.log(`🗑️ Eliminado de Firestore: ${doc.id}`);
        }
        
        // 2. Eliminar de Firebase Authentication
        console.log('\n🔐 Verificando Firebase Authentication...');
        try {
            const listUsersResult = await auth.listUsers();
            console.log(`📊 Usuarios en Auth: ${listUsersResult.users.length}`);
            
            for (const userRecord of listUsersResult.users) {
                await auth.deleteUser(userRecord.uid);
                console.log(`🗑️ Eliminado de Auth: ${userRecord.uid} (${userRecord.email || 'Sin email'})`);
            }
        } catch (error) {
            console.log('⚠️ Error accediendo a Authentication:', error.message);
        }
        
        console.log('\n✅ Eliminación completa finalizada');
        console.log('🎯 Ahora la base de datos debería estar completamente limpia');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
}

forceDeleteUser().catch(console.error);
