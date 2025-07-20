// Configuración de Firebase para Expertia CRM
// Este archivo debe ser configurado con tus credenciales reales de Firebase

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "expertia-crm.firebaseapp.com",
    projectId: "expertia-crm",
    storageBucket: "expertia-crm.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};

// ID único de la aplicación para organizar datos
const appId = 'expertia-crm-production';

// Exportar configuración
window.__firebase_config = JSON.stringify(firebaseConfig);
window.__app_id = appId;
