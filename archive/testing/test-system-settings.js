// Script de prueba para verificar system_settings
window.testSystemSettings = async function() {
    console.log('🧪 INICIANDO PRUEBA DE SYSTEM_SETTINGS');
    
    if (!window.db) {
        console.log('❌ Firebase DB no disponible');
        return;
    }
    
    if (!window.user) {
        console.log('❌ Usuario no autenticado');
        return;
    }
    
    try {
        console.log('📡 Importando módulos de Firestore...');
        const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        console.log('📄 Probando lectura de system_settings/main...');
        const settingsRef = doc(window.db, 'system_settings', 'main');
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
            console.log('✅ system_settings/main existe:', settingsDoc.data());
            return settingsDoc.data();
        } else {
            console.log('⚠️ system_settings/main no existe, creando documento inicial...');
            
            const initialConfig = {
                created: new Date().toISOString(),
                invoice: {
                    series: ['EXP', 'ALQ', 'PROF'],
                    offerSeries: ['OF'],
                    globalCounter: 1
                },
                products: {
                    categories: ['Diagnóstico', 'Monitorización', 'Emergencias', 'Laboratorio'],
                    suppliers: ['Storz Medical', 'Zamar Medical', 'Phillips Healthcare', 'GE Healthcare', 'Siemens']
                },
                sales: {
                    sources: ['Web', 'Teléfono', 'Email', 'Referencia', 'Presencial', 'Redes Sociales'],
                    funnelStages: ['Lead', 'Contactado', 'Interesado', 'Propuesta', 'Negociación', 'Cliente', 'Perdido', 'Seguimiento'],
                    priorities: ['Alta', 'Media', 'Baja'],
                    contactPreferences: ['Email', 'Teléfono', 'WhatsApp', 'Visita Comercial']
                },
                offers: {
                    series: ['OF', 'PRS'],
                    statuses: ['Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Vencida'],
                    defaultTerms: 'Esta oferta es válida hasta la fecha indicada. Los precios incluyen IVA.'
                }
            };
            
            await setDoc(settingsRef, initialConfig);
            console.log('✅ system_settings/main creado con configuración inicial');
            return initialConfig;
        }
        
    } catch (error) {
        console.error('❌ Error en prueba:', error);
        console.log('🔍 Detalles del error:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
    }
};

console.log('🧪 Utilidad de prueba cargada. Ejecuta: testSystemSettings()');
