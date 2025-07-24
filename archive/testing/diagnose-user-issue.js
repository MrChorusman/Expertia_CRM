// Script para diagnosticar el problema del usuario comercial
// Ejecutar en la consola del navegador cuando el usuario esté autenticado

async function diagnoseUserIssue() {
    console.log('🔍 Diagnosticando problema de usuario...');
    
    try {
        // Verificar autenticación
        if (!window.authManager) {
            console.log('❌ AuthManager no disponible');
            return;
        }
        
        const currentUser = window.authManager.currentUser;
        if (!currentUser) {
            console.log('❌ No hay usuario autenticado');
            return;
        }
        
        console.log('✅ Usuario autenticado:', currentUser.email);
        console.log('📧 UID:', currentUser.uid);
        console.log('👤 Display Name:', currentUser.displayName);
        console.log('🖼️ Photo URL:', currentUser.photoURL);
        
        // Verificar Firebase
        if (!window.firebase) {
            console.log('❌ Firebase no disponible');
            return;
        }
        
        // Intentar obtener el perfil del usuario
        console.log('🔍 Buscando perfil en Firestore...');
        
        const { getFirestore, doc, getDoc, collection, getDocs, query, where } = window.firebase;
        const db = getFirestore(window.authManager.app);
        
        // Buscar documento por UID
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
            console.log('✅ Perfil encontrado:', userDoc.data());
        } else {
            console.log('❌ Perfil NO encontrado para UID:', currentUser.uid);
            
            // Buscar por email
            console.log('🔍 Buscando por email...');
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                console.log('❌ No se encontró ningún usuario con email:', currentUser.email);
                console.log('🛠️ SOLUCIÓN: Crear perfil de usuario');
                return await createUserProfile();
            } else {
                console.log('⚠️ Usuario encontrado con email diferente UID:');
                querySnapshot.forEach((doc) => {
                    console.log('   Documento ID:', doc.id);
                    console.log('   Datos:', doc.data());
                });
            }
        }
        
        // Verificar todos los usuarios para debug
        console.log('📋 Listando todos los usuarios:');
        const allUsersRef = collection(db, 'users');
        const allUsersSnapshot = await getDocs(allUsersRef);
        
        if (allUsersSnapshot.empty) {
            console.log('📭 No hay usuarios en la base de datos');
        } else {
            allUsersSnapshot.forEach((doc) => {
                console.log(`   ${doc.id}: ${doc.data().email} (${doc.data().role})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error en diagnóstico:', error);
        
        if (error.message.includes('permissions')) {
            console.log('🔒 Error de permisos de Firestore');
            console.log('💡 Posibles causas:');
            console.log('   1. Usuario no tiene documento en colección users');
            console.log('   2. Reglas de Firestore muy restrictivas');
            console.log('   3. Usuario no tiene rol asignado');
        }
    }
}

async function createUserProfile() {
    console.log('🛠️ Creando perfil de usuario...');
    
    try {
        const currentUser = window.authManager.currentUser;
        const { getFirestore, doc, setDoc, collection, getDocs } = window.firebase;
        const db = getFirestore(window.authManager.app);
        
        // Verificar si es el primer usuario
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const isFirstUser = usersSnapshot.empty;
        
        const userProfile = {
            uid: currentUser.uid,
            email: currentUser.email,
            role: isFirstUser ? 'admin' : 'comercial',
            name: currentUser.displayName || currentUser.email.split('@')[0],
            photoURL: currentUser.photoURL || null,
            createdAt: new Date().toISOString(),
            isFirstUser: isFirstUser,
            provider: 'google',
            active: true
        };
        
        await setDoc(doc(db, 'users', currentUser.uid), userProfile);
        
        console.log('✅ Perfil creado exitosamente:', userProfile);
        console.log('🔄 Recarga la página para aplicar los cambios');
        
        return userProfile;
        
    } catch (error) {
        console.error('❌ Error creando perfil:', error);
        throw error;
    }
}

// Función para arreglar reglas de Firestore temporalmente
async function fixFirestoreRules() {
    console.log('⚠️ Para arreglar este problema permanentemente:');
    console.log('1. Las reglas de Firestore necesitan permitir la creación de perfiles');
    console.log('2. O el sistema debe crear perfiles antes de verificar permisos');
    console.log('3. Considera hacer las reglas más permisivas temporalmente');
}

// Ejecutar diagnóstico automáticamente
console.log('🧪 Script de diagnóstico cargado');
console.log('📋 Funciones disponibles:');
console.log('   diagnoseUserIssue() - Diagnosticar problema completo');
console.log('   createUserProfile() - Crear perfil manualmente');
console.log('   fixFirestoreRules() - Ver recomendaciones');
console.log('');
console.log('▶️ Ejecutando diagnóstico automático...');
diagnoseUserIssue(); 