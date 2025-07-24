#!/usr/bin/env node

/**
 * Script para consultar la tabla /system_settings usando Firebase Admin SDK
 * Uso: node query-system-settings.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Configuración de Firebase - Reemplaza con tus credenciales
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
        if (timestamp._seconds) {
            // Firestore Timestamp
            date = new Date(timestamp._seconds * 1000);
        } else if (timestamp.seconds) {
            // Firestore Timestamp alternative format
            date = new Date(timestamp.seconds * 1000);
        } else {
            // Regular timestamp
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
        return 'Fecha inválida';
    }
}

// Función para formatear objetos de manera legible
function formatObject(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let result = '';
    
    if (obj === null || obj === undefined) {
        return 'null';
    }
    
    if (typeof obj !== 'object') {
        return String(obj);
    }
    
    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        result += '[\n';
        obj.forEach((item, index) => {
            result += `${spaces}  ${formatObject(item, indent + 1)}`;
            if (index < obj.length - 1) result += ',';
            result += '\n';
        });
        result += `${spaces}]`;
        return result;
    }
    
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    
    result += '{\n';
    keys.forEach((key, index) => {
        const value = obj[key];
        result += `${spaces}  ${key}: `;
        
        if (key.includes('At') && (value._seconds || value.seconds)) {
            result += `"${formatDate(value)}"`;
        } else {
            result += formatObject(value, indent + 1);
        }
        
        if (index < keys.length - 1) result += ',';
        result += '\n';
    });
    result += `${spaces}}`;
    
    return result;
}

// Función principal para consultar system_settings
async function querySystemSettings() {
    try {
        console.log('🔥 Iniciando consulta a Firebase...\n');
        
        // Inicializar Firebase Admin SDK
        if (!admin.apps.length) {
            // Para usar sin archivo de credenciales, usaremos la configuración web
            // En producción, deberías usar un service account key
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: firebaseConfig.projectId
            });
        }
        
        const db = admin.firestore();
        
        // Consultar el documento system_settings
        console.log('📊 Consultando tabla /system_settings...\n');
        
        const systemSettingsRef = db.collection('system_settings').doc('main');
        const doc = await systemSettingsRef.get();
        
        if (!doc.exists) {
            console.log('❌ No se encontró el documento /system_settings/main');
            console.log('\n🔍 Buscando otros documentos en la colección...\n');
            
            // Buscar todos los documentos en la colección
            const snapshot = await db.collection('system_settings').get();
            
            if (snapshot.empty) {
                console.log('❌ La colección /system_settings está vacía');
                return;
            }
            
            console.log(`📋 Encontrados ${snapshot.size} documento(s):\n`);
            
            snapshot.forEach(doc => {
                console.log(`📄 Documento ID: ${doc.id}`);
                console.log(`📅 Datos:`);
                console.log(formatObject(doc.data()));
                console.log('\n' + '='.repeat(60) + '\n');
            });
            
            return;
        }
        
        // Mostrar los datos del documento principal
        const data = doc.data();
        
        console.log('✅ Documento /system_settings/main encontrado\n');
        console.log('📋 CONTENIDO COMPLETO:');
        console.log('='.repeat(80));
        console.log(formatObject(data));
        console.log('='.repeat(80));
        
        // Resumen estructurado
        console.log('\n📊 RESUMEN ESTRUCTURADO:');
        console.log('='.repeat(50));
        
        if (data.company) {
            console.log('\n🏢 INFORMACIÓN DE EMPRESA:');
            console.log(`  • Nombre: ${data.company.name || 'No especificado'}`);
            console.log(`  • Dirección: ${data.company.address || 'No especificada'}`);
            console.log(`  • Teléfono: ${data.company.phone || 'No especificado'}`);
            console.log(`  • Email: ${data.company.email || 'No especificado'}`);
            console.log(`  • Website: ${data.company.website || 'No especificado'}`);
            console.log(`  • Logo: ${data.company.logo || 'No configurado'}`);
        }
        
        if (data.security) {
            console.log('\n🔒 CONFIGURACIÓN DE SEGURIDAD:');
            console.log(`  • Tiempo de sesión: ${data.security.sessionTimeout || 'No especificado'}`);
            console.log(`  • Verificación email: ${data.security.emailVerification ? 'Activada' : 'Desactivada'}`);
            console.log(`  • Intentos máx. login: ${data.security.maxLoginAttempts || 'No especificado'}`);
            console.log(`  • 2FA requerido: ${data.security.require2FA ? 'Sí' : 'No'}`);
        }
        
        if (data.notifications) {
            console.log('\n🔔 CONFIGURACIÓN DE NOTIFICACIONES:');
            console.log(`  • Email habilitado: ${data.notifications.emailEnabled ? 'Sí' : 'No'}`);
            console.log(`  • SMS habilitado: ${data.notifications.smsEnabled ? 'Sí' : 'No'}`);
            console.log(`  • Push habilitado: ${data.notifications.pushEnabled ? 'Sí' : 'No'}`);
            console.log(`  • Alertas sistema: ${data.notifications.systemAlerts ? 'Activadas' : 'Desactivadas'}`);
            console.log(`  • Alertas mantenimiento: ${data.notifications.maintenanceAlerts ? 'Activadas' : 'Desactivadas'}`);
        }
        
        if (data.integrations) {
            console.log('\n🔌 INTEGRACIONES:');
            console.log(`  • WhatsApp API: ${data.integrations.whatsappEnabled ? 'Activa' : 'Inactiva'}`);
            console.log(`  • SMTP configurado: ${data.integrations.smtpHost ? 'Sí' : 'No'}`);
            console.log(`  • Servidor SMTP: ${data.integrations.smtpHost || 'No configurado'}`);
            console.log(`  • Puerto SMTP: ${data.integrations.smtpPort || 'No configurado'}`);
        }
        
        // Metadata
        console.log('\n📋 METADATA:');
        console.log(`  • Última actualización: ${formatDate(data.updatedAt)}`);
        console.log(`  • Actualizado por: ${data.updatedBy || 'No especificado'}`);
        console.log(`  • Versión: ${data.version || 'No especificada'}`);
        
        console.log('\n✅ Consulta completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error consultando system_settings:', error);
        
        if (error.code === 'app/invalid-credential') {
            console.log('\n🔑 PROBLEMA DE AUTENTICACIÓN:');
            console.log('Para usar Firebase Admin SDK necesitas configurar las credenciales.');
            console.log('\nOpciones:');
            console.log('1. Configurar variable de entorno GOOGLE_APPLICATION_CREDENTIALS');
            console.log('2. Usar gcloud auth application-default login');
            console.log('3. Descargar service account key desde Firebase Console');
        }
        
        process.exit(1);
    }
}

// Función para mostrar ayuda
function showHelp() {
    console.log(`
🔥 Firebase System Settings Query Tool
=====================================

Uso: node query-system-settings.js [opciones]

Opciones:
  --help, -h     Mostrar esta ayuda
  --raw          Mostrar datos en formato JSON crudo
  --export       Exportar datos a archivo JSON

Ejemplos:
  node query-system-settings.js              # Consulta normal
  node query-system-settings.js --raw        # Formato JSON
  node query-system-settings.js --export     # Exportar a archivo

Configuración:
  Este script requiere Firebase Admin SDK configurado.
  Ver documentación en: https://firebase.google.com/docs/admin/setup
`);
}

// Manejar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

// Ejecutar la consulta
console.log('🚀 Expertia CRM - System Settings Query Tool');
console.log('============================================\n');

querySystemSettings()
    .then(() => {
        console.log('\n🎉 Proceso completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });
