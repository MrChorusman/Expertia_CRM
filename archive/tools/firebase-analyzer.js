/**
 * Analizador de Tabla system_settings - Firebase
 * Herramienta para inspeccionar la estructura y contenido de la tabla system_settings
 */

class FirebaseAnalyzer {
    constructor(authManager) {
        this.authManager = authManager;
        this.db = null;
    }

    async init() {
        if (!this.authManager || !this.authManager.app) {
            throw new Error('AuthManager no está disponible');
        }

        // Importar Firestore
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        this.db = getFirestore(this.authManager.app);
        console.log('🔥 Firebase Analyzer inicializado');
    }

    async analyzeSystemSettings() {
        if (!this.db) {
            await this.init();
        }

        try {
            const { doc, getDoc, collection, getDocs } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            console.log('🔍 === ANÁLISIS DE TABLA SYSTEM_SETTINGS ===');
            console.log('');

            // Analizar documento principal
            const settingsRef = doc(this.db, 'system_settings', 'main');
            const settingsDoc = await getDoc(settingsRef);

            if (settingsDoc.exists()) {
                const data = settingsDoc.data();
                console.log('📊 ESTRUCTURA DEL DOCUMENTO "main":');
                console.log('----------------------------------------');
                
                // Analizar cada sección
                this.analyzeSection('🏢 COMPANY (Empresa)', data.company);
                this.analyzeSection('🛡️ SECURITY (Seguridad)', data.security);
                this.analyzeSection('🔔 NOTIFICATIONS (Notificaciones)', data.notifications);
                this.analyzeSection('🔌 INTEGRATIONS (Integraciones)', data.integrations);
                
                // Metadatos
                console.log('📋 METADATOS:');
                console.log('-------------');
                console.log(`📅 Última actualización: ${data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleString('es-ES') : 'No disponible'}`);
                console.log(`👤 Actualizado por: ${data.updatedBy || 'No disponible'}`);
                console.log(`🔢 Versión: ${data.version || 'No disponible'}`);
                console.log('');

                // Verificar otros documentos en la colección
                const settingsCollection = collection(this.db, 'system_settings');
                const allDocs = await getDocs(settingsCollection);
                
                console.log('📁 DOCUMENTOS EN LA COLECCIÓN:');
                console.log('------------------------------');
                allDocs.forEach(doc => {
                    console.log(`📄 ${doc.id} (${Object.keys(doc.data()).length} campos)`);
                });

                return {
                    exists: true,
                    data: data,
                    documentCount: allDocs.size,
                    mainDocument: settingsDoc.id
                };

            } else {
                console.log('❌ El documento "main" no existe en system_settings');
                console.log('💡 La tabla puede estar vacía o usar una estructura diferente');
                
                // Verificar si hay otros documentos
                const settingsCollection = collection(this.db, 'system_settings');
                const allDocs = await getDocs(settingsCollection);
                
                if (allDocs.size > 0) {
                    console.log(`📁 Encontrados ${allDocs.size} documentos alternativos:`);
                    allDocs.forEach(doc => {
                        console.log(`📄 ${doc.id}`);
                        console.log('   Contenido:', doc.data());
                    });
                }

                return {
                    exists: false,
                    documentCount: allDocs.size,
                    documents: allDocs.docs.map(doc => ({id: doc.id, data: doc.data()}))
                };
            }

        } catch (error) {
            console.error('❌ Error analizando system_settings:', error);
            return {
                error: error.message
            };
        }
    }

    analyzeSection(title, sectionData) {
        if (!sectionData) {
            console.log(`${title}: ❌ No existe`);
            return;
        }

        console.log(`${title}:`);
        Object.entries(sectionData).forEach(([key, value]) => {
            const type = typeof value;
            let displayValue = value;
            
            if (type === 'string' && value.length > 50) {
                displayValue = value.substring(0, 50) + '...';
            }
            
            console.log(`  • ${key}: ${displayValue} (${type})`);
        });
        console.log('');
    }

    async exportSettings() {
        const analysis = await this.analyzeSystemSettings();
        
        if (analysis.exists) {
            const exportData = {
                exportedAt: new Date().toISOString(),
                exportedBy: this.authManager.currentUser?.uid || 'unknown',
                data: analysis.data,
                metadata: {
                    documentCount: analysis.documentCount,
                    mainDocument: analysis.mainDocument
                }
            };

            // Crear blob y descargar
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `system_settings_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('📄 Configuraciones exportadas exitosamente');
            return exportData;
        }

        return null;
    }

    async createBackup() {
        console.log('💾 Creando backup de system_settings...');
        
        try {
            const analysis = await this.analyzeSystemSettings();
            
            if (analysis.exists) {
                const { doc, setDoc } = 
                    await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

                const backupRef = doc(this.db, 'system_settings', `backup_${Date.now()}`);
                const backupData = {
                    ...analysis.data,
                    backupCreatedAt: new Date(),
                    backupCreatedBy: this.authManager.currentUser.uid,
                    originalDocument: 'main'
                };

                await setDoc(backupRef, backupData);
                console.log('✅ Backup creado exitosamente');
                
                return backupRef.id;
            }

        } catch (error) {
            console.error('❌ Error creando backup:', error);
            return null;
        }
    }
}

// Función global para usar en la consola
window.analyzeFirebaseSettings = async function() {
    if (!window.authManager) {
        console.error('❌ AuthManager no disponible');
        return;
    }

    const analyzer = new FirebaseAnalyzer(window.authManager);
    return await analyzer.analyzeSystemSettings();
};

window.exportFirebaseSettings = async function() {
    if (!window.authManager) {
        console.error('❌ AuthManager no disponible');
        return;
    }

    const analyzer = new FirebaseAnalyzer(window.authManager);
    return await analyzer.exportSettings();
};

window.backupFirebaseSettings = async function() {
    if (!window.authManager) {
        console.error('❌ AuthManager no disponible');
        return;
    }

    const analyzer = new FirebaseAnalyzer(window.authManager);
    return await analyzer.createBackup();
};

console.log('🔧 Firebase Analyzer cargado');
console.log('📋 Comandos disponibles:');
console.log('  • analyzeFirebaseSettings() - Analizar system_settings');
console.log('  • exportFirebaseSettings() - Exportar configuraciones');
console.log('  • backupFirebaseSettings() - Crear backup');
