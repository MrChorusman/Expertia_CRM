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
            console.log('✅ Firebase Auth inicializado');
            
            // Configurar provider de Google
            this.googleProvider = new GoogleAuthProvider();
            
            // Configurar scopes y parámetros adicionales
            this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
            this.googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
            this.googleProvider.addScope('openid');
            
            // Configurar parámetros personalizados para popup
            this.googleProvider.setCustomParameters({
                'prompt': 'select_account',
                'include_granted_scopes': 'true',
                'access_type': 'online'
            });
            
            console.log('✅ Google Auth Provider configurado con scopes completos');
            console.log('📋 Scopes configurados: userinfo.email, userinfo.profile, openid');
            console.log('📋 Parámetros: prompt=select_account, include_granted_scopes=true, access_type=online');
            
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
            console.log('👤 Usuario autenticado:', user.email || 'Email no disponible');
            console.log('👤 UID:', user.uid);
            console.log('📧 Email verificado:', user.emailVerified);
            console.log('🔍 Proveedor:', user.providerData[0]?.providerId || 'email');
            console.log('📋 Datos completos del usuario en callback:', {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                providerData: user.providerData,
                metadata: user.metadata
            });
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

    // === AUTENTICACIÓN CON GOOGLE - SISTEMA ROBUSTO ===
    
    // Login con Google - Implementación robusta que evita duplicados
    async loginWithGoogle() {
        if (!this.isInitialized) {
            throw new Error('Firebase no está inicializado');
        }

        try {
            console.log('🔄 Iniciando autenticación con Google...');
            
            const { signInWithPopup } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // Ejecutar autenticación con Google
            console.log('🔓 Ejecutando signInWithPopup...');
            const result = await signInWithPopup(this.auth, this.googleProvider);
            console.log('📋 Resultado completo de signInWithPopup:', result);
            
            let user = result.user;
            console.log('👤 Usuario obtenido del resultado:', user);
            
            // Si el usuario del resultado es null, intentar obtenerlo del auth actual
            if (!user) {
                console.log('⚠️ Usuario null en resultado, verificando auth.currentUser...');
                user = this.auth.currentUser;
                console.log('👤 Usuario desde auth.currentUser:', user);
                
                // Esperar un poco para que se actualice el estado
                if (!user) {
                    console.log('⏳ Esperando actualización del estado de autenticación...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    user = this.auth.currentUser;
                    console.log('👤 Usuario después de esperar:', user);
                }
            }
            
            // Si tenemos usuario pero le faltan datos, intentar recargarlo
            if (user && !user.email) {
                console.log('⚠️ Usuario disponible pero sin email, intentando recargar datos...');
                try {
                    await user.reload();
                    console.log('🔄 Usuario recargado, verificando datos nuevamente...');
                    console.log('👤 Datos después de reload:', {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        emailVerified: user.emailVerified,
                        providerData: user.providerData
                    });
                } catch (reloadError) {
                    console.error('❌ Error recargando usuario:', reloadError);
                }
            }
            
            // Verificar datos del usuario paso a paso
            if (!user) {
                console.error('❌ Usuario es null o undefined incluso después de verificaciones');
                throw new Error('No se pudo obtener el usuario de Google - resultado nulo');
            }
            
            // Intentar obtener email de diferentes fuentes
            let userEmail = user.email;
            let userDisplayName = user.displayName;
            
            if (!userEmail && user.providerData && user.providerData.length > 0) {
                console.log('⚠️ Email principal no disponible, buscando en providerData...');
                const googleProvider = user.providerData.find(provider => provider.providerId === 'google.com');
                if (googleProvider) {
                    userEmail = googleProvider.email;
                    userDisplayName = userDisplayName || googleProvider.displayName;
                    console.log('✅ Datos obtenidos de providerData:', {
                        email: userEmail,
                        displayName: userDisplayName
                    });
                }
            }
            
            if (!userEmail) {
                console.error('❌ No se pudo obtener email de ninguna fuente');
                console.log('📋 Datos disponibles del usuario:', {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    providerData: user.providerData
                });
                throw new Error('No se pudo obtener el email del usuario de Google');
            }
            
            // Actualizar referencias del usuario con los datos obtenidos
            const processedUser = {
                ...user,
                email: userEmail,
                displayName: userDisplayName
            };
            
            console.log('✅ Autenticación con Google exitosa:', userEmail);
            console.log('👤 UID:', user.uid);
            console.log('📧 Email:', userEmail);
            console.log('👤 Nombre:', userDisplayName);
            console.log('🖼️ Foto:', user.photoURL);
            console.log('✅ Email verificado:', user.emailVerified);
            
            // Crear o actualizar perfil de usuario de manera robusta
            const userProfile = await this.handleGoogleUserProfile(processedUser);
            
            if (!userProfile) {
                throw new Error('No se pudo crear o actualizar el perfil del usuario');
            }
            
            console.log('✅ Perfil de usuario procesado correctamente');
            return processedUser;
            
        } catch (error) {
            console.error('❌ Error en autenticación con Google:', error);
            
            // Mensajes de error más específicos
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('Login cancelado por el usuario');
            } else if (error.code === 'auth/popup-blocked') {
                throw new Error('Popup bloqueado. Permite ventanas emergentes para este sitio');
            } else if (error.code === 'auth/network-request-failed') {
                throw new Error('Error de conexión. Verifica tu internet');
            } else if (error.code === 'auth/too-many-requests') {
                throw new Error('Demasiados intentos. Inténtalo más tarde');
            }
            
            throw error;
        }
    }
    
    // Procesar perfil de usuario de Google de manera robusta
    async handleGoogleUserProfile(user) {
        const { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } = 
            await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const db = getFirestore(this.app);
        
        try {
            // PASO 1: Verificar si ya existe un usuario con este UID
            console.log('🔍 Verificando usuario por UID:', user.uid);
            const userByUidRef = doc(db, 'users', user.uid);
            const userByUidDoc = await getDoc(userByUidRef);
            
            if (userByUidDoc.exists()) {
                // Usuario existente - actualizar datos
                console.log('👤 Usuario existente encontrado, actualizando datos...');
                const existingData = userByUidDoc.data();
                
                const updateData = {
                    lastLoginAt: new Date().toISOString(),
                    name: user.displayName || existingData.name,
                    photoURL: user.photoURL || existingData.photoURL,
                    emailVerified: user.emailVerified,
                    provider: this.mergeProviders(existingData.provider, 'google')
                };
                
                await setDoc(userByUidRef, updateData, { merge: true });
                console.log('✅ Datos del usuario actualizados');
                
                return { ...existingData, ...updateData };
            }
            
            // PASO 2: Verificar si existe un usuario con el mismo email pero diferente UID
            console.log('🔍 Verificando usuario por email:', user.email);
            const usersCollection = collection(db, 'users');
            const emailQuery = query(usersCollection, where('email', '==', user.email));
            const emailQuerySnapshot = await getDocs(emailQuery);
            
            if (!emailQuerySnapshot.empty) {
                // CASO CRÍTICO: Usuario con mismo email pero diferente UID
                console.warn('⚠️ CONFLICTO: Usuario con mismo email pero diferente UID detectado');
                
                const existingUserDoc = emailQuerySnapshot.docs[0];
                const existingData = existingUserDoc.data();
                const existingUid = existingUserDoc.id;
                
                console.log('📋 Usuario existente:', {
                    uid: existingUid,
                    email: existingData.email,
                    provider: existingData.provider
                });
                
                console.log('📋 Usuario de Google:', {
                    uid: user.uid,
                    email: user.email,
                    provider: 'google'
                });
                
                // Por seguridad, usar el usuario existente y actualizar sus datos
                console.log('🔄 Actualizando usuario existente con datos de Google...');
                
                const mergedData = {
                    ...existingData,
                    name: user.displayName || existingData.name,
                    photoURL: user.photoURL || existingData.photoURL,
                    emailVerified: user.emailVerified || existingData.emailVerified,
                    lastLoginAt: new Date().toISOString(),
                    provider: this.mergeProviders(existingData.provider, 'google'),
                    googleUid: user.uid // Guardar el UID de Google como referencia
                };
                
                await setDoc(doc(db, 'users', existingUid), mergedData);
                console.log('✅ Usuario existente actualizado con datos de Google');
                
                return mergedData;
            }
            
            // PASO 3: Usuario completamente nuevo - crear perfil
            console.log('👤 Usuario nuevo, creando perfil...');
            
            // Verificar si es el primer usuario del sistema
            const allUsersSnapshot = await getDocs(usersCollection);
            const isFirstUser = allUsersSnapshot.empty;
            
            const newUserProfile = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || this.extractNameFromEmail(user.email),
                photoURL: user.photoURL || null,
                emailVerified: user.emailVerified || false,
                
                // Metadatos del sistema
                role: isFirstUser ? 'admin' : 'comercial',
                active: true,
                isFirstUser: isFirstUser,
                provider: 'google',
                
                // Timestamps
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                
                // Configuración por defecto
                preferences: {
                    language: 'es',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    theme: 'light'
                }
            };
            
            await setDoc(userByUidRef, newUserProfile);
            console.log('✅ Nuevo usuario creado:', newUserProfile);
            
            return newUserProfile;
            
        } catch (error) {
            console.error('❌ Error procesando perfil de usuario:', error);
            
            // Manejar errores específicos de permisos
            if (error.code === 'permission-denied') {
                console.error('🚨 Error de permisos de Firestore');
                console.error('💡 Solución: Verificar reglas de Firestore');
                console.error('📋 Usuario actual:', user.uid);
                console.error('📋 Email:', user.email);
                
                // Intentar crear un perfil básico local
                console.log('🔄 Creando perfil básico sin Firestore...');
                return {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || this.extractNameFromEmail(user.email),
                    photoURL: user.photoURL || null,
                    emailVerified: user.emailVerified || false,
                    provider: 'google',
                    role: 'comercial', // Por defecto comercial hasta que se resuelvan los permisos
                    active: true,
                    createdAt: new Date().toISOString(),
                    lastLoginAt: new Date().toISOString(),
                    _localProfile: true // Marcar como perfil local temporal
                };
            }
            
            throw new Error(`Error procesando perfil: ${error.message}`);
        }
    }
    
    // Función auxiliar para combinar proveedores
    mergeProviders(existingProvider, newProvider) {
        if (!existingProvider) return newProvider;
        if (existingProvider === newProvider) return existingProvider;
        
        // Si son diferentes, crear un array o string combinado
        if (typeof existingProvider === 'string') {
            return existingProvider.includes(newProvider) ? existingProvider : `${existingProvider},${newProvider}`;
        }
        
        return `${existingProvider},${newProvider}`;
    }
    
    // Función auxiliar para extraer nombre del email
    extractNameFromEmail(email) {
        const localPart = email.split('@')[0];
        return localPart.charAt(0).toUpperCase() + localPart.slice(1);
    }
    
    // Función de diagnóstico para debugging de Google Auth
    async diagnoseGoogleAuth() {
        console.log('🔍 DIAGNÓSTICO DE GOOGLE AUTH');
        console.log('===============================');
        
        console.log('📋 Estado de AuthManager:');
        console.log('  - Inicializado:', this.isInitialized);
        console.log('  - Usuario actual:', this.currentUser?.email || 'No disponible');
        console.log('  - UID actual:', this.currentUser?.uid || 'No disponible');
        
        console.log('📋 Estado de Firebase Auth:');
        console.log('  - Auth instance:', !!this.auth);
        console.log('  - Current user:', this.auth.currentUser?.email || 'No disponible');
        console.log('  - UID:', this.auth.currentUser?.uid || 'No disponible');
        
        console.log('📋 Google Provider:');
        console.log('  - Provider configurado:', !!this.googleProvider);
        console.log('  - Scopes:', this.googleProvider?.scopes || 'No disponible');
        console.log('  - Custom parameters:', this.googleProvider?.customParameters || 'No disponible');
        
        if (this.auth.currentUser) {
            console.log('📋 Datos completos del usuario actual:');
            const user = this.auth.currentUser;
            console.log('  - UID:', user.uid);
            console.log('  - Email:', user.email);
            console.log('  - Display Name:', user.displayName);
            console.log('  - Photo URL:', user.photoURL);
            console.log('  - Email Verified:', user.emailVerified);
            console.log('  - Provider Data:', user.providerData);
            console.log('  - Metadata:', user.metadata);
        }
        
        return {
            isInitialized: this.isInitialized,
            hasCurrentUser: !!this.currentUser,
            hasAuthCurrentUser: !!this.auth.currentUser,
            hasGoogleProvider: !!this.googleProvider,
            currentUserData: this.auth.currentUser ? {
                uid: this.auth.currentUser.uid,
                email: this.auth.currentUser.email,
                displayName: this.auth.currentUser.displayName,
                emailVerified: this.auth.currentUser.emailVerified
            } : null
        };
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

            const { getFirestore, collection, getDocs, orderBy, query } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const db = getFirestore(this.app);
            const usersCollection = collection(db, 'users');
            // Mismo orden que archive/tools/query-support-logs.mjs (--user-index)
            const usersQuery = query(usersCollection, orderBy('createdAt', 'desc'));
            const usersSnapshot = await getDocs(usersQuery);
            
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
    }
}

// Crear instancia global
window.authManager = new AuthManager();
