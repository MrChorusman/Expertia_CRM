// ===============================
// Configuración de Firebase para Expertia CRM
//
// Este archivo solo expone la configuración y el appId globalmente.
// NO debe contener imports ES6 ni inicialización de Firebase.
//
// La inicialización y exportación de funciones de Firebase debe hacerse en un <script type="module"> en index.html.
// ===============================

const firebaseConfig = {
  apiKey: window.ENV?.FIREBASE_API_KEY || "demo-api-key",
  authDomain: window.ENV?.FIREBASE_AUTH_DOMAIN || "expertia-crm-demo.firebaseapp.com",
  databaseURL: window.ENV?.FIREBASE_DATABASE_URL || "https://expertia-crm-demo.firebaseio.com",
  projectId: window.ENV?.FIREBASE_PROJECT_ID || "expertia-crm-demo",
  storageBucket: window.ENV?.FIREBASE_STORAGE_BUCKET || "expertia-crm-demo.appspot.com",
  messagingSenderId: window.ENV?.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: window.ENV?.FIREBASE_APP_ID || "1:123456789:web:demo-app-id"
};

// ID único de la aplicación para organizar datos
const appId = window.ENV?.FIREBASE_APP_ID || 'expertia-crm-demo';

// Exportar configuración
window.__firebase_config = JSON.stringify(firebaseConfig);
window.__app_id = appId;

