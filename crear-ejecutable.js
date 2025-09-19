// ===============================
// SCRIPT PARA CREAR EJECUTABLE - EXPERTIA CRM
// ===============================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CREANDO EJECUTABLE PARA EXPERTIA CRM');
console.log('========================================');

// Función para ejecutar comandos
function runCommand(command, description) {
    console.log(`\n📦 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit', cwd: process.cwd() });
        console.log(`✅ ${description} completado`);
    } catch (error) {
        console.error(`❌ Error en ${description}:`, error.message);
        process.exit(1);
    }
}

// Función para crear directorio de distribución
function createDistDirectory() {
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
        console.log('📁 Directorio dist creado');
    }
}

// Función para crear archivo de instrucciones
function createInstructions() {
    const instructions = `# 📋 INSTRUCCIONES DE INSTALACIÓN - EXPERTIA CRM

## 🚀 INSTALACIÓN RÁPIDA

### Para Windows:
1. Ejecuta el archivo "Expertia CRM Setup.exe"
2. Sigue las instrucciones del instalador
3. La aplicación se instalará automáticamente

### Para macOS:
1. Abre el archivo "Expertia CRM.dmg"
2. Arrastra la aplicación a la carpeta Aplicaciones
3. Ejecuta desde Aplicaciones

### Para Linux:
1. Haz ejecutable el archivo: chmod +x "Expertia CRM.AppImage"
2. Ejecuta: ./"Expertia CRM.AppImage"

## 🔧 REQUISITOS DEL SISTEMA

- **Windows:** Windows 10 o superior
- **macOS:** macOS 10.14 o superior
- **Linux:** Ubuntu 18.04 o superior
- **RAM:** Mínimo 4GB
- **Espacio:** 200MB libres

## 🌐 CONEXIÓN A INTERNET

La aplicación requiere conexión a internet para:
- Autenticación con Firebase
- Sincronización de datos
- Actualizaciones automáticas

## 📞 SOPORTE

Si tienes problemas:
1. Verifica tu conexión a internet
2. Asegúrate de tener permisos de administrador
3. Contacta al equipo de desarrollo

## 🎯 FUNCIONALIDADES

- ✅ Gestión de clientes
- ✅ Control de gastos
- ✅ Informes y reportes
- ✅ Sistema de usuarios
- ✅ Configuraciones personalizables

---
*Expertia CRM v1.9.0 - Expertia Medical Solutions SL*
`;

    fs.writeFileSync(path.join(process.cwd(), 'dist', 'INSTRUCCIONES.txt'), instructions);
    console.log('📄 Archivo de instrucciones creado');
}

// Función principal
async function main() {
    try {
        // 1. Crear directorio de distribución
        createDistDirectory();
        
        // 2. Instalar dependencias si es necesario
        if (!fs.existsSync('node_modules')) {
            runCommand('npm install', 'Instalando dependencias');
        }
        
        // 3. Limpiar builds anteriores
        if (fs.existsSync('dist')) {
            runCommand('rm -rf dist/*', 'Limpiando builds anteriores');
        }
        
        // 4. Crear ejecutable para la plataforma actual
        const platform = process.platform;
        console.log(`\n🖥️  Plataforma detectada: ${platform}`);
        
        if (platform === 'darwin') {
            runCommand('npm run build-mac', 'Creando ejecutable para macOS');
        } else if (platform === 'win32') {
            runCommand('npm run build-win', 'Creando ejecutable para Windows');
        } else {
            runCommand('npm run build-linux', 'Creando ejecutable para Linux');
        }
        
        // 5. Crear archivo de instrucciones
        createInstructions();
        
        // 6. Mostrar resultados
        console.log('\n🎉 EJECUTABLE CREADO EXITOSAMENTE');
        console.log('================================');
        
        const distFiles = fs.readdirSync('dist');
        console.log('\n📦 Archivos generados:');
        distFiles.forEach(file => {
            const filePath = path.join('dist', file);
            const stats = fs.statSync(filePath);
            const size = (stats.size / 1024 / 1024).toFixed(2);
            console.log(`   📄 ${file} (${size} MB)`);
        });
        
        console.log('\n📋 Próximos pasos:');
        console.log('   1. Comprimir la carpeta "dist" en un ZIP');
        console.log('   2. Enviar el ZIP a tu compañero');
        console.log('   3. Tu compañero debe seguir las instrucciones en INSTRUCCIONES.txt');
        
        console.log('\n🌐 Alternativa: Servidor web');
        console.log('   También puedes usar: npm run start');
        console.log('   Y compartir: http://tu-ip:8085');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    }
}

// Ejecutar
main();

