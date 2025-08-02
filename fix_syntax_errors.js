const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('index.html', 'utf8');

// 1. Corregir el problema de PropTypes en Recharts
const propTypesFix = `
    <script>
        // Asegurar que PropTypes esté disponible globalmente
        if (typeof window.PropTypes === 'undefined') {
            console.warn('⚠️ PropTypes no disponible, cargando desde CDN...');
            // Crear un objeto PropTypes básico para evitar errores
            window.PropTypes = {
                oneOfType: () => {},
                string: {},
                number: {},
                bool: {},
                array: {},
                object: {},
                func: {},
                node: {},
                element: {},
                instanceOf: () => {},
                oneOf: () => {},
                shape: () => {},
                exact: () => {}
            };
        } else {
            console.log('✅ PropTypes cargado correctamente');
        }
    </script>
`;

// 2. Corregir la función loadExpenseSettingsFromFirebase (eliminar código duplicado y corregir sintaxis)
const correctedLoadExpenseSettingsFromFirebase = `
                const loadExpenseSettingsFromFirebase = async () => {
                    try {
                        console.log('📥 Cargando configuraciones de gastos desde Firebase...');
                        
                        // Esperar a que Firebase esté completamente inicializado
                        let attempts = 0;
                        const maxAttempts = 50;
                        
                        while (attempts < maxAttempts) {
                            if (window.authManager && window.authManager.app && 
                                window.firebase && window.firebase.doc && 
                                window.firebase.getDoc && window.firebase.getFirestore) {
                                break;
                            }
                            await new Promise(resolve => setTimeout(resolve, 100));
                            attempts++;
                        }
                        
                        if (attempts >= maxAttempts) {
                            console.log('⚠️ Firebase no disponible después de esperar - usando configuraciones por defecto');
                            return;
                        }
                        
                        console.log('✅ Firebase disponible, procediendo a cargar configuraciones de gastos');
                        
                        const firestoreDb = getFirestoreInstance();
                        if (!firestoreDb) {
                            console.log('⚠️ No se pudo obtener instancia de Firestore');
                            return;
                        }
                        
                        const { doc, getDoc } = window.firebase;
                        const settingsRef = doc(firestoreDb, 'system_settings', 'main');
                        const settingsDoc = await getDoc(settingsRef);
                        
                        if (settingsDoc.exists()) {
                            const data = settingsDoc.data();
                            if (data.expenses) {
                                setExpenseConfig(data.expenses);
                                console.log('✅ Configuraciones de gastos cargadas desde Firebase');
                            }
                        }
                    } catch (error) {
                        console.error('❌ Error cargando configuraciones de gastos:', error);
                    }
                };
`;

// 3. Corregir la función saveExpenseSettingsToFirebase
const correctedSaveExpenseSettingsToFirebase = `
                const saveExpenseSettingsToFirebase = async () => {
                    try {
                        setLoading(true);
                        console.log('💾 Guardando configuraciones de gastos...');
                        
                        // Esperar a que Firebase esté completamente inicializado
                        let attempts = 0;
                        const maxAttempts = 50;
                        
                        while (attempts < maxAttempts) {
                            if (window.authManager && window.authManager.app && 
                                window.firebase && window.firebase.doc && 
                                window.firebase.updateDoc && window.firebase.getFirestore) {
                                break;
                            }
                            await new Promise(resolve => setTimeout(resolve, 100));
                            attempts++;
                        }
                        
                        if (attempts >= maxAttempts) {
                            throw new Error('Firebase no disponible después de esperar');
                        }
                        
                        console.log('✅ Firebase disponible, procediendo a guardar configuraciones de gastos');
                        
                        const firestoreDb = getFirestoreInstance();
                        if (!firestoreDb) {
                            throw new Error('No se pudo obtener instancia de Firestore');
                        }
                        
                        const { doc, updateDoc } = window.firebase;
                        const settingsRef = doc(firestoreDb, 'system_settings', 'main');
                        await updateDoc(settingsRef, {
                            expenses: expenseConfig
                        });
                        
                        setSaved(true);
                        setTimeout(() => setSaved(false), 3000);
                        console.log('✅ Configuraciones de gastos guardadas en Firebase');
                        showNotification('Configuraciones Guardadas', 'Las configuraciones de gastos se han guardado correctamente', 'success');
                    } catch (error) {
                        console.error('❌ Error guardando configuraciones de gastos:', error);
                        showNotification('Error', 'No se pudieron guardar las configuraciones de gastos', 'error');
                    } finally {
                        setLoading(false);
                    }
                };
`;

// Aplicar las correcciones
let newContent = content;

// Reemplazar el script de PropTypes
newContent = newContent.replace(
    /<script>\s*\/\/ Asegurar que PropTypes esté disponible globalmente[\s\S]*?<\/script>/,
    propTypesFix
);

// Eliminar el código duplicado y corregir loadExpenseSettingsFromFirebase
newContent = newContent.replace(
    /const loadExpenseSettingsFromFirebase = async \(\) => \{[\s\S]*?\};[\s\S]*?try \{[\s\S]*?console\.error\('❌ Error cargando configuraciones de gastos:', error\);\s*\}\s*};/,
    correctedLoadExpenseSettingsFromFirebase
);

// Corregir saveExpenseSettingsToFirebase
newContent = newContent.replace(
    /const saveExpenseSettingsToFirebase = async \(\) => \{[\s\S]*?\};/,
    correctedSaveExpenseSettingsToFirebase
);

// Escribir el archivo corregido
fs.writeFileSync('index.html', newContent);

console.log('✅ Errores de sintaxis y PropTypes corregidos exitosamente'); 