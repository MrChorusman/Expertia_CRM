#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔥 Verificando conexión a Firebase...\n');

// Función para ejecutar comandos de Firebase CLI
function runFirebaseCommand(command, args = []) {
    return new Promise((resolve, reject) => {
        console.log(`📡 Ejecutando: firebase ${command} ${args.join(' ')}`);
        
        const firebase = spawn('firebase', [command, ...args], {
            stdio: ['inherit', 'pipe', 'pipe']
        });
        
        let output = '';
        let error = '';
        
        firebase.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        firebase.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        firebase.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Error code ${code}: ${error}`));
            }
        });
    });
}

async function testConnection() {
    try {
        console.log('1. Verificando autenticación...');
        const whoami = await runFirebaseCommand('login:list');
        console.log('✅ Usuario autenticado:', whoami.trim());
        
        console.log('\n2. Verificando proyecto actual...');
        const project = await runFirebaseCommand('use');
        console.log('✅ Proyecto activo:', project.trim());
        
        console.log('\n3. Verificando servicios de Firestore...');
        const projects = await runFirebaseCommand('projects:list');
        console.log('✅ Lista de proyectos disponibles');
        
        console.log('\n4. Intentando consultar Firestore...');
        // Usar Firebase CLI para hacer una consulta básica
        const firestoreQuery = await runFirebaseCommand('firestore:query', [
            'system_settings', 
            '--limit', '5'
        ]);
        
        console.log('✅ Consulta exitosa a system_settings:');
        console.log(firestoreQuery);
        
    } catch (error) {
        console.error('❌ Error en la conexión:', error.message);
        
        // Si la consulta directa falla, intentamos con otro enfoque
        console.log('\n🔄 Intentando método alternativo...');
        try {
            await createWebSDKQuery();
        } catch (altError) {
            console.error('❌ Método alternativo también falló:', altError.message);
        }
    }
}

async function createWebSDKQuery() {
    console.log('📝 Creando consulta con Web SDK...');
    
    const queryScript = `
// Script para consultar system_settings usando Web SDK con emulador
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';

// Configuración de Firebase (desde firebase-config.js)
const firebaseConfig = {
    apiKey: "AIzaSyDKE8cGmROdOxMVpgEFKmBV5wRQfrQ7F_k",
    authDomain: "expertiacrm-7e7eb.firebaseapp.com",
    projectId: "expertiacrm-7e7eb",
    storageBucket: "expertiacrm-7e7eb.appspot.com",
    messagingSenderId: "590787102287",
    appId: "1:590787102287:web:8c5f9bb7e1f8a5a8b8b8a8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function querySystemSettings() {
    try {
        console.log('🔍 Consultando system_settings...');
        
        const settingsRef = collection(db, 'system_settings');
        const snapshot = await getDocs(settingsRef);
        
        if (snapshot.empty) {
            console.log('⚠️ No se encontraron documentos en system_settings');
            return;
        }
        
        console.log(\`✅ Se encontraron \${snapshot.size} documento(s):\`);
        snapshot.forEach((doc) => {
            console.log(\`📄 ID: \${doc.id}\`);
            console.log('📝 Datos:', JSON.stringify(doc.data(), null, 2));
            console.log('---');
        });
        
    } catch (error) {
        console.error('❌ Error al consultar:', error);
        console.log('💡 Sugerencia: Verifica que las reglas de Firestore permitan la lectura');
    }
}

querySystemSettings();
`;

    // Escribir el script como archivo temporal
    fs.writeFileSync('/tmp/firebase-web-query.mjs', queryScript);
    console.log('✅ Script creado en /tmp/firebase-web-query.mjs');
    
    // Ejecutar el script
    const node = spawn('node', ['/tmp/firebase-web-query.mjs'], {
        stdio: ['inherit', 'pipe', 'pipe']
    });
    
    return new Promise((resolve, reject) => {
        let output = '';
        let error = '';
        
        node.stdout.on('data', (data) => {
            output += data.toString();
            console.log(data.toString());
        });
        
        node.stderr.on('data', (data) => {
            error += data.toString();
            console.error(data.toString());
        });
        
        node.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Node error code ${code}: ${error}`));
            }
        });
    });
}

// Ejecutar la prueba
testConnection();
