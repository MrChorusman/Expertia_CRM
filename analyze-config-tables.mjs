// Script para analizar las dos tablas de configuración y consolidarlas
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

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

console.log('🔍 Analizando tablas de configuración...\n');

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    async function analyzeConfigTables() {
        console.log('📊 === ANÁLISIS DE TABLAS DE CONFIGURACIÓN ===\n');
        
        // 1. Analizar system_settings
        console.log('🔧 1. Analizando tabla system_settings:');
        try {
            const systemSettingsRef = collection(db, 'system_settings');
            const systemSettingsSnapshot = await getDocs(systemSettingsRef);
            
            if (systemSettingsSnapshot.empty) {
                console.log('   ⚠️ system_settings está vacía');
            } else {
                console.log(`   ✅ system_settings contiene ${systemSettingsSnapshot.size} documento(s)`);
                systemSettingsSnapshot.forEach((doc, index) => {
                    console.log(`   📄 Documento ${index + 1}: ${doc.id}`);
                    const data = doc.data();
                    console.log('   📝 Estructura:');
                    console.log(`      - company: ${data.company ? 'Sí' : 'No'}`);
                    console.log(`      - security: ${data.security ? 'Sí' : 'No'}`);
                    console.log(`      - notifications: ${data.notifications ? 'Sí' : 'No'}`);
                    console.log(`      - integrations: ${data.integrations ? 'Sí' : 'No'}`);
                    console.log(`      - version: ${data.version || 'No especificada'}`);
                    console.log(`      - updatedAt: ${data.updatedAt ? 'Sí' : 'No'}`);
                    console.log(`      - updatedBy: ${data.updatedBy || 'No especificado'}`);
                });
            }
        } catch (error) {
            console.log(`   ❌ Error accediendo a system_settings: ${error.message}`);
        }
        
        console.log('\n' + '─'.repeat(60) + '\n');
        
        // 2. Analizar configuracion
        console.log('🔧 2. Analizando tabla configuracion:');
        try {
            const configuracionRef = collection(db, 'configuracion');
            const configuracionSnapshot = await getDocs(configuracionRef);
            
            if (configuracionSnapshot.empty) {
                console.log('   ⚠️ configuracion está vacía');
            } else {
                console.log(`   ✅ configuracion contiene ${configuracionSnapshot.size} documento(s)`);
                configuracionSnapshot.forEach((doc, index) => {
                    console.log(`   📄 Documento ${index + 1}: ${doc.id}`);
                    const data = doc.data();
                    console.log('   📝 Datos:', JSON.stringify(data, null, 6));
                });
            }
        } catch (error) {
            console.log(`   ❌ Error accediendo a configuracion: ${error.message}`);
        }
        
        console.log('\n' + '═'.repeat(60) + '\n');
        
        // 3. Recomendaciones
        console.log('💡 RECOMENDACIONES PARA CONSOLIDACIÓN:');
        console.log('');
        console.log('✅ MANTENER: system_settings');
        console.log('   - Tabla principal y más completa');
        console.log('   - Estructura bien definida (company, security, notifications, integrations)');
        console.log('   - Ya integrada en el sistema de autenticación');
        console.log('   - Tiene versionado y auditoría (updatedAt, updatedBy)');
        console.log('');
        console.log('❌ ELIMINAR: configuracion');
        console.log('   - Tabla redundante');
        console.log('   - Migrar cualquier dato único a system_settings si existe');
        console.log('');
        console.log('🔄 PLAN DE MIGRACIÓN:');
        console.log('   1. Verificar si configuracion tiene datos únicos');
        console.log('   2. Migrar datos únicos a system_settings (si los hay)');
        console.log('   3. Actualizar el código del panel de admin');
        console.log('   4. Eliminar tabla configuracion');
        console.log('   5. Actualizar reglas de Firestore');
        console.log('');
    }
    
    await analyzeConfigTables();
    
} catch (error) {
    console.error('❌ Error en el análisis:', error);
}
