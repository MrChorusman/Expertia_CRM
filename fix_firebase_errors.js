const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('index.html', 'utf8');

// 1. Corregir el error en la primera línea
content = content.replace(/^im<!DOCTYPE html>/, '<!DOCTYPE html>');

// 2. Función auxiliar mejorada para obtener Firestore de manera segura
const getFirestoreInstanceFunction = `
                // Función auxiliar mejorada para obtener la instancia de Firestore de manera segura
                const getFirestoreInstance = () => {
                    try {
                        if (!window.authManager || !window.authManager.app) {
                            console.log('⚠️ authManager no disponible');
                            return null;
                        }
                        if (!window.firebase || !window.firebase.getFirestore) {
                            console.log('⚠️ getFirestore no disponible');
                            return null;
                        }
                        const firestoreDb = window.firebase.getFirestore(window.authManager.app);
                        if (!firestoreDb) {
                            console.log('⚠️ Instancia de Firestore inválida');
                            return null;
                        }
                        return firestoreDb;
                    } catch (error) {
                        console.error('❌ Error obteniendo instancia de Firestore:', error);
                        return null;
                    }
                };
`;

// 3. Función mejorada de loadExpenses
const improvedLoadExpenses = `
                const loadExpenses = async () => {
                    try {
                        console.log('🔄 Iniciando carga de gastos...');
                        
                        // Esperar a que Firebase esté completamente inicializado
                        let attempts = 0;
                        const maxAttempts = 50;
                        
                        while (attempts < maxAttempts) {
                            if (window.authManager && window.authManager.app && 
                                window.firebase && window.firebase.collection && 
                                window.firebase.getDocs && window.firebase.getFirestore) {
                                break;
                            }
                            await new Promise(resolve => setTimeout(resolve, 100));
                            attempts++;
                        }
                        
                        if (attempts >= maxAttempts) {
                            console.log('⚠️ Firebase no disponible después de esperar - saltando carga de gastos');
                            return;
                        }
                        
                        console.log('✅ Firebase disponible, procediendo a cargar gastos');
                        
                        const firestoreDb = getFirestoreInstance();
                        if (!firestoreDb) {
                            console.log('⚠️ No se pudo obtener instancia de Firestore');
                            return;
                        }
                        
                        const { collection, getDocs, query, orderBy } = window.firebase;
                        
                        // Verificar que collection sea una función válida
                        if (typeof collection !== 'function') {
                            console.log('⚠️ collection no es una función válida');
                            return;
                        }
                        
                        // Crear referencia a la colección de manera segura
                        const expensesRef = collection(firestoreDb, 'expenses');
                        if (!expensesRef) {
                            console.log('⚠️ No se pudo crear referencia a la colección expenses');
                            return;
                        }
                        
                        // Intentar cargar con ordenación
                        try {
                            if (typeof orderBy === 'function') {
                                const q = query(expensesRef, orderBy('date', 'desc'));
                                const snapshot = await getDocs(q);
                                
                                const expensesData = [];
                                snapshot.forEach(doc => {
                                    expensesData.push({ id: doc.id, ...doc.data() });
                                });
                                
                                setExpenses(expensesData);
                                console.log(\`✅ Cargados \${expensesData.length} gastos correctamente\`);
                            } else {
                                // Fallback sin ordenación
                                const snapshot = await getDocs(expensesRef);
                                
                                const expensesData = [];
                                snapshot.forEach(doc => {
                                    expensesData.push({ id: doc.id, ...doc.data() });
                                });
                                
                                // Ordenar localmente por fecha
                                expensesData.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                                
                                setExpenses(expensesData);
                                console.log(\`✅ Cargados \${expensesData.length} gastos correctamente (ordenación local)\`);
                            }
                        } catch (queryError) {
                            console.log('⚠️ Error en query, usando fallback simple:', queryError);
                            // Fallback más simple
                            const snapshot = await getDocs(expensesRef);
                            
                            const expensesData = [];
                            snapshot.forEach(doc => {
                                expensesData.push({ id: doc.id, ...doc.data() });
                            });
                            
                            setExpenses(expensesData);
                            console.log(\`✅ Cargados \${expensesData.length} gastos correctamente (fallback)\`);
                        }
                    } catch (error) {
                        console.error('❌ Error cargando gastos:', error);
                    }
                };
`;

