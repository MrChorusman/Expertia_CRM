#!/usr/bin/env node

/**
 * Herramienta de Recuperación de Chat - Expertia CRM
 * Busca datos de chat en todas las colecciones de Firebase
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBj_3P7GdlbMKmyRIQ2d8cT6vTzJ6FnCsw",
    authDomain: "expertia-crm-1e6cd.firebaseapp.com",
    projectId: "expertia-crm-1e6cd",
    storageBucket: "expertia-crm-1e6cd.firebasestorage.app",
    messagingSenderId: "334649159334",
    appId: "1:334649159334:web:ba6d5de832e8cee2b3b2d8",
    measurementId: "G-9WL8P9TK7Z"
};

class ChatRecoveryTool {
    constructor() {
        this.app = null;
        this.db = null;
        this.chatKeywords = [
            'chat', 'mensaje', 'message', 'conversacion', 'conversation',
            'comentario', 'comment', 'nota', 'note', 'comunicacion',
            'whatsapp', 'telegram', 'sms', 'email_thread', 'thread'
        ];
    }

    async init() {
        try {
            this.app = initializeApp(firebaseConfig);
            this.db = getFirestore(this.app);
            console.log('🔥 Firebase inicializado correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error.message);
            return false;
        }
    }

    async scanAllCollections() {
        console.log('🔍 === ESCANEO COMPLETO DE COLECCIONES ===\n');
        
        const knownCollections = [
            'users', 'clientes', 'productos', 'facturas', 'ofertas', 
            'expenses', 'counters', 'settings', 'system_settings', 
            'configuracion', 'adminUsers'
        ];

        const foundCollections = [];
        const chatRelatedData = [];

        // Escanear colecciones conocidas
        for (const collectionName of knownCollections) {
            try {
                console.log(`📁 Escaneando colección: ${collectionName}`);
                const collectionRef = collection(this.db, collectionName);
                const snapshot = await getDocs(collectionRef);
                
                if (!snapshot.empty) {
                    foundCollections.push({
                        name: collectionName,
                        count: snapshot.size
                    });
                    
                    // Buscar datos relacionados con chat
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const chatFields = this.findChatFields(data, doc.id, collectionName);
                        if (chatFields.length > 0) {
                            chatRelatedData.push({
                                collection: collectionName,
                                documentId: doc.id,
                                fields: chatFields
                            });
                        }
                    });
                } else {
                    console.log(`   ⚠️  Colección vacía: ${collectionName}`);
                }
            } catch (error) {
                console.log(`   ❌ Error accediendo a ${collectionName}: ${error.message}`);
            }
        }

        return { foundCollections, chatRelatedData };
    }

    findChatFields(data, docId, collectionName) {
        const chatFields = [];
        
        const searchInObject = (obj, path = '') => {
            if (!obj || typeof obj !== 'object') return;
            
            Object.entries(obj).forEach(([key, value]) => {
                const currentPath = path ? `${path}.${key}` : key;
                
                // Buscar campos que contengan palabras clave de chat
                const isChatField = this.chatKeywords.some(keyword => 
                    key.toLowerCase().includes(keyword.toLowerCase())
                );
                
                if (isChatField) {
                    chatFields.push({
                        path: currentPath,
                        value: typeof value === 'string' ? value.substring(0, 100) : value,
                        type: typeof value
                    });
                }
                
                // Buscar en subobjetos
                if (typeof value === 'object' && value !== null) {
                    searchInObject(value, currentPath);
                }
            });
        };
        
        searchInObject(data);
        return chatFields;
    }

    async searchForHiddenChatCollections() {
        console.log('\n🔍 === BÚSQUEDA DE COLECCIONES OCULTAS ===\n');
        
        // Lista de posibles nombres de colecciones de chat
        const possibleChatCollections = [
            'chats', 'messages', 'mensajes', 'conversations', 'conversaciones',
            'communications', 'comunicaciones', 'threads', 'hilos',
            'chat_history', 'historial_chat', 'chat_logs', 'logs_chat',
            'support_chat', 'chat_soporte', 'customer_chat', 'chat_clientes',
            'internal_chat', 'chat_interno', 'team_chat', 'chat_equipo'
        ];

        const foundChatCollections = [];

        for (const collectionName of possibleChatCollections) {
            try {
                const collectionRef = collection(this.db, collectionName);
                const snapshot = await getDocs(collectionRef);
                
                if (!snapshot.empty) {
                    console.log(`✅ Encontrada colección de chat: ${collectionName} (${snapshot.size} documentos)`);
                    
                    foundChatCollections.push({
                        name: collectionName,
                        count: snapshot.size,
                        documents: snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: doc.data()
                        }))
                    });
                }
            } catch (error) {
                // Silenciar errores de colecciones que no existen
            }
        }

        return foundChatCollections;
    }

    async analyzeClientCommunications() {
        console.log('\n📞 === ANÁLISIS DE COMUNICACIONES CON CLIENTES ===\n');
        
        try {
            const clientesRef = collection(this.db, 'clientes');
            const snapshot = await getDocs(clientesRef);
            
            const communicationData = [];
            
            snapshot.forEach(doc => {
                const cliente = doc.data();
                const communications = [];
                
                // Buscar campos de comunicación
                if (cliente.email) communications.push({ type: 'email', value: cliente.email });
                if (cliente.telefono) communications.push({ type: 'telefono', value: cliente.telefono });
                if (cliente.whatsapp) communications.push({ type: 'whatsapp', value: cliente.whatsapp });
                if (cliente.notas) communications.push({ type: 'notas', value: cliente.notas });
                if (cliente.comentarios) communications.push({ type: 'comentarios', value: cliente.comentarios });
                
                // Buscar en recordatorios
                if (cliente.recordatorios) {
                    cliente.recordatorios.forEach(recordatorio => {
                        if (recordatorio.mensaje) {
                            communications.push({ 
                                type: 'recordatorio', 
                                value: recordatorio.mensaje,
                                fecha: recordatorio.fecha
                            });
                        }
                    });
                }
                
                if (communications.length > 0) {
                    communicationData.push({
                        clienteId: doc.id,
                        nombre: cliente.nombre || 'Sin nombre',
                        communications: communications
                    });
                }
            });
            
            return communicationData;
            
        } catch (error) {
            console.error('❌ Error analizando comunicaciones:', error.message);
            return [];
        }
    }

    async generateRecoveryReport() {
        console.log('📊 === GENERANDO REPORTE DE RECUPERACIÓN ===\n');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                chatCollectionsFound: 0,
                chatRelatedFields: 0,
                clientCommunications: 0
            },
            findings: {
                collections: [],
                chatData: [],
                hiddenCollections: [],
                communications: []
            },
            recommendations: []
        };

        // Escanear colecciones principales
        const { foundCollections, chatRelatedData } = await this.scanAllCollections();
        report.findings.collections = foundCollections;
        report.findings.chatData = chatRelatedData;
        report.summary.chatRelatedFields = chatRelatedData.length;

        // Buscar colecciones ocultas
        const hiddenCollections = await this.searchForHiddenChatCollections();
        report.findings.hiddenCollections = hiddenCollections;
        report.summary.chatCollectionsFound = hiddenCollections.length;

        // Analizar comunicaciones con clientes
        const communications = await this.analyzeClientCommunications();
        report.findings.communications = communications;
        report.summary.clientCommunications = communications.length;

        // Generar recomendaciones
        if (hiddenCollections.length > 0) {
            report.recommendations.push('✅ Se encontraron colecciones de chat existentes');
            report.recommendations.push('💡 Puedes recuperar los datos usando las herramientas de Firebase');
        } else if (chatRelatedData.length > 0) {
            report.recommendations.push('⚠️ Se encontraron campos relacionados con chat en colecciones existentes');
            report.recommendations.push('💡 Los datos de chat pueden estar integrados en otras colecciones');
        } else if (communications.length > 0) {
            report.recommendations.push('📞 Se encontraron comunicaciones con clientes');
            report.recommendations.push('💡 Puedes usar estos datos como base para un sistema de chat');
        } else {
            report.recommendations.push('❌ No se encontraron datos de chat existentes');
            report.recommendations.push('💡 Necesitarás implementar un sistema de chat desde cero');
        }

        return report;
    }

    async exportRecoveryData(report) {
        const filename = `chat_recovery_report_${new Date().toISOString().split('T')[0]}.json`;
        
        try {
            const fs = require('fs');
            fs.writeFileSync(filename, JSON.stringify(report, null, 2));
            console.log(`📄 Reporte guardado en: ${filename}`);
            return filename;
        } catch (error) {
            console.error('❌ Error guardando reporte:', error.message);
            return null;
        }
    }
}

// Función principal
async function main() {
    console.log('🚀 Expertia CRM - Herramienta de Recuperación de Chat');
    console.log('====================================================\n');

    const recoveryTool = new ChatRecoveryTool();
    
    if (!(await recoveryTool.init())) {
        process.exit(1);
    }

    try {
        const report = await recoveryTool.generateRecoveryReport();
        
        // Mostrar resumen
        console.log('📋 RESUMEN DE RECUPERACIÓN:');
        console.log('============================');
        console.log(`📁 Colecciones de chat encontradas: ${report.summary.chatCollectionsFound}`);
        console.log(`🔍 Campos relacionados con chat: ${report.summary.chatRelatedFields}`);
        console.log(`📞 Comunicaciones con clientes: ${report.summary.clientCommunications}`);
        
        console.log('\n💡 RECOMENDACIONES:');
        report.recommendations.forEach((rec, index) => {
            console.log(`${index + 1}. ${rec}`);
        });

        // Exportar datos
        const filename = await recoveryTool.exportRecoveryData(report);
        
        if (filename) {
            console.log(`\n✅ Proceso completado. Reporte guardado en: ${filename}`);
        }

    } catch (error) {
        console.error('❌ Error durante la recuperación:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = ChatRecoveryTool;