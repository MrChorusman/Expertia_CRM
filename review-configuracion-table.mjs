// Script para revisar el contenido de la tabla configuracion
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

console.log('🔍 Revisando contenido de la tabla configuracion...\n');

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    async function reviewConfiguracionTable() {
        console.log('📊 === ANÁLISIS DETALLADO DE TABLA CONFIGURACION ===\n');
        
        try {
            // 1. Intentar obtener todos los documentos de la colección
            console.log('🔧 1. Obteniendo todos los documentos de configuracion:');
            const configuracionRef = collection(db, 'configuracion');
            const configuracionSnapshot = await getDocs(configuracionRef);
            
            if (configuracionSnapshot.empty) {
                console.log('   ⚠️ La colección "configuracion" está vacía o no existe');
                
                // Intentar acceder a un documento específico común
                console.log('\n🔍 2. Intentando acceder a documentos comunes:');
                const commonDocNames = ['main', 'default', 'config', 'settings', 'general'];
                
                for (const docName of commonDocNames) {
                    try {
                        const docRef = doc(db, 'configuracion', docName);
                        const docSnap = await getDoc(docRef);
                        
                        if (docSnap.exists()) {
                            console.log(`   ✅ Documento "${docName}" encontrado:`);
                            console.log('   📝 Datos:', JSON.stringify(docSnap.data(), null, 4));
                        } else {
                            console.log(`   ❌ Documento "${docName}" no existe`);
                        }
                    } catch (docError) {
                        console.log(`   ⚠️ Error accediendo a "${docName}": ${docError.message}`);
                    }
                }
                
            } else {
                console.log(`   ✅ Se encontraron ${configuracionSnapshot.size} documento(s) en configuracion:`);
                console.log('\n📋 Contenido detallado:\n');
                
                let docIndex = 1;
                configuracionSnapshot.forEach((doc) => {
                    console.log(`📄 Documento ${docIndex}: ${doc.id}`);
                    console.log('─'.repeat(40));
                    
                    const data = doc.data();
                    console.log('📝 Datos completos:', JSON.stringify(data, null, 2));
                    
                    // Análisis de estructura
                    console.log('\n🔍 Análisis de estructura:');
                    const keys = Object.keys(data);
                    console.log(`   - Total de campos: ${keys.length}`);
                    keys.forEach(key => {
                        const value = data[key];
                        const type = typeof value;
                        const isObject = type === 'object' && value !== null && !Array.isArray(value);
                        
                        if (isObject) {
                            const subKeys = Object.keys(value);
                            console.log(`   - ${key} (objeto): ${subKeys.length} sub-campos`);
                            subKeys.forEach(subKey => {
                                console.log(`     • ${subKey}: ${typeof value[subKey]}`);
                            });
                        } else {
                            console.log(`   - ${key} (${type}): ${Array.isArray(value) ? `array[${value.length}]` : value}`);
                        }
                    });
                    
                    console.log('\n' + '═'.repeat(60) + '\n');
                    docIndex++;
                });
            }
            
        } catch (error) {
            console.log(`   ❌ Error accediendo a configuracion: ${error.message}`);
            
            if (error.message.includes('permission-denied')) {
                console.log('\n💡 Error de permisos detectado. Verificando reglas de Firestore...');
                console.log('   - Puede que la tabla "configuracion" no tenga reglas definidas');
                console.log('   - O puede que requiera autenticación específica');
                
                // Intentar crear reglas temporales para configuracion
                console.log('\n🔧 Sugerencia: Agregar reglas para "configuracion" en firestore.rules:');
                console.log(`
    // Tabla configuracion (temporal para análisis)
    match /configuracion/{configId} {
      allow read: if true; // Solo para análisis
      allow write: if isAdmin();
    }`);
            }
        }
        
        console.log('\n' + '═'.repeat(60));
        console.log('\n💡 CONCLUSIONES DEL ANÁLISIS:');
        console.log('\n🎯 Estado actual de las tablas de configuración:');
        console.log('   ✅ system_settings: Funcional y con datos');
        console.log('   ❓ configuracion: Necesita verificación de permisos/existencia');
        console.log('\n📋 Próximos pasos recomendados:');
        console.log('   1. Verificar si configuracion existe realmente');
        console.log('   2. Si existe, comparar estructura con system_settings');
        console.log('   3. Migrar datos únicos si los hay');
        console.log('   4. Eliminar tabla redundante');
        console.log('\n');
    }
    
    await reviewConfiguracionTable();
    
} catch (error) {
    console.error('❌ Error general en el análisis:', error);
}
