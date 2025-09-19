// ===============================
// SCRIPT MAESTRO PARA DISTRIBUIR APLICACIÓN - EXPERTIA CRM
// ===============================

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

console.log('🚀 DISTRIBUIDOR DE APLICACIÓN - EXPERTIA CRM');
console.log('============================================');
console.log('');

// Crear interfaz para entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para hacer pregunta
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

// Función para mostrar opciones
function showOptions() {
    console.log('📋 OPCIONES DISPONIBLES:');
    console.log('');
    console.log('1. 🖥️  EJECUTABLE (Electron)');
    console.log('   - Aplicación nativa para Windows/Mac/Linux');
    console.log('   - No requiere instalación de Node.js');
    console.log('   - Archivo .exe/.dmg/.AppImage');
    console.log('');
    console.log('2. 📦 PAQUETE PORTABLE (Node.js)');
    console.log('   - Requiere Node.js instalado');
    console.log('   - Más ligero y flexible');
    console.log('   - Scripts de inicio automático');
    console.log('');
    console.log('3. ☁️  DESPLIEGUE EN LA NUBE');
    console.log('   - Aplicación web accesible desde cualquier lugar');
    console.log('   - No requiere instalación local');
    console.log('   - Solo necesitas compartir una URL');
    console.log('');
    console.log('4. 🌐 SERVIDOR LOCAL (Actual)');
    console.log('   - Mantener el servidor actual');
    console.log('   - Compartir tu IP local');
    console.log('   - Más rápido para pruebas');
    console.log('');
}

// Función para ejecutar opción 1: Ejecutable
async function createExecutable() {
    console.log('\n🖥️  CREANDO EJECUTABLE...');
    console.log('========================');
    
    try {
        execSync('node crear-ejecutable.js', { stdio: 'inherit' });
        console.log('\n✅ Ejecutable creado exitosamente');
        console.log('📁 Ubicación: ./dist/');
        console.log('📋 Instrucciones: ./dist/INSTRUCCIONES.txt');
    } catch (error) {
        console.error('\n❌ Error creando ejecutable:', error.message);
    }
}

// Función para ejecutar opción 2: Paquete Portable
async function createPortable() {
    console.log('\n📦 CREANDO PAQUETE PORTABLE...');
    console.log('=============================');
    
    try {
        execSync('node crear-paquete-portable.js', { stdio: 'inherit' });
        console.log('\n✅ Paquete portable creado exitosamente');
        console.log('📁 Ubicación: ./portable/');
        console.log('📋 Instrucciones: ./portable/README.md');
    } catch (error) {
        console.error('\n❌ Error creando paquete portable:', error.message);
    }
}

// Función para ejecutar opción 3: Despliegue en la Nube
async function deployCloud() {
    console.log('\n☁️  PREPARANDO DESPLIEGUE EN LA NUBE...');
    console.log('=====================================');
    
    try {
        execSync('node desplegar-nube.js', { stdio: 'inherit' });
        console.log('\n✅ Archivos de despliegue creados');
        console.log('📁 Archivos: vercel.json, netlify.toml, desplegar.sh');
        console.log('📋 Instrucciones: ./INSTRUCCIONES-DESPLIEGUE.md');
        console.log('\n🚀 Para desplegar, ejecuta: ./desplegar.sh');
    } catch (error) {
        console.error('\n❌ Error preparando despliegue:', error.message);
    }
}

// Función para mostrar opción 4: Servidor Local
function showLocalServer() {
    console.log('\n🌐 SERVIDOR LOCAL ACTUAL');
    console.log('========================');
    console.log('');
    console.log('✅ Tu servidor ya está funcionando en:');
    console.log('   🌐 http://localhost:8085');
    console.log('');
    console.log('📋 Para compartir con tu compañero:');
    console.log('   1. Encuentra tu IP local:');
    console.log('      - Windows: ipconfig');
    console.log('      - Mac/Linux: ifconfig');
    console.log('');
    console.log('   2. Comparte: http://TU-IP:8085');
    console.log('      Ejemplo: http://192.168.1.100:8085');
    console.log('');
    console.log('   3. Asegúrate de que ambos estén en la misma red');
    console.log('');
    console.log('⚠️  LIMITACIONES:');
    console.log('   - Solo funciona en la misma red local');
    console.log('   - Requiere que tu computadora esté encendida');
    console.log('   - Puede requerir configuración de firewall');
}

// Función para mostrar resumen
function showSummary(option) {
    console.log('\n📊 RESUMEN DE OPCIONES');
    console.log('======================');
    console.log('');
    
    switch(option) {
        case '1':
            console.log('🖥️  EJECUTABLE (Electron)');
            console.log('✅ Ventajas:');
            console.log('   - No requiere Node.js');
            console.log('   - Aplicación nativa');
            console.log('   - Fácil de instalar');
            console.log('⚠️  Desventajas:');
            console.log('   - Archivo más grande');
            console.log('   - Requiere compilación');
            break;
            
        case '2':
            console.log('📦 PAQUETE PORTABLE (Node.js)');
            console.log('✅ Ventajas:');
            console.log('   - Archivo más pequeño');
            console.log('   - Fácil de modificar');
            console.log('   - Scripts automáticos');
            console.log('⚠️  Desventajas:');
            console.log('   - Requiere Node.js');
            console.log('   - Más pasos de instalación');
            break;
            
        case '3':
            console.log('☁️  DESPLIEGUE EN LA NUBE');
            console.log('✅ Ventajas:');
            console.log('   - Accesible desde cualquier lugar');
            console.log('   - No requiere instalación');
            console.log('   - Solo compartir URL');
            console.log('⚠️  Desventajas:');
            console.log('   - Requiere cuenta en plataforma');
            console.log('   - Dependiente de internet');
            break;
            
        case '4':
            console.log('🌐 SERVIDOR LOCAL');
            console.log('✅ Ventajas:');
            console.log('   - Más rápido');
            console.log('   - No requiere configuración adicional');
            console.log('   - Ideal para pruebas');
            console.log('⚠️  Desventajas:');
            console.log('   - Solo red local');
            console.log('   - Requiere computadora encendida');
            break;
    }
}

// Función principal
async function main() {
    try {
        showOptions();
        
        const choice = await askQuestion('\nSelecciona una opción (1-4): ');
        
        console.log('\n' + '='.repeat(50));
        
        switch(choice) {
            case '1':
                await createExecutable();
                break;
            case '2':
                await createPortable();
                break;
            case '3':
                await deployCloud();
                break;
            case '4':
                showLocalServer();
                break;
            default:
                console.log('❌ Opción inválida');
                return;
        }
        
        showSummary(choice);
        
        console.log('\n🎉 PROCESO COMPLETADO');
        console.log('====================');
        console.log('');
        console.log('💡 PRÓXIMOS PASOS:');
        console.log('   1. Revisa los archivos generados');
        console.log('   2. Prueba la opción elegida');
        console.log('   3. Comparte con tu compañero');
        console.log('   4. Solicita feedback');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        rl.close();
    }
}

// Ejecutar
main();

