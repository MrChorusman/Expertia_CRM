// ===============================
// Configuración de Firebase para Expertia CRM
//
// Este archivo solo expone la configuración y el appId globalmente.
// NO debe contener imports ES6 ni inicialización de Firebase.
//
// La inicialización y exportación de funciones de Firebase debe hacerse en un <script type="module"> en index.html.
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyBvxsbp8Lo8bGWK5sbEDC3RN-01Gfj0jFY",
  authDomain: "expertiacrm-7e7eb.firebaseapp.com",
  databaseURL: "https://expertiacrm-7e7eb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expertiacrm-7e7eb",
  storageBucket: "expertiacrm-7e7eb.firebasestorage.app",
  messagingSenderId: "730578427970",
  appId: "1:730578427970:web:d9a14fc298b786ba53cddb"
};

// ID único de la aplicación para organizar datos
const appId = 'expertiacrm-7e7eb';

// Exportar configuración
window.__firebase_config = JSON.stringify(firebaseConfig);
window.__app_id = appId;

