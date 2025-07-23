#!/usr/bin/env node

/**
 * Script para consultar la tabla /system_settings usando Firebase Web SDK
 * Uso: node firebase-query.js
 */

// Importar Firebase usando require (compatible con Node.js)
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

// Configuración de Firebase - La misma que usa tu aplicación web
const firebaseConfig = {
    apiKey: "AIzaSyBj_3P7GdlbMKmyRIQ2d8cT6vTzJ6FnCsw",
    authDomain: "expertia-crm-1e6cd.firebaseapp.com",
    projectId: "expertia-crm-1e6cd",
    storageBucket: "expertia-crm-1e6cd.firebasestorage.app",
    messagingSenderId: "334649159334",
    appId: "1:334649159334:web:ba6d5de832e8cee2b3b2d8",
    measurementId: "G-9WL8P9TK7Z"
};

// Función para formatear fecha
function formatDate(timestamp) {
    if (!timestamp) return 'No disponible';
    
    try {
        let date;
        if (timestamp.seconds && timestamp.nanoseconds !== undefined) {
            // Firestore Timestamp
            date = new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000));
        } else if (timestamp._seconds) {
            // Firestore Timestamp alternative format
            date = new Date(timestamp._seconds * 1000);
        } else {
            // Regular timestamp o string
            date = new Date(timestamp);
        }
        
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Europe/Madrid'
        });
    } catch (error) {
        return `Fecha inválida: ${String(timestamp)}`;
    }
}

// Función para formatear objetos de manera legible
function formatObject(obj, indent = 0, maxDepth = 3) {
    const spaces = '  '.repeat(indent);
    
    if (indent > maxDepth) {
        return '[Objeto anidado...]';
    }
    
    if (obj === null || obj === undefined) {
        return 'null';
    }
    
    if (typeof obj === 'string') {
        return `"${obj}"`;
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
        return String(obj);
    }
    
    // Manejar timestamps de Firestore
    if (obj && typeof obj === 'object' && (obj.seconds !== undefined || obj._seconds !== undefined)) {
        return `"${formatDate(obj)}"`;
    }
    
    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        if (obj.length === 1) return `[${formatObject(obj[0], 0, maxDepth)}]`;
        
        let result = '[\n';
        obj.forEach((item, index) => {
            result += `${spaces}  ${formatObject(item, indent + 1, maxDepth)}`;
            if (index < obj.length - 1) result += ',';
            result += '\n';
        });
        result += `${spaces}]`;
        return result;
    }
    
    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';
        
        let result = '{\n';
        keys.forEach((key, index) => {
            const value = obj[key];
            result += `${spaces}  "${key}": ${formatObject(value, indent + 1, maxDepth)}`;
            if (index < keys.length - 1) result += ',';
            result += '\n';
        });
        result += `${spaces}}`;
        
        return result;
    }
    
    return String(obj);
}

// Función para extraer valor simple de objetos Firestore
function extractValue(obj) {
    if (!obj) return obj;
    
    // Si es un timestamp de Firestore
    if (obj.seconds !== undefined || obj._seconds !== undefined) {
        return formatDate(obj);
    }
    
    // Si es un objeto simple, devolver como está
    return obj;
}

