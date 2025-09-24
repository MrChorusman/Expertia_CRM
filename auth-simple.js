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
            console.log('🔄 Inicializando Firebase Auth...');
            
            // Importar Firebase
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            // Obtener configuración desde firebase-config.js
            const config = JSON.parse(window.__firebase_config);
            console.log('🔧 Configuración Firebase cargada:', config.projectId);
            
            // Inicializar Firebase
            this.app = initializeApp(config);
            this.auth = getAuth(this.app);
            
            console.log('✅ Firebase App inicializado');
            console.log(\'✅ Firebase Auth inicializado\');
            // Configurar Google Auth Provider con mejores prácticas
            this.googleProvider = new GoogleAuthProvider();
            
            // Configurar scopes adicionales para obtener más información
            this.googleProvider.addScope('profile');
            this.googleProvider.addScope('email');
            this.googleProvider.addScope('openid');
            
            // Configurar parámetros adicionales
            this.googleProvider.setCustomParameters({
                'prompt': 'select_account' // Forzar selección de cuenta
            });
            
            console.log('✅ Google Auth Provider configurado con mejores prácticas');
            
            // Configurar provider de Google
            this.googleProvider = new GoogleAuthProvider();
            console.log('✅ Google Auth Provider configurado');
            
            // Escuchar cambios de autenticación
            onAuthStateChanged(this.auth, (user) => {
                this.currentUser = user;
                this.onAuthStateChange(user);
            });
            console.log('✅ Auth State Listener configurado');

            this.isInitialized = true;
            console.log('✅ Firebase Auth inicializado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
            console.error('🔍 Código de error:', error.code);
            console.error('📝 Mensaje:', error.message);
            return false;
        }
    }

    // Callback cuando cambia el estado de autenticación
    onAuthStateChange(user) {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            console.log('👤 UID:', user.uid);
            console.log('📧 Email verificado:', user.emailVerified);
            console.log('🔍 Proveedor:', user.providerData[0]?.providerId || 'email');
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
            const { createUserWithEmailAndPassword, sendEmailVerification } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const { getFirestore, doc, setDoc, collection, getDocs } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            console.log('🔄 Iniciando registro para:', email);
            
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ Usuario creado en Firebase Auth:', user.uid);
            console.log('📧 Email verificado:', user.emailVerified);
            
            // PASO CRÍTICO: Enviar email de verificación inmediatamente después de crear el usuario
            console.log('🔄 Enviando email de verificación inmediatamente...');
            console.log('👤 Usuario a verificar:', {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified
            });
            
            // Configurar actionCodeSettings para el email de verificación
            const actionCodeSettings = {
                url: window.location.origin + '/index.html?verified=true',
                handleCodeInApp: false,
            };
            
            console.log('🔧 Configuración de email:', actionCodeSettings);
            
            try {
                await sendEmailVerification(user, actionCodeSettings);
                console.log('✅ Email de verificación enviado exitosamente');
                
                // CRÍTICO: Verificar que el usuario sigue sin verificar después del envío
                await user.reload();
                if (user.emailVerified) {
                    console.error('🚨 PROBLEMA CRÍTICO: Usuario marcado como verificado sin haber verificado el email');
                    throw new Error('El usuario fue marcado como verificado incorrectamente');
                }
                console.log('✅ Confirmado: Usuario sigue sin verificar después del envío del email');
                
            } catch (emailError) {
                console.error('❌ Error específico enviando email de verificación:', emailError);
                console.error('🔍 Código de error:', emailError.code);
                console.error('📝 Mensaje:', emailError.message);
                
                // Manejar error específico de demasiadas solicitudes
                if (emailError.code === 'auth/too-many-requests') {
                    console.error('🚨 LÍMITE DE EMAILS ALCANZADO: Firebase ha bloqueado el envío de emails de verificación');
                    console.error('💡 SOLUCIÓN: Espera 1 hora o usa una IP diferente para continuar las pruebas');
                    throw new Error('Límite de emails de verificación alcanzado. Espera 1 hora antes de intentar nuevamente.');
                }
                
                // Si es un error crítico, lanzar el error para que el registro falle
                if (emailError.message.includes('marcado como verificado incorrectamente')) {
                    throw emailError;
                }
                
                // Para otros errores, continuar pero marcar como problema
                console.log('⚠️ Continuando con el registro sin email de verificación');
            }
            
            // Verificar si es el primer usuario (simplificado para evitar errores de Firestore)
            const db = getFirestore(this.app);
            
            // Por ahora, asumir que no es el primer usuario para evitar errores de permisos
            // TODO: Implementar verificación más robusta en el futuro
            let isFirstUser = false;
            console.log('🏆 Asumiendo usuario comercial (verificación de primer usuario deshabilitada temporalmente)');
            
            // Crear perfil de usuario en Firestore
            const userProfile = {
                uid: user.uid,
                email: user.email,
                role: isFirstUser ? 'admin' : 'comercial', // Primer usuario = admin, resto = comercial
                name: user.displayName || email.split('@')[0],
                createdAt: new Date().toISOString(),
                isFirstUser: isFirstUser,
                active: true,
                emailVerified: user.emailVerified
            };
            
            // Esperar un poco más para asegurar que la autenticación esté completamente establecida
            console.log('⏳ Esperando estabilización de autenticación...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            try {
                console.log('🔄 Intentando crear perfil en Firestore...');
                console.log('👤 UID del usuario:', user.uid);
                console.log('📄 Datos del perfil:', userProfile);
                
                await setDoc(doc(db, 'users', user.uid), userProfile);
                console.log('✅ Perfil de usuario creado en Firestore');
            } catch (firestoreError) {
                console.error('❌ Error creando perfil en Firestore:', firestoreError);
                console.error('🔍 Código de error:', firestoreError.code);
                console.error('📝 Mensaje:', firestoreError.message);
                
                // Intentar una vez más después de un delay adicional
                try {
                    console.log('🔄 Reintentando creación de perfil...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await setDoc(doc(db, 'users', user.uid), userProfile);
                    console.log('✅ Perfil de usuario creado en Firestore (segundo intento)');
                } catch (retryError) {
                    console.error('❌ Error en segundo intento:', retryError);
                    // No lanzar error aquí, el usuario ya está creado en Auth
                    // El perfil se creará después cuando el usuario inicie sesión
                }
            }
            
            // Verificar que el usuario esté correctamente autenticado
            console.log('🔍 Verificando estado de autenticación...');
            const currentUser = this.auth.currentUser;
            if (currentUser && currentUser.uid === user.uid) {
                console.log('✅ Usuario correctamente autenticado');
            } else {
                console.warn('⚠️ Usuario no está autenticado después del registro');
            }
            
            console.log('✅ Usuario registrado:', user.email, 'Rol:', userProfile.role);
            return user;
        } catch (error) {
            console.error('❌ Error en registro:', error);
            console.error('🔍 Código de error:', error.code);
            console.error('📝 Mensaje:', error.message);
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
            
            console.log('🔄 Iniciando sesión para:', email);
            
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ Usuario logueado exitosamente:', user.email);
            console.log('👤 UID:', user.uid);
            console.log('📧 Email verificado:', user.emailVerified);
            console.log('🔍 Estado de autenticación:', this.auth.currentUser ? 'Autenticado' : 'No autenticado');
            
            // Verificar que el usuario esté correctamente autenticado
            if (this.auth.currentUser && this.auth.currentUser.uid === user.uid) {
                console.log('✅ Estado de autenticación verificado correctamente');
            } else {
                console.warn('⚠️ Problema con el estado de autenticación después del login');
            }
            
            return user;
        } catch (error) {
            console.error('❌ Error en login:', error);
            console.error('🔍 Código de error:', error.code);
            console.error('📝 Mensaje:', error.message);
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

    
        try {
            console.log('🔄 Iniciando login con Google...');
            
            const { signInWithPopup } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const { getFirestore, doc, setDoc, getDoc, collection, getDocs } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            console.log('🔓 Ejecutando signInWithPopup...');
            const result = await signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            console.log('✅ Autenticación exitosa para:', user.email);
            console.log('👤 Datos completos del usuario Google:');
            console.log('  - UID:', user.uid);
            console.log('  - Email:', user.email);
            console.log('  - Display Name:', user.displayName);
            console.log('  - Photo URL:', user.photoURL);
            console.log('  - Email Verified:', user.emailVerified);
            console.log('  - Provider Data:', user.providerData);
            console.log('  - Creation Time:', user.metadata.creationTime);
            console.log('  - Last Sign In:', user.metadata.lastSignInTime);
            
            // Inicializar Firestore
            console.log('🔥 Inicializando Firestore...');
            const db = getFirestore(this.app);
            
            try {
                // Verificar si el usuario ya existe en Firestore
                console.log('🔍 Verificando si existe perfil para UID:', user.uid);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                
                if (!userDoc.exists()) {
                    console.log('👤 Usuario no encontrado, creando perfil...');
                    
                    // Es un usuario nuevo, verificar si es el primer usuario
                    console.log('📊 Verificando si es el primer usuario...');
                    const usersCollection = collection(db, 'users');
                    const usersSnapshot = await getDocs(usersCollection);
                    const isFirstUser = usersSnapshot.empty;
                    console.log('🏆 ¿Es primer usuario?', isFirstUser);
                    
                    // Crear perfil de usuario en Firestore
                    const userProfile = {
                        uid: user.uid,
                        email: user.email,
                        role: isFirstUser ? 'admin' : 'comercial',
                        name: user.displayName || user.email.split('@')[0],
                        photoURL: user.photoURL || null,
                        createdAt: new Date().toISOString(),
                        isFirstUser: isFirstUser,
                        provider: 'google',
                        active: true
                    };
                    
                    console.log('💾 Creando perfil:', userProfile);
                    await setDoc(doc(db, 'users', user.uid), userProfile);
                    console.log('✅ Nuevo usuario Google creado:', user.email, 'Rol:', userProfile.role);
                } else {
                    console.log('✅ Usuario Google existente encontrado:', user.email);
                    console.log('📄 Perfil existente:', userDoc.data());
                }
                
            } catch (firestoreError) {
                console.error('❌ Error específico de Firestore:', firestoreError);
                console.log('⚠️ Continuando sin crear perfil - se intentará crear después');
                // No lanzar error aquí, permitir que el usuario se autentique
                // El perfil se creará después en la aplicación principal
            }
            
            return user;
        } catch (error) {
            console.error('❌ Error en login con Google:', error);
            
            // Logging detallado del error
            if (error.code) {
                console.log('🔍 Código de error:', error.code);
            }
            if (error.message) {
                console.log('📝 Mensaje de error:', error.message);
            }
            if (error.stack) {
                console.log('📚 Stack trace:', error.stack);
            }
            
            throw error;
        }
    }

    // Obtener perfil completo del usuario actual
    async getUserProfile() {
        if (!this.currentUser) {
            console.log('⚠️ No hay usuario autenticado para obtener perfil');
            return null;
        }

        try {
            const { getFirestore, doc, getDoc, setDoc, collection, getDocs } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            console.log('🔄 Obteniendo perfil para usuario:', this.currentUser.email);
            console.log('👤 UID:', this.currentUser.uid);
            
            const db = getFirestore(this.app);
            const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
            
            if (userDoc.exists()) {
                const profile = userDoc.data();
                console.log('✅ Perfil de usuario encontrado:', profile);
                return profile;
            } else {
                console.log('⚠️ No se encontró perfil para el usuario, creando uno...');
                
                // Crear perfil si no existe (simplificado para evitar errores de Firestore)
                let isFirstUser = false;
                console.log('🏆 Asumiendo usuario comercial (verificación de primer usuario deshabilitada temporalmente)');
                
                const userProfile = {
                    uid: this.currentUser.uid,
                    email: this.currentUser.email,
                    role: isFirstUser ? 'admin' : 'comercial',
                    name: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                    photoURL: this.currentUser.photoURL || null,
                    createdAt: new Date().toISOString(),
                    isFirstUser: isFirstUser,
                    provider: this.currentUser.providerData[0]?.providerId || 'email',
                    active: true,
                    emailVerified: this.currentUser.emailVerified
                };
                
                try {
                    console.log('🔄 Creando perfil de usuario:', userProfile);
                    await setDoc(doc(db, 'users', this.currentUser.uid), userProfile);
                    console.log('✅ Perfil de usuario creado exitosamente:', userProfile);
                    return userProfile;
                } catch (createError) {
                    console.error('❌ Error creando perfil:', createError);
                    console.error('🔍 Código de error:', createError.code);
                    console.error('📝 Mensaje:', createError.message);
                    return null;
                }
            }
        } catch (error) {
            console.error('❌ Error obteniendo perfil:', error);
            console.error('🔍 Código de error:', error.code);
            console.error('📝 Mensaje:', error.message);
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

    // Enviar email de verificación
    async sendEmailVerification() {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            const { sendEmailVerification } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            console.log('🔄 Enviando email de verificación a:', this.currentUser.email);
            console.log('👤 Usuario UID:', this.currentUser.uid);
            console.log('📧 Email verificado actualmente:', this.currentUser.emailVerified);
            console.log('🔍 Estado de autenticación:', this.auth.currentUser ? 'Autenticado' : 'No autenticado');
            
            // Verificar que el usuario esté correctamente autenticado
            if (!this.auth.currentUser || this.auth.currentUser.uid !== this.currentUser.uid) {
                throw new Error('Usuario no está correctamente autenticado');
            }
            
            // Configurar actionCodeSettings para el email de verificación
            const actionCodeSettings = {
                url: window.location.origin + '/index.html?verified=true',
                handleCodeInApp: false,
            };
            
            console.log('🔧 Configuración de email:', actionCodeSettings);
            
            // Llamar al método de Firebase Auth
            await sendEmailVerification(this.currentUser, actionCodeSettings);
            console.log('✅ Email de verificación enviado exitosamente');
            
            // Verificar que el email se envió correctamente
            console.log('🔍 Verificando estado después del envío...');
            await this.reloadUser();
            const updatedUser = this.getCurrentUser();
            if (updatedUser) {
                console.log('📧 Estado del email después del envío:', updatedUser.emailVerified);
            }
            
        } catch (error) {
            console.error('❌ Error enviando email de verificación:', error);
            console.error('🔍 Código de error:', error.code);
            console.error('📝 Mensaje:', error.message);
            
            // Proporcionar información específica sobre el error
            if (error.code === 'auth/too-many-requests') {
                throw new Error('Demasiados intentos de verificación. Inténtalo más tarde');
            } else if (error.code === 'auth/user-not-found') {
                throw new Error('Usuario no encontrado');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Email inválido');
            } else if (error.code === 'auth/network-request-failed') {
                throw new Error('Error de conexión. Verifica tu internet');
            }
            
            throw error;
        }
    }

    // Recargar usuario (para verificar estado de email)
    async reloadUser() {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            const { reload } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            console.log('🔄 Recargando usuario:', this.currentUser.email);
            console.log('📧 Estado antes del reload:', this.currentUser.emailVerified);
            
            await reload(this.currentUser);
            
            // Actualizar la referencia del usuario actual
            this.currentUser = this.auth.currentUser;
            
            console.log('✅ Usuario recargado exitosamente');
            console.log('📧 Estado después del reload:', this.currentUser?.emailVerified);
            
        } catch (error) {
            console.error('❌ Error recargando usuario:', error);
            console.error('🔍 Código de error:', error.code);
            console.error('📝 Mensaje:', error.message);
            throw error;
        }
    }

    // Enviar email de recuperación de contraseña
    async sendPasswordResetEmail(email) {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado');
        }

        try {
            const { sendPasswordResetEmail } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            await sendPasswordResetEmail(this.auth, email);
            console.log('✅ Email de recuperación enviado a:', email);
        } catch (error) {
            console.error('❌ Error enviando email de recuperación:', error);
            throw error;
        }
    }

    // Obtener todos los usuarios (solo para administradores)
    async getAllUsers() {
        if (!this.currentUser) {
            throw new Error('Usuario no autenticado');
        }

        try {
            // Verificar que el usuario actual es administrador
            const currentProfile = await this.getUserProfile();
            if (!currentProfile || currentProfile.role !== 'admin') {
                throw new Error('Acceso denegado: Solo los administradores pueden ver la lista de usuarios');
            }

            const { getFirestore, collection, getDocs } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const db = getFirestore(this.app);
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            
            const users = [];
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                users.push({
                    id: doc.id,
                    ...userData,
                    // Ocultar información sensible
                    password: undefined
                });
            });

            console.log(`📋 Obtenidos ${users.length} usuarios para administración`);
            return users;
        } catch (error) {
            console.error('❌ Error obteniendo usuarios:', error);
            throw error;
        }

    // === GOOGLE LOGIN CON MEJORES PRÁCTICAS ===
    
    // Login con Google - Versión Mejorada
    async loginWithGoogle() {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado');
        }

        try {
            console.log('🔄 Iniciando login con Google (mejores prácticas)...');
            
            const { signInWithPopup } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            console.log('🔓 Ejecutando signInWithPopup con configuración optimizada...');
            const result = await signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            
            // Capturar TODOS los datos disponibles de Google
            const googleUserData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
                providerId: user.providerData[0]?.providerId,
                googleUid: user.providerData[0]?.uid,
                provider: 'google',
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString()
            };
            
            console.log('👤 Datos completos capturados de Google:');
            console.log('  - UID:', googleUserData.uid);
            console.log('  - Email:', googleUserData.email);
            console.log('  - Display Name:', googleUserData.displayName);
            console.log('  - Photo URL:', googleUserData.photoURL);
            console.log('  - Email Verified:', googleUserData.emailVerified);
            console.log('  - Google UID:', googleUserData.googleUid);
            console.log('  - Provider:', googleUserData.provider);
            console.log('  - Creation Time:', googleUserData.creationTime);
            console.log('  - Last Sign In:', googleUserData.lastSignInTime);
            
            // Validar datos capturados
            await this.validateGoogleUserData(googleUserData);
            
            // Crear o actualizar perfil en Firestore
            const userProfile = await this.createGoogleUserProfile(googleUserData);
            
            return user;
        } catch (error) {
            console.error('❌ Error en login con Google:', error);
            console.log('🔍 Código de error:', error.code);
            console.log('📝 Mensaje de error:', error.message);
            throw error;
        }
    }
    
    // Validar datos de usuario de Google
    async validateGoogleUserData(userData) {
        const errors = [];
        
        if (!userData.email) errors.push('Email requerido');
        if (!userData.displayName) errors.push('Nombre requerido');
        if (!userData.uid) errors.push('UID requerido');
        if (!userData.emailVerified) errors.push('Email no verificado');
        if (userData.providerId !== 'google.com') errors.push('Proveedor no es Google');
        
        if (errors.length > 0) {
            throw new Error(`Datos de Google inválidos: ${errors.join(', ')}`);
        }
        
        console.log('✅ Datos de Google validados correctamente');
        return true;
    }
    
    // Crear o actualizar perfil de usuario de Google
    async createGoogleUserProfile(userData) {
        const { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } = 
            await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const db = getFirestore(this.app);
        const userRef = doc(db, 'users', userData.uid);
        
        try {
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
                console.log('👤 Usuario nuevo, creando perfil completo...');
                
                // Verificar si es el primer usuario
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const isFirstUser = usersSnapshot.empty;
                
                const userProfile = {
                    // Datos de Google
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.displayName,
                    photoURL: userData.photoURL,
                    emailVerified: userData.emailVerified,
                    
                    // Metadatos
                    provider: userData.provider,
                    googleUid: userData.googleUid,
                    createdAt: userData.createdAt,
                    lastLoginAt: userData.lastLoginAt,
                    
                    // Configuración de la aplicación
                    role: isFirstUser ? 'admin' : 'comercial',
                    active: true,
                    isFirstUser: isFirstUser,
                    
                    // Preferencias por defecto
                    preferences: {
                        language: 'es',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    }
                };
                
                await setDoc(userRef, userProfile);
                console.log('✅ Perfil de Google creado:', userProfile);
                return userProfile;
                
            } else {
                console.log('👤 Usuario existente, actualizando datos...');
                
                // Actualizar datos que pueden haber cambiado
                await updateDoc(userRef, {
                    lastLoginAt: userData.lastLoginAt,
                    photoURL: userData.photoURL,
                    name: userData.displayName,
                    emailVerified: userData.emailVerified
                });
                
                const existingProfile = userDoc.data();
                console.log('✅ Perfil de Google actualizado:', existingProfile);
                return existingProfile;
            }
            
        } catch (firestoreError) {
            console.error('❌ Error específico de Firestore:', firestoreError);
            console.log('⚠️ Continuando sin crear perfil - se intentará crear después');
            return null;
        }
    }
    }
}

// Crear instancia global
window.authManager = new AuthManager();
