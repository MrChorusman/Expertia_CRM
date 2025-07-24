// Script para migrar datos de configuracion a system_settings
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

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

console.log('🔄 Migrando datos de configuracion a system_settings...\n');

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    async function migrateConfigData() {
        console.log('📊 === MIGRACIÓN DE CONFIGURACIONES ===\n');
        
        // 1. Obtener datos actuales
        const systemSettingsRef = doc(db, 'system_settings', 'main');
        const configuracionRef = doc(db, 'configuracion', 'general');
        
        const [systemSettingsDoc, configuracionDoc] = await Promise.all([
            getDoc(systemSettingsRef),
            getDoc(configuracionRef)
        ]);
        
        if (!systemSettingsDoc.exists()) {
            console.log('❌ system_settings/main no existe');
            return;
        }
        
        if (!configuracionDoc.exists()) {
            console.log('❌ configuracion/general no existe');
            return;
        }
        
        const systemSettings = systemSettingsDoc.data();
        const configuracion = configuracionDoc.data();
        
        console.log('✅ Datos cargados correctamente\n');
        
        // 2. Preparar datos consolidados
        const consolidatedSettings = {
            // Mantener datos existentes de system_settings
            ...systemSettings,
            
            // Agregar/fusionar información de empresa (tomar la más completa)
            company: {
                ...systemSettings.company,
                ...configuracion.company,
                // Campos únicos de configuracion
                logo: configuracion.company?.logo || systemSettings.company?.logo,
                taxId: configuracion.company?.taxId || systemSettings.company?.nit, // Unificar NIT/taxId
            },
            
            // Migrar secciones únicas de configuracion
            products: configuracion.products || {
                categories: [
                    "Diagnóstico por Imagen",
                    "Cardiología", 
                    "Laboratorio",
                    "Quirófano",
                    "UCI",
                    "Emergencias",
                    "Rehabilitación",
                    "Servicios"
                ],
                suppliers: [
                    "Storz Medical",
                    "Zamar Medical", 
                    "Phillips Healthcare",
                    "GE Healthcare",
                    "Siemens Healthineers"
                ]
            },
            
            sales: configuracion.sales || {
                sources: ["Web", "Referido", "Llamada Fría", "Evento", "Partner", "Publicidad"],
                funnelStages: ["Lead", "Primer Contacto", "Interesado", "Demo Realizada", "Negociación", "En Cierre", "Ganado", "Perdido"],
                contactPreferences: ["Email", "Teléfono", "WhatsApp", "Visita Comercial"],
                priorities: ["Alta", "Media", "Baja"]
            },
            
            // Migrar configuración de facturación CON CONTADOR ÚNICO
            invoice: {
                ...configuracion.invoice,
                // Contador único para todas las facturas (correlativo sin saltos)
                globalCounter: configuracion.invoice?.nextNumbers?.EXP || 1,
                series: configuracion.invoice?.series || ["EXP", "ALQ", "PROF"],
                nextNumbers: configuracion.invoice?.nextNumbers || { EXP: 1, ALQ: 1, PROF: 1 },
                defaultCurrency: configuracion.invoice?.defaultCurrency || "EUR",
                vatRate: configuracion.invoice?.vatRate || 0.21,
                paymentTerms: configuracion.invoice?.paymentTerms || 30
            },
            
            // Actualizar metadatos
            version: Date.now(),
            updatedAt: new Date(),
            updatedBy: 'migration_script',
            migratedFrom: 'configuracion',
            migrationDate: new Date().toISOString()
        };
        
        console.log('📋 Datos consolidados preparados:');
        console.log('   ✓ company: Información fusionada');
        console.log('   ✓ products: Categorías y proveedores migrados');
        console.log('   ✓ sales: Configuración de ventas migrada');
        console.log('   ✓ invoice: Facturación con contador único');
        console.log('   ✓ security: Mantenida de system_settings');
        console.log('   ✓ notifications: Mantenida de system_settings');
        console.log('   ✓ integrations: Mantenida de system_settings');
        
        // 3. Guardar datos consolidados
        await setDoc(systemSettingsRef, consolidatedSettings, { merge: false });
        
        console.log('\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
        console.log('\n📊 Resumen de la migración:');
        console.log(`   - Secciones totales: ${Object.keys(consolidatedSettings).length}`);
        console.log(`   - Productos - Categorías: ${consolidatedSettings.products.categories.length}`);
        console.log(`   - Productos - Proveedores: ${consolidatedSettings.products.suppliers.length}`);
        console.log(`   - Ventas - Fuentes: ${consolidatedSettings.sales.sources.length}`);
        console.log(`   - Ventas - Etapas: ${consolidatedSettings.sales.funnelStages.length}`);
        console.log(`   - Facturas - Series: ${consolidatedSettings.invoice.series.length}`);
        console.log(`   - Contador global: ${consolidatedSettings.invoice.globalCounter}`);
        
        console.log('\n🎯 PRÓXIMOS PASOS:');
        console.log('   1. ✅ Migración de datos completada');
        console.log('   2. 🔄 Expandir panel de admin para nuevas secciones');
        console.log('   3. 🔍 Buscar y reemplazar referencias en el código');
        console.log('   4. 🧪 Probar funcionalidad completa');
        console.log('   5. 🗑️ Evaluar eliminación de tabla configuracion');
        
    }
    
    await migrateConfigData();
    
} catch (error) {
    console.error('❌ Error en la migración:', error);
}
