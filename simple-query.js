const admin = require('firebase-admin');
const os = require('os');
const path = require('path');

console.log('🔥 Iniciando consulta a system_settings...\n');

// Intentar usar las credenciales por defecto del CLI
try {
    // Configurar usando las credenciales de aplicación por defecto
    const app = admin.initializeApp({
        projectId: 'expertiacrm-7e7eb'
    });
    
    const db = admin.firestore(app);
    
    console.log('✅ Firebase Admin inicializado con credenciales por defecto');
    
    async function querySystemSettings() {
        try {
            console.log('🔍 Consultando colección system_settings...');
            
            const snapshot = await db.collection('system_settings').limit(5).get();
            
            if (snapshot.empty) {
                console.log('⚠️ La colección system_settings está vacía o no existe');
                
                // Intentar listar todas las colecciones
                console.log('\n📂 Listando colecciones disponibles...');
                const collections = await db.listCollections();
                console.log('Colecciones encontradas:');
                collections.forEach(collection => {
                    console.log(`  - ${collection.id}`);
                });
                
                return;
            }
            
            console.log(`✅ Se encontraron ${snapshot.size} documento(s) en system_settings:\n`);
            
            snapshot.forEach(doc => {
                console.log(`📄 Documento ID: ${doc.id}`);
                console.log('📝 Datos:', JSON.stringify(doc.data(), null, 2));
                console.log('─'.repeat(50));
            });
            
        } catch (error) {
            console.error('❌ Error al consultar system_settings:', error.message);
            
            if (error.code === 'permission-denied') {
                console.log('💡 Sugerencia: Verifica las reglas de seguridad en Firestore');
            } else if (error.code === 'unavailable') {
                console.log('💡 Sugerencia: Verifica la conexión a internet y el estado del servicio');
            }
        }
    }
    
    // Ejecutar la consulta
    querySystemSettings()
        .then(() => {
            console.log('\n✅ Consulta completada');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Error general:', error);
            process.exit(1);
        });
        
} catch (initError) {
    console.error('❌ Error al inicializar Firebase Admin:', initError.message);
    
    if (initError.message.includes('default credentials')) {
        console.log('\n💡 Para usar credenciales por defecto, ejecuta:');
        console.log('   gcloud auth application-default login');
        console.log('\n💡 O alternativamente, necesitas un archivo de service account.');
    }
    
    process.exit(1);
}
