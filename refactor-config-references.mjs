// Script para refactorizar referencias hardcodeadas de configuracion por system_settings
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, 
    doc, 
    getDoc,
    collection,
    getDocs
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuración de Firebase (debe coincidir con main.js)
const firebaseConfig = {
    apiKey: "AIzaSyA_wEDMZJCYlSQfBSVe17Meu8YP-R7E6Ww",
    authDomain: "expertiacrm-7e7eb.firebaseapp.com",
    projectId: "expertiacrm-7e7eb",
    storageBucket: "expertiacrm-7e7eb.appspot.com",
    messagingSenderId: "374182600513",
    appId: "1:374182600513:web:c2b3d6e5b8f234a6789123"
};

console.log('🔍 ANÁLISIS DE REFERENCIAS A CONFIGURACION EN EL CÓDIGO\n');

async function analyzeConfigReferences() {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        console.log('📊 === ANÁLISIS DE REFERENCIAS DE CONFIGURACIÓN ===\n');
        
        // 1. Obtener configuración actual de system_settings
        console.log('🔧 1. Obteniendo configuración actual de system_settings:');
        const systemSettingsRef = doc(db, 'system_settings', 'main');
        const systemSettingsDoc = await getDoc(systemSettingsRef);
        
        if (!systemSettingsDoc.exists()) {
            console.log('   ❌ system_settings/main no existe');
            return;
        }
        
        const config = systemSettingsDoc.data();
        console.log('   ✅ system_settings cargado correctamente');
        
        // 2. Analizar referencias hardcodeadas encontradas
        console.log('\n📋 2. Referencias hardcodeadas encontradas en index.html:');
        console.log('   🔍 SERIES DE FACTURAS:');
        console.log(`      • Hardcoded: 'EXP', 'ALQ', 'PROF', 'OF'`);
        console.log(`      • Configurado: ${JSON.stringify(config.invoice?.series || ['No encontrado'])}`);
        
        console.log('\n   🔍 CATEGORÍAS DE PRODUCTOS:');
        console.log(`      • Configurado: ${JSON.stringify(config.products?.categories || ['No encontrado'])}`);
        
        console.log('\n   🔍 PROVEEDORES:');
        console.log(`      • Configurado: ${JSON.stringify(config.products?.suppliers || ['No encontrado'])}`);
        
        console.log('\n   🔍 FUENTES DE LEADS:');
        console.log(`      • Configurado: ${JSON.stringify(config.sales?.sources || ['No encontrado'])}`);
        
        console.log('\n   🔍 ETAPAS DEL EMBUDO:');
        console.log(`      • Configurado: ${JSON.stringify(config.sales?.funnelStages || ['No encontrado'])}`);
        
        console.log('\n   🔍 PRIORIDADES:');
        console.log(`      • Configurado: ${JSON.stringify(config.sales?.priorities || ['No encontrado'])}`);
        
        // 3. Generar recomendaciones de refactoring
        console.log('\n🛠️ 3. RECOMENDACIONES DE REFACTORING:');
        console.log('   ===============================================\n');
        
        console.log('   📝 A. REEMPLAZAR SERIES HARDCODEADAS:');
        console.log('      Líneas afectadas en index.html:');
        console.log('      • Línea 618, 632: series: \'EXP\' → Obtener de config.invoice.series[0]');
        console.log('      • Línea 643, 671, 693: offerSeries: \'OF\' → Obtener de config.invoice.offerSeries');
        console.log('      • Línea 909: dataToSave.invoiceSeries || \'EXP\' → || config.invoice.series[0]');
        console.log('      • Línea 989, 1023: series = \'OF\' → config.invoice.offerSeries');
        
        console.log('\n   📝 B. FUNCIÓN DINÁMICA PARA CARGAR CONFIGURACIÓN:');
        console.log('      ✅ Crear función: async getConfigValue(section, key, defaultValue)');
        console.log('      ✅ Cargar configuración una vez al inicio de la app');
        console.log('      ✅ Cache local para evitar múltiples consultas Firebase');
        
        console.log('\n   📝 C. ACTUALIZACIONES ESPECÍFICAS NECESARIAS:');
        console.log('      1. Función getNextInvoiceNumber: Usar series dinámicas');
        console.log('      2. Función getNextOfferNumber: Usar series dinámicas');
        console.log('      3. Formularios de productos: Usar categories y suppliers dinámicos');
        console.log('      4. Formularios de leads/ventas: Usar sources, funnelStages, priorities dinámicos');
        
        console.log('\n   📝 D. IMPLEMENTACIÓN SUGERIDA:');
        console.log('      ```javascript');
        console.log('      // Cache global de configuración');
        console.log('      let appConfig = null;');
        console.log('      ');
        console.log('      async function loadAppConfig() {');
        console.log('          const settingsRef = doc(db, "system_settings", "main");');
        console.log('          const settingsDoc = await getDoc(settingsRef);');
        console.log('          appConfig = settingsDoc.exists() ? settingsDoc.data() : {};');
        console.log('      }');
        console.log('      ');
        console.log('      function getConfigValue(section, key, defaultValue) {');
        console.log('          return appConfig?.[section]?.[key] || defaultValue;');
        console.log('      }');
        console.log('      ```');
        
        // 4. Verificar contador global
        console.log('\n🔢 4. CONTADOR GLOBAL DE FACTURAS:');
        console.log(`   • Estado actual: ${config.invoice?.globalCounter || 'No configurado'}`);
        console.log(`   • Próximo número: ${(config.invoice?.globalCounter || 0) + 1}`);
        
        // 5. Mostrar configuraciones actuales
        console.log('\n📊 5. RESUMEN DE CONFIGURACIONES DISPONIBLES:');
        console.log('   ===========================================');
        
        if (config.products) {
            console.log(`   📦 PRODUCTOS: ${Object.keys(config.products).length} configuraciones`);
            Object.keys(config.products).forEach(key => {
                const value = config.products[key];
                if (Array.isArray(value)) {
                    console.log(`      • ${key}: ${value.length} elementos [${value.slice(0,3).join(', ')}${value.length > 3 ? '...' : ''}]`);
                } else {
                    console.log(`      • ${key}: ${value}`);
                }
            });
        }
        
        if (config.sales) {
            console.log(`   💼 VENTAS: ${Object.keys(config.sales).length} configuraciones`);
            Object.keys(config.sales).forEach(key => {
                const value = config.sales[key];
                if (Array.isArray(value)) {
                    console.log(`      • ${key}: ${value.length} elementos [${value.slice(0,3).join(', ')}${value.length > 3 ? '...' : ''}]`);
                } else {
                    console.log(`      • ${key}: ${value}`);
                }
            });
        }
        
        if (config.invoice) {
            console.log(`   🧾 FACTURACIÓN: ${Object.keys(config.invoice).length} configuraciones`);
            Object.keys(config.invoice).forEach(key => {
                const value = config.invoice[key];
                if (Array.isArray(value)) {
                    console.log(`      • ${key}: ${value.length} elementos [${value.join(', ')}]`);
                } else if (typeof value === 'object') {
                    console.log(`      • ${key}: ${Object.keys(value).length} sub-configuraciones`);
                } else {
                    console.log(`      • ${key}: ${value}`);
                }
            });
        }
        
        console.log('\n✅ === ANÁLISIS COMPLETADO ===');
        console.log('📋 Siguiente paso: Implementar las funciones dinámicas en index.html');
        console.log('🔧 Usar las recomendaciones anteriores para refactorizar el código\n');
        
    } catch (error) {
        console.error('❌ Error analizando referencias:', error);
    }
}

// Ejecutar análisis
await analyzeConfigReferences();
