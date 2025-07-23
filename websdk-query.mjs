// Importar las dependencias de Firebase Web SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBvxsbp8Lo8bGWK5sbEDC3RN-01Gfj0jFY",
  authDomain: "expertiacrm-7e7eb.firebaseapp.com",
  databaseURL: "https://expertiacrm-7e7eb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expertiacrm-7e7eb",
  storageBucket: "expertiacrm-7e7eb.firebasestorage.app",
  messagingSenderId: "730578427970",
  appId: "1:730578427970:web:d9a14fc298b786ba53cddb"
};

console.log('🔥 Iniciando consulta con Firebase Web SDK...\n');

try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase Web SDK inicializado correctamente');
    console.log(`📱 Proyecto: ${firebaseConfig.projectId}`);
    
    async function querySystemSettings() {
        try {
            console.log('\n🔍 Consultando colección system_settings...');
            
            const systemSettingsRef = collection(db, 'system_settings');
            const snapshot = await getDocs(systemSettingsRef);
            
            if (snapshot.empty) {
                console.log('⚠️ La colección system_settings está vacía o no existe');
                console.log('💡 Esto podría significar:');
                console.log('   - La colección aún no ha sido creada');
                console.log('   - Los permisos de lectura están restringidos');
                console.log('   - La colección tiene un nombre diferente');
                return;
            }
            
            console.log(`✅ Se encontraron ${snapshot.size} documento(s) en system_settings:\n`);
            
            let count = 1;
            snapshot.forEach((doc) => {
                console.log(`📄 Documento ${count}: ${doc.id}`);
                console.log('📝 Datos:', JSON.stringify(doc.data(), null, 2));
                console.log('─'.repeat(60));
                count++;
            });
            
            console.log(`\n✨ Consulta completada exitosamente. Total: ${snapshot.size} documento(s)`);
            
        } catch (error) {
            console.error('❌ Error al consultar system_settings:', error.code);
            console.error('📄 Mensaje:', error.message);
            
            // Proporcionar sugerencias específicas basadas en el tipo de error
            switch (error.code) {
                case 'permission-denied':
                    console.log('\n💡 Sugerencias para permission-denied:');
                    console.log('   - Verifica las reglas de Firestore');
                    console.log('   - Asegúrate de que la autenticación esté configurada');
                    break;
                    
                case 'unavailable':
                    console.log('\n💡 Sugerencias para unavailable:');
                    console.log('   - Verifica tu conexión a internet');
                    console.log('   - Revisa el estado del servicio de Firebase');
                    break;
                    
                case 'failed-precondition':
                    console.log('\n💡 Sugerencias para failed-precondition:');
                    console.log('   - El proyecto podría no estar configurado correctamente');
                    console.log('   - Firestore podría no estar habilitado');
                    break;
                    
                default:
                    console.log('\n💡 Sugerencia general:');
                    console.log('   - Revisa la consola de Firebase para más detalles');
                    console.log('   - Verifica que el proyecto ID sea correcto');
            }
        }
    }
    
    // Ejecutar la consulta
    await querySystemSettings();
    
} catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    console.log('💡 Verifica que la configuración de Firebase sea correcta');
}
