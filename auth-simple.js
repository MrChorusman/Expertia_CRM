// Sistema de Autenticación Simple para Expertia CRM
// Este archivo maneja únicamente login y registro básico

class AuthManager {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
    }

    // Inicializar Firebase
    async init() {
        try {
            // Importar Firebase
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            // Obtener configuración desde firebase-config.js
            const config = JSON.parse(window.__firebase_config);
            
            // Inicializar Firebase
            this.app = initializeApp(config);
            this.auth = getAuth(this.app);
            
            // Configurar provider de Google
            this.googleProvider = new GoogleAuthProvider();
            
            // Escuchar cambios de autenticación
            onAuthStateChanged(this.auth, (user) => {
                this.currentUser = user;
                this.onAuthStateChange(user);
            });

            this.isInitialized = true;
            console.log('✅ Firebase Auth inicializado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
            return false;
        }
    }

    // Callback cuando cambia el estado de autenticación
    onAuthStateChange(user) {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
        } else {
            console.log('👤 Usuario no autenticado');
        }
    }

    // Registrar nuevo usuario
    async register(email, password) {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado');
        }

        try {
            const { createUserWithEmailAndPassword } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const { getFirestore, doc, setDoc, collection, getDocs } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Verificar si es el primer usuario
            const db = getFirestore(this.app);
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const isFirstUser = usersSnapshot.empty;
            
            // Crear perfil de usuario en Firestore
            const userProfile = {
                uid: user.uid,
                email: user.email,
                role: isFirstUser ? 'admin' : 'user', // Primer usuario = admin, resto = user
                name: user.displayName || email.split('@')[0],
                createdAt: new Date().toISOString(),
                isFirstUser: isFirstUser
            };
            
            await setDoc(doc(db, 'users', user.uid), userProfile);
            
            console.log('✅ Usuario registrado:', user.email, 'Rol:', userProfile.role);
            return user;
        } catch (error) {
            console.error('❌ Error en registro:', error);
            throw error;
        }
    }

    // Iniciar sesión
    async login(email, password) {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado');
        }

        try {
            const { signInWithEmailAndPassword } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            console.log('✅ Usuario logueado:', userCredential.user.email);
            return userCredential.user;
        } catch (error) {
            console.error('❌ Error en login:', error);
            throw error;
        }
    }

    // Cerrar sesión
    async logout() {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado');
        }

        try {
            const { signOut } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            await signOut(this.auth);
            console.log('✅ Sesión cerrada');
        } catch (error) {
            console.error('❌ Error cerrando sesión:', error);
            throw error;
        }
    }

    // Login con Google
    async loginWithGoogle() {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado');
        }

        try {
            const { signInWithPopup } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const { getFirestore, doc, setDoc, getDoc, collection, getDocs } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const result = await signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            
            // Verificar si el usuario ya existe en Firestore
            const db = getFirestore(this.app);
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (!userDoc.exists()) {
                // Es un usuario nuevo, verificar si es el primer usuario
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const isFirstUser = usersSnapshot.empty;
                
                // Crear perfil de usuario en Firestore
                const userProfile = {
                    uid: user.uid,
                    email: user.email,
                    role: isFirstUser ? 'admin' : 'user',
                    name: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL || null,
                    createdAt: new Date().toISOString(),
                    isFirstUser: isFirstUser,
                    provider: 'google'
                };
                
                await setDoc(doc(db, 'users', user.uid), userProfile);
                console.log('✅ Nuevo usuario Google creado:', user.email, 'Rol:', userProfile.role);
            } else {
                console.log('✅ Usuario Google existente:', user.email);
            }
            
            return user;
        } catch (error) {
            console.error('❌ Error en login con Google:', error);
            throw error;
        }
    }

    // Obtener perfil completo del usuario actual
    async getUserProfile() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const { getFirestore, doc, getDoc } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const db = getFirestore(this.app);
            const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
            
            if (userDoc.exists()) {
                const profile = userDoc.data();
                console.log('👤 Perfil de usuario:', profile);
                return profile;
            } else {
                console.log('⚠️ No se encontró perfil para el usuario');
                return null;
            }
        } catch (error) {
            console.error('❌ Error obteniendo perfil:', error);
            return null;
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si hay usuario autenticado
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Crear instancia global
window.authManager = new AuthManager();
