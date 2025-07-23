const admin = require('firebase-admin');

async function monitorUsers() {
    try {
        const serviceAccount = require('./serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore();
        console.log('🔍 Monitoreando cambios en la colección users...\n');
        
        // Listener en tiempo real
        const unsubscribe = db.collection('users').onSnapshot(snapshot => {
            console.log(`\n📊 ${new Date().toISOString()} - Cambio detectado:`);
            console.log(`   Total usuarios: ${snapshot.size}`);
            
            snapshot.docChanges().forEach(change => {
                const userData = change.doc.data();
                if (change.type === 'added') {
                    console.log('   ➕ USUARIO AÑADIDO:');
                    console.log(`      ID: ${change.doc.id}`);
                    console.log(`      Nombre: ${userData.name || 'Sin nombre'}`);
                    console.log(`      Email: ${userData.email || 'Sin email'}`);
                    console.log(`      Rol: ${userData.role || 'Sin rol'}`);
                    console.log(`      Creado: ${userData.createdAt || 'Sin fecha'}`);
                    console.log(`      Provider: ${userData.provider || 'email/password'}`);
                }
                if (change.type === 'removed') {
                    console.log('   ➖ USUARIO ELIMINADO:');
                    console.log(`      ID: ${change.doc.id}`);
                }
                if (change.type === 'modified') {
                    console.log('   ✏️ USUARIO MODIFICADO:');
                    console.log(`      ID: ${change.doc.id}`);
                }
            });
        });
        
        console.log('✅ Monitor activo. Presiona Ctrl+C para detener...');
        
        // Verificación inicial
        const snapshot = await db.collection('users').get();
        console.log(`\n📋 Estado inicial: ${snapshot.size} usuarios`);
        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                const userData = doc.data();
                console.log(`   - ${userData.name || 'Sin nombre'} (${userData.email || 'Sin email'}) - ${userData.role || 'Sin rol'}`);
            });
        }
        
        // Mantener el proceso activo
        process.on('SIGINT', () => {
            console.log('\n🛑 Deteniendo monitor...');
            unsubscribe();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

monitorUsers();
