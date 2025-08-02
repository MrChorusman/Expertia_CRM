/**
 * Hooks personalizados para Firebase - Expertia CRM
 * Centraliza la lógica de Firebase y proporciona interfaces limpias
 */

const FirebaseHooks = {
    // Hook para cargar configuraciones
    useFirebaseSettings: () => {
        const loadSettings = async (collection, documentId) => {
            try {
                SecureLogger.firebase(`Cargando configuraciones desde ${collection}/${documentId}`, 'LOAD');
                
                const firestore = await FirebaseContext.getFirestore();
                const { doc, getDoc } = window.firebase;
                
                const settingsRef = doc(firestore, collection, documentId);
                const settingsDoc = await getDoc(settingsRef);
                
                if (settingsDoc.exists()) {
                    const data = settingsDoc.data();
                    SecureLogger.success(`Configuraciones cargadas desde ${collection}/${documentId}`);
                    return { success: true, data };
                } else {
                    SecureLogger.warn(`Documento no encontrado: ${collection}/${documentId}`);
                    return { success: false, data: null };
                }
            } catch (error) {
                SecureLogger.error(`Error cargando configuraciones desde ${collection}/${documentId}`, error);
                return { success: false, error };
            }
        };

        const saveSettings = async (collection, documentId, data) => {
            try {
                SecureLogger.firebase(`Guardando configuraciones en ${collection}/${documentId}`, 'SAVE');
                
                const firestore = await FirebaseContext.getFirestore();
                const { doc, updateDoc, setDoc } = window.firebase;
                
                const settingsRef = doc(firestore, collection, documentId);
                
                // Intentar actualizar, si falla, crear nuevo documento
                try {
                    await updateDoc(settingsRef, data);
                } catch (error) {
                    await setDoc(settingsRef, data);
                }
                
                SecureLogger.success(`Configuraciones guardadas en ${collection}/${documentId}`);
                return { success: true };
            } catch (error) {
                SecureLogger.error(`Error guardando configuraciones en ${collection}/${documentId}`, error);
                return { success: false, error };
            }
        };

        return { loadSettings, saveSettings };
    },

    // Hook para operaciones CRUD de gastos
    useExpenseOperations: () => {
        const loadExpenses = async () => {
            try {
                SecureLogger.firebase('Cargando gastos', 'LOAD');
                
                const firestore = await FirebaseContext.getFirestore();
                const { collection, getDocs, query, orderBy } = window.firebase;
                
                const expensesRef = collection(firestore, 'expenses');
                
                // Intentar cargar con ordenación
                try {
                    const q = query(expensesRef, orderBy('date', 'desc'));
                    const snapshot = await getDocs(q);
                    
                    const expensesData = [];
                    snapshot.forEach(doc => {
                        expensesData.push({ id: doc.id, ...doc.data() });
                    });
                    
                    SecureLogger.success(`Cargados ${expensesData.length} gastos`);
                    return { success: true, data: expensesData };
                } catch (queryError) {
                    // Fallback sin ordenación
                    const snapshot = await getDocs(expensesRef);
                    
                    const expensesData = [];
                    snapshot.forEach(doc => {
                        expensesData.push({ id: doc.id, ...doc.data() });
                    });
                    
                    // Ordenar localmente
                    expensesData.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
                    
                    SecureLogger.success(`Cargados ${expensesData.length} gastos (ordenación local)`);
                    return { success: true, data: expensesData };
                }
            } catch (error) {
                SecureLogger.error('Error cargando gastos', error);
                return { success: false, error };
            }
        };

        const saveExpense = async (expenseData) => {
            try {
                // Validar datos antes de guardar
                const validation = DataValidator.validateExpense(expenseData);
                if (!validation.isValid) {
                    throw new Error(`Datos de gasto inválidos: ${validation.errors.join(', ')}`);
                }

                const sanitizedData = validation.sanitizedData;
                SecureLogger.firebase('Guardando gasto', 'SAVE');
                
                const firestore = await FirebaseContext.getFirestore();
                const { collection, addDoc, updateDoc, doc } = window.firebase;
                
                const expensesRef = collection(firestore, 'expenses');
                
                if (sanitizedData.id) {
                    // Actualizar gasto existente
                    const expenseRef = doc(firestore, 'expenses', sanitizedData.id);
                    await updateDoc(expenseRef, {
                        ...sanitizedData,
                        updatedAt: new Date().toISOString()
                    });
                    SecureLogger.success('Gasto actualizado correctamente');
                } else {
                    // Crear nuevo gasto
                    await addDoc(expensesRef, {
                        ...sanitizedData,
                        createdAt: new Date().toISOString()
                    });
                    SecureLogger.success('Gasto creado correctamente');
                }
                
                return { success: true };
            } catch (error) {
                SecureLogger.error('Error guardando gasto', error);
                return { success: false, error };
            }
        };

        const deleteExpense = async (expenseId) => {
            try {
                SecureLogger.firebase(`Eliminando gasto ${expenseId}`, 'DELETE');
                
                const firestore = await FirebaseContext.getFirestore();
                const { doc, deleteDoc } = window.firebase;
                
                const expenseRef = doc(firestore, 'expenses', expenseId);
                await deleteDoc(expenseRef);
                
                SecureLogger.success(`Gasto ${expenseId} eliminado correctamente`);
                return { success: true };
            } catch (error) {
                SecureLogger.error(`Error eliminando gasto ${expenseId}`, error);
                return { success: false, error };
            }
        };

        return { loadExpenses, saveExpense, deleteExpense };
    },

    // Hook para operaciones CRUD de clientes
    useClientOperations: () => {
        const loadClients = async () => {
            try {
                SecureLogger.firebase('Cargando clientes', 'LOAD');
                
                const firestore = await FirebaseContext.getFirestore();
                const { collection, getDocs, query, orderBy } = window.firebase;
                
                const clientsRef = collection(firestore, 'clients');
                const q = query(clientsRef, orderBy('name', 'asc'));
                const snapshot = await getDocs(q);
                
                const clientsData = [];
                snapshot.forEach(doc => {
                    clientsData.push({ id: doc.id, ...doc.data() });
                });
                
                SecureLogger.success(`Cargados ${clientsData.length} clientes`);
                return { success: true, data: clientsData };
            } catch (error) {
                SecureLogger.error('Error cargando clientes', error);
                return { success: false, error };
            }
        };

        const saveClient = async (clientData) => {
            try {
                // Validar datos antes de guardar
                const validation = DataValidator.validateClient(clientData);
                if (!validation.isValid) {
                    throw new Error(`Datos de cliente inválidos: ${validation.errors.join(', ')}`);
                }

                const sanitizedData = validation.sanitizedData;
                SecureLogger.firebase('Guardando cliente', 'SAVE');
                
                const firestore = await FirebaseContext.getFirestore();
                const { collection, addDoc, updateDoc, doc } = window.firebase;
                
                const clientsRef = collection(firestore, 'clients');
                
                if (sanitizedData.id) {
                    // Actualizar cliente existente
                    const clientRef = doc(firestore, 'clients', sanitizedData.id);
                    await updateDoc(clientRef, {
                        ...sanitizedData,
                        updatedAt: new Date().toISOString()
                    });
                    SecureLogger.success('Cliente actualizado correctamente');
                } else {
                    // Crear nuevo cliente
                    await addDoc(clientsRef, {
                        ...sanitizedData,
                        createdAt: new Date().toISOString()
                    });
                    SecureLogger.success('Cliente creado correctamente');
                }
                
                return { success: true };
            } catch (error) {
                SecureLogger.error('Error guardando cliente', error);
                return { success: false, error };
            }
        };

        return { loadClients, saveClient };
    },

    // Hook para operaciones CRUD de facturas
    useInvoiceOperations: () => {
        const loadInvoices = async () => {
            try {
                SecureLogger.firebase('Cargando facturas', 'LOAD');
                
                const firestore = await FirebaseContext.getFirestore();
                const { collection, getDocs, query, orderBy } = window.firebase;
                
                const invoicesRef = collection(firestore, 'invoices');
                const q = query(invoicesRef, orderBy('date', 'desc'));
                const snapshot = await getDocs(q);
                
                const invoicesData = [];
                snapshot.forEach(doc => {
                    invoicesData.push({ id: doc.id, ...doc.data() });
                });
                
                SecureLogger.success(`Cargadas ${invoicesData.length} facturas`);
                return { success: true, data: invoicesData };
            } catch (error) {
                SecureLogger.error('Error cargando facturas', error);
                return { success: false, error };
            }
        };

        const saveInvoice = async (invoiceData) => {
            try {
                SecureLogger.firebase('Guardando factura', 'SAVE');
                
                const firestore = await FirebaseContext.getFirestore();
                const { collection, addDoc, updateDoc, doc } = window.firebase;
                
                const invoicesRef = collection(firestore, 'invoices');
                
                if (invoiceData.id) {
                    // Actualizar factura existente
                    const invoiceRef = doc(firestore, 'invoices', invoiceData.id);
                    await updateDoc(invoiceRef, {
                        ...invoiceData,
                        updatedAt: new Date().toISOString()
                    });
                    SecureLogger.success('Factura actualizada correctamente');
                } else {
                    // Crear nueva factura
                    await addDoc(invoicesRef, {
                        ...invoiceData,
                        createdAt: new Date().toISOString()
                    });
                    SecureLogger.success('Factura creada correctamente');
                }
                
                return { success: true };
            } catch (error) {
                SecureLogger.error('Error guardando factura', error);
                return { success: false, error };
            }
        };

        return { loadInvoices, saveInvoice };
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.FirebaseHooks = FirebaseHooks;
}

console.log('🔥 Hooks de Firebase cargados'); 