// Función principal para consultar system_settings
async function querySystemSettings() {
    try {
        console.log('🔥 Iniciando consulta a Firebase con Web SDK...\n');
        
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        console.log('📊 Consultando tabla /system_settings...\n');
        
        // Intentar obtener el documento principal 'main'
        const mainDocRef = doc(db, 'system_settings', 'main');
        const mainDoc = await getDoc(mainDocRef);
        
        if (mainDoc.exists()) {
            console.log('✅ Documento /system_settings/main encontrado\n');
            
            const data = mainDoc.data();
            
            // Mostrar datos completos
            console.log('📋 DATOS COMPLETOS EN JSON:');
            console.log('='.repeat(80));
            console.log(JSON.stringify(data, null, 2));
            console.log('='.repeat(80));
            
            // Resumen estructurado y legible
            console.log('\n📊 RESUMEN ESTRUCTURADO:');
            console.log('='.repeat(60));
            
            if (data.company) {
                console.log('\n🏢 INFORMACIÓN DE EMPRESA:');
                Object.entries(data.company).forEach(([key, value]) => {
                    console.log(`  • ${key}: ${extractValue(value) || 'No especificado'}`);
                });
            }
            
            if (data.security) {
                console.log('\n🔒 CONFIGURACIÓN DE SEGURIDAD:');
                Object.entries(data.security).forEach(([key, value]) => {
                    const displayValue = typeof value === 'boolean' ? (value ? 'Activado' : 'Desactivado') : extractValue(value);
                    console.log(`  • ${key}: ${displayValue || 'No especificado'}`);
                });
            }
            
            if (data.notifications) {
                console.log('\n🔔 CONFIGURACIÓN DE NOTIFICACIONES:');
                Object.entries(data.notifications).forEach(([key, value]) => {
                    const displayValue = typeof value === 'boolean' ? (value ? 'Activado' : 'Desactivado') : extractValue(value);
                    console.log(`  • ${key}: ${displayValue || 'No especificado'}`);
                });
            }
            
            if (data.integrations) {
                console.log('\n🔌 INTEGRACIONES:');
                Object.entries(data.integrations).forEach(([key, value]) => {
                    const displayValue = typeof value === 'boolean' ? (value ? 'Activado' : 'Desactivado') : extractValue(value);
                    console.log(`  • ${key}: ${displayValue || 'No especificado'}`);
                });
            }
            
            // Metadata siempre presente
            console.log('\n📋 METADATA:');
            if (data.updatedAt) console.log(`  • Última actualización: ${extractValue(data.updatedAt)}`);
            if (data.updatedBy) console.log(`  • Actualizado por: ${data.updatedBy}`);
            if (data.version) console.log(`  • Versión: ${data.version}`);
            if (data.createdAt) console.log(`  • Creado: ${extractValue(data.createdAt)}`);
            
            // Estadísticas
            const sectionCount = ['company', 'security', 'notifications', 'integrations'].filter(section => data[section]).length;
            console.log(`\n📈 ESTADÍSTICAS:`);
            console.log(`  • Secciones configuradas: ${sectionCount}/4`);
            console.log(`  • Total de campos: ${Object.keys(data).length}`);
            
        } else {
            console.log('❌ No se encontró el documento /system_settings/main\n');
        }
        
        // Buscar todos los documentos en la colección
        console.log('🔍 Buscando todos los documentos en /system_settings...\n');
        
        const collectionRef = collection(db, 'system_settings');
        const snapshot = await getDocs(collectionRef);
        
        if (snapshot.empty) {
            console.log('❌ La colección /system_settings está completamente vacía');
        } else {
            console.log(`📋 Encontrados ${snapshot.size} documento(s) en total:\n`);
            
            snapshot.forEach((doc, index) => {
                console.log(`📄 Documento ${index + 1}: ID = "${doc.id}"`);
                console.log(`   Tamaño: ${Object.keys(doc.data()).length} campos`);
                
                // Mostrar primeros campos para preview
                const data = doc.data();
                const firstKeys = Object.keys(data).slice(0, 3);
                if (firstKeys.length > 0) {
                    console.log(`   Preview: ${firstKeys.map(key => `${key}: ${typeof data[key]}`).join(', ')}`);
                }
                
                console.log('');
            });
        }
        
        console.log('\n✅ Consulta completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error consultando system_settings:', error.message);
        
        if (error.code) {
            console.log(`\n🔍 Código de error: ${error.code}`);
        }
        
        if (error.code === 'permission-denied') {
            console.log('\n🔒 PROBLEMA DE PERMISOS:');
            console.log('Las reglas de seguridad de Firestore no permiten esta consulta.');
            console.log('Opciones:');
            console.log('1. Autenticarte primero con un usuario válido');
            console.log('2. Modificar las reglas de Firestore para permitir lectura');
            console.log('3. Usar Firebase Admin SDK con credenciales de servicio');
        }
        
        process.exit(1);
    }
}

// Función para mostrar ayuda
function showHelp() {
    console.log(`
🔥 Firebase System Settings Query Tool (Web SDK)
===============================================

Uso: node firebase-query.js [opciones]

Opciones:
  --help, -h     Mostrar esta ayuda
  --json         Solo mostrar JSON sin formato
  --summary      Solo mostrar resumen

Ejemplos:
  node firebase-query.js                     # Consulta completa
  node firebase-query.js --json             # Solo JSON
  node firebase-query.js --summary          # Solo resumen

Nota: Este script usa Firebase Web SDK y está sujeto a las reglas de seguridad
      de Firestore. Puede requerir autenticación según tu configuración.
`);
}

// Manejar argumentos de línea de comandos  
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

// Ejecutar la consulta
console.log('🚀 Expertia CRM - Firebase Query Tool (Web SDK)');
console.log('==============================================\n');

querySystemSettings()
    .then(() => {
        console.log('\n🎉 Proceso completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Error fatal:', error.message);
        process.exit(1);
    });
