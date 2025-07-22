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
            
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            console.log('✅ Usuario registrado:', userCredential.user.email);
            return userCredential.user;
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
            
            const result = await signInWithPopup(this.auth, this.googleProvider);
            console.log('✅ Usuario logueado con Google:', result.user.email);
            return result.user;
        } catch (error) {
            console.error('❌ Error en login con Google:', error);
            throw error;
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
