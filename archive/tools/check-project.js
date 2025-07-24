const admin = require('firebase-admin');

async function checkProjectDetails() {
    try {
        const serviceAccount = require('./serviceAccountKey.json');
        
        console.log('🔍 Verificando detalles del proyecto...\n');
        console.log(`📋 Project ID en serviceAccount: ${serviceAccount.project_id}`);
        console.log(`📧 Service Account Email: ${serviceAccount.client_email}`);
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        const db = admin.firestore();
        
        // Verificar usuarios con más detalle
        console.log('\n📊 Verificando usuarios en Firestore...');
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        
        console.log(`   Total documentos: ${snapshot.size}`);
        
        if (!snapshot.empty) {
            console.log('\n👥 Usuarios encontrados:');
            snapshot.forEach((doc, index) => {
                const data = doc.data();
                console.log(`   ${index + 1}. ID: ${doc.id}`);
                console.log(`      Datos: ${JSON.stringify(data, null, 6)}`);
            });
        } else {
            console.log('   ✅ No se encontraron usuarios');
        }
        
        // Verificar otras colecciones
        console.log('\n📁 Verificando otras colecciones...');
        const collections = await db.listCollections();
        console.log('   Colecciones disponibles:');
        collections.forEach(collection => {
            console.log(`   - ${collection.id}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
}

checkProjectDetails();
