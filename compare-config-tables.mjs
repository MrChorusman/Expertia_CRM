// Comparación completa entre system_settings y configuracion
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

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

console.log('🔍 COMPARACIÓN COMPLETA: system_settings vs configuracion\n');

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    async function compareConfigTables() {
        console.log('📊 === ANÁLISIS COMPARATIVO DE CONFIGURACIONES ===\n');
        
        let systemSettingsData = null;
        let configuracionData = null;
        
        // 1. Obtener datos de system_settings
        try {
            const systemSettingsRef = doc(db, 'system_settings', 'main');
            const systemSettingsDoc = await getDoc(systemSettingsRef);
            
            if (systemSettingsDoc.exists()) {
                systemSettingsData = systemSettingsDoc.data();
                console.log('✅ system_settings/main cargado correctamente');
            } else {
                console.log('❌ system_settings/main no existe');
            }
        } catch (error) {
            console.log(`❌ Error cargando system_settings: ${error.message}`);
        }
        
        // 2. Obtener datos de configuracion
        try {
            const configuracionRef = doc(db, 'configuracion', 'general');
            const configuracionDoc = await getDoc(configuracionRef);
            
            if (configuracionDoc.exists()) {
                configuracionData = configuracionDoc.data();
                console.log('✅ configuracion/general cargado correctamente');
            } else {
                console.log('❌ configuracion/general no existe');
            }
        } catch (error) {
            console.log(`❌ Error cargando configuracion: ${error.message}`);
        }
        
        console.log('\n' + '═'.repeat(80) + '\n');
        
        // 3. Comparar estructuras y contenido
        if (systemSettingsData && configuracionData) {
            console.log('🔍 COMPARACIÓN DETALLADA:\n');
            
            // Análisis de system_settings
            console.log('📋 SYSTEM_SETTINGS (main):');
            console.log('─'.repeat(40));
            console.log('🏢 Secciones disponibles:');
            const systemSections = Object.keys(systemSettingsData);
            systemSections.forEach(section => {
                if (typeof systemSettingsData[section] === 'object' && systemSettingsData[section] !== null) {
                    const subKeys = Object.keys(systemSettingsData[section]);
                    console.log(`   ✓ ${section}: ${subKeys.length} configuraciones`);
                    if (section === 'company') {
                        subKeys.forEach(key => {
                            console.log(`     • ${key}: ${systemSettingsData[section][key] || 'No especificado'}`);
                        });
                    }
                } else {
                    console.log(`   - ${section}: ${systemSettingsData[section]}`);
                }
            });
            
            console.log('\n📋 CONFIGURACION (general):');
            console.log('─'.repeat(40));
            console.log('🏢 Secciones disponibles:');
            const configSections = Object.keys(configuracionData);
            configSections.forEach(section => {
                if (typeof configuracionData[section] === 'object' && configuracionData[section] !== null) {
                    const subKeys = Object.keys(configuracionData[section]);
                    console.log(`   ✓ ${section}: ${subKeys.length} configuraciones`);
                    if (section === 'company') {
                        subKeys.forEach(key => {
                            console.log(`     • ${key}: ${configuracionData[section][key] || 'No especificado'}`);
                        });
                    }
                } else {
                    console.log(`   - ${section}: ${configuracionData[section]}`);
                }
            });
            
            // 4. Identificar diferencias y solapamientos
            console.log('\n🔍 ANÁLISIS DE SOLAPAMIENTOS Y DIFERENCIAS:\n');
            
            // Secciones en común
            const systemSectionsSet = new Set(systemSections);
            const configSectionsSet = new Set(configSections);
            const commonSections = [...systemSectionsSet].filter(x => configSectionsSet.has(x));
            const systemOnly = [...systemSectionsSet].filter(x => !configSectionsSet.has(x));
            const configOnly = [...configSectionsSet].filter(x => !systemSectionsSet.has(x));
            
            console.log('🔄 Secciones COMUNES (necesitan fusión):');
            commonSections.forEach(section => {
                console.log(`   ⚠️ ${section}: Presente en ambas tablas`);
                
                if (section === 'company') {
                    console.log('     📊 Comparación de company:');
                    const systemCompany = systemSettingsData.company || {};
                    const configCompany = configuracionData.company || {};
                    
                    const allCompanyKeys = new Set([...Object.keys(systemCompany), ...Object.keys(configCompany)]);
                    
                    allCompanyKeys.forEach(key => {
                        const systemValue = systemCompany[key];
                        const configValue = configCompany[key];
                        
                        if (systemValue && configValue) {
                            if (systemValue === configValue) {
                                console.log(`       ✓ ${key}: Valores idénticos`);
                            } else {
                                console.log(`       ⚠️ ${key}: Valores diferentes`);
                                console.log(`         system_settings: "${systemValue}"`);
                                console.log(`         configuracion: "${configValue}"`);
                            }
                        } else if (systemValue) {
                            console.log(`       📤 ${key}: Solo en system_settings ("${systemValue}")`);
                        } else if (configValue) {
                            console.log(`       📥 ${key}: Solo en configuracion ("${configValue}")`);
                        }
                    });
                }
            });
            
            console.log('\n📤 Secciones EXCLUSIVAS de system_settings:');
            systemOnly.forEach(section => {
                console.log(`   ✓ ${section}: Solo en system_settings`);
            });
            
            console.log('\n📥 Secciones EXCLUSIVAS de configuracion:');
            configOnly.forEach(section => {
                console.log(`   ⭐ ${section}: Solo en configuracion (IMPORTANTE - No perder)`);
                if (typeof configuracionData[section] === 'object') {
                    const subKeys = Object.keys(configuracionData[section]);
                    console.log(`     Contiene: ${subKeys.join(', ')}`);
                }
            });
            
            // 5. Plan de migración
            console.log('\n' + '═'.repeat(80));
            console.log('\n🎯 PLAN DE CONSOLIDACIÓN RECOMENDADO:\n');
            
            console.log('✅ PASO 1: MIGRAR DATOS ÚNICOS');
            configOnly.forEach(section => {
                console.log(`   📥 Migrar "${section}" desde configuracion → system_settings`);
            });
            
            console.log('\n⚠️ PASO 2: RESOLVER CONFLICTOS');
            commonSections.forEach(section => {
                if (section === 'company') {
                    console.log(`   🔀 Fusionar información de "${section}" (tomar la más completa)`);
                }
            });
            
            console.log('\n✅ PASO 3: ACTUALIZAR CÓDIGO');
            console.log('   🔧 Modificar panel de admin para mostrar TODOS los campos');
            console.log('   📋 Agregar secciones faltantes al formulario de configuración');
            
            console.log('\n❌ PASO 4: ELIMINAR REDUNDANCIA');
            console.log('   🗑️ Eliminar tabla configuracion después de migración exitosa');
            
        } else {
            console.log('❌ No se pudieron cargar ambas tablas para comparación');
        }
        
        console.log('\n' + '═'.repeat(80));
        console.log('\n💡 CONCLUSIÓN:');
        console.log('   🎯 AMBAS TABLAS SON NECESARIAS - configuracion tiene datos únicos');
        console.log('   ⚠️ Se requiere MIGRACIÓN CUIDADOSA, no eliminación directa');
        console.log('   🔄 system_settings debe ser la tabla final consolidada');
        console.log('\n');
    }
    
    await compareConfigTables();
    
} catch (error) {
    console.error('❌ Error general en la comparación:', error);
}