// 4. Función mejorada de loadExpenseSettingsFromFirebase
const improvedLoadExpenseSettingsFromFirebase = `
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

// 5. Función mejorada de saveExpenseSettingsToFirebase
const improvedSaveExpenseSettingsToFirebase = `
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

// 6. Función mejorada de saveExpense
const improvedSaveExpense = `
                const saveExpense = async (expenseData) => {
                    try {
                        const firestoreDb = getFirestoreInstance();
                        if (!firestoreDb) {
                            throw new Error('Firebase no disponible');
                        }
                        
                        const { collection, addDoc, updateDoc, doc } = window.firebase;
                        const expensesRef = collection(firestoreDb, 'expenses');
                        
                        if (expenseData.id) {
                            // Actualizar gasto existente
                            const expenseRef = doc(firestoreDb, 'expenses', expenseData.id);
                            await updateDoc(expenseRef, {
                                ...expenseData,
                                updatedAt: new Date().toISOString()
                            });
                            showNotification('Gasto Actualizado', 'El gasto se ha actualizado correctamente', 'success');
                        } else {
                            // Crear nuevo gasto
                            await addDoc(expensesRef, {
                                ...expenseData,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            });
                            showNotification('Gasto Creado', 'El gasto se ha creado correctamente', 'success');
                        }
                        
                        await loadExpenses();
                        return true;
                    } catch (error) {
                        console.error('❌ Error guardando gasto:', error);
                        showNotification('Error', 'No se pudo guardar el gasto', 'error');
                        return false;
                    }
                };
`;

// 7. Función mejorada de deleteExpense
const improvedDeleteExpense = `
                const deleteExpense = async (expense) => {
                    try {
                        const firestoreDb = getFirestoreInstance();
                        if (!firestoreDb) {
                            throw new Error('Firebase no disponible');
                        }
                        
                        const { doc, deleteDoc } = window.firebase;
                        const expenseRef = doc(firestoreDb, 'expenses', expense.id);
                        await deleteDoc(expenseRef);
                        
                        showNotification('Gasto Eliminado', 'El gasto se ha eliminado correctamente', 'success');
                        await loadExpenses();
                    } catch (error) {
                        console.error('❌ Error eliminando gasto:', error);
                        showNotification('Error', 'No se pudo eliminar el gasto', 'error');
                    }
                };
`;

// Aplicar todas las correcciones
let newContent = content;

// Reemplazar la función auxiliar
newContent = newContent.replace(
    /\/\/ Función auxiliar para obtener la instancia de Firestore de manera segura[\s\S]*?};/,
    getFirestoreInstanceFunction
);

// Reemplazar loadExpenses
newContent = newContent.replace(
    /const loadExpenses = async \(\) => \{[\s\S]*?\};/,
    improvedLoadExpenses
);

// Reemplazar loadExpenseSettingsFromFirebase
newContent = newContent.replace(
    /const loadExpenseSettingsFromFirebase = async \(\) => \{[\s\S]*?\};/,
    improvedLoadExpenseSettingsFromFirebase
);

// Reemplazar saveExpenseSettingsToFirebase
newContent = newContent.replace(
    /const saveExpenseSettingsToFirebase = async \(\) => \{[\s\S]*?\};/,
    improvedSaveExpenseSettingsToFirebase
);

// Reemplazar saveExpense
newContent = newContent.replace(
    /const saveExpense = async \(expenseData\) => \{[\s\S]*?\};/,
    improvedSaveExpense
);

// Reemplazar deleteExpense
newContent = newContent.replace(
    /const deleteExpense = async \(expense\) => \{[\s\S]*?\};/,
    improvedDeleteExpense
);

// Escribir el archivo corregido
fs.writeFileSync('index.html', newContent);

console.log('✅ Todos los errores de Firebase corregidos exitosamente'); 