// ===============================
// SCRIPT PARA CREAR PAQUETE PORTABLE - EXPERTIA CRM
// ===============================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 CREANDO PAQUETE PORTABLE PARA EXPERTIA CRM');
console.log('==============================================');

// Función para copiar archivos
function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
}

// Función para copiar directorio
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    });
}

// Función para crear package.json portable
function createPortablePackageJson() {
    const packageJson = {
        "name": "expertia-crm-portable",
        "version": "1.9.0",
        "description": "Expertia CRM - Versión Portable",
        "main": "server.js",
        "scripts": {
            "start": "node server.js",
            "install-deps": "npm install --production"
        },
        "dependencies": {
            "firebase": "^10.14.1",
            "firebase-admin": "^13.4.0"
        }
    };
    
    fs.writeFileSync('portable/package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json portable creado');
}

// Función para crear script de inicio
function createStartScript() {
    const startScript = `@echo off
echo.
echo ========================================
echo    EXPERTIA CRM - VERSION PORTABLE
echo ========================================
echo.
echo Iniciando servidor...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Instalar dependencias si es necesario
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install --production
    echo.
)

REM Iniciar servidor
echo Servidor iniciado en: http://localhost:8085
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
node server.js

pause
`;

    fs.writeFileSync('portable/iniciar-crm.bat', startScript);
    console.log('✅ Script de inicio para Windows creado');
}

// Función para crear script de inicio para macOS/Linux
function createStartScriptUnix() {
    const startScript = `#!/bin/bash
echo ""
echo "========================================"
echo "   EXPERTIA CRM - VERSION PORTABLE"
echo "========================================"
echo ""
echo "Iniciando servidor..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado"
    echo ""
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    echo ""
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install --production
    echo ""
fi

# Iniciar servidor
echo "Servidor iniciado en: http://localhost:8085"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""
node server.js
`;

    fs.writeFileSync('portable/iniciar-crm.sh', startScript);
    
    // Hacer ejecutable
    try {
        execSync('chmod +x portable/iniciar-crm.sh');
        console.log('✅ Script de inicio para macOS/Linux creado');
    } catch (error) {
        console.log('⚠️  Script creado, pero no se pudo hacer ejecutable automáticamente');
    }
}

// Función para crear README portable
function createPortableReadme() {
    const readme = `# 🚀 EXPERTIA CRM - VERSIÓN PORTABLE

## 📋 INSTRUCCIONES DE USO

### Para Windows:
1. Ejecuta \`iniciar-crm.bat\`
2. Espera a que se abra el navegador
3. Accede a: http://localhost:8085

### Para macOS/Linux:
1. Abre terminal en esta carpeta
2. Ejecuta: \`./iniciar-crm.sh\`
3. Accede a: http://localhost:8085

## 🔧 REQUISITOS

- **Node.js** (versión 14 o superior)
- **Conexión a internet** (para Firebase)
- **Navegador web** (Chrome, Firefox, Safari, Edge)

## 📦 INSTALACIÓN DE NODE.JS

### Windows:
1. Ve a: https://nodejs.org/
2. Descarga la versión LTS
3. Ejecuta el instalador
4. Reinicia tu computadora

### macOS:
1. Ve a: https://nodejs.org/
2. Descarga la versión LTS
3. Ejecuta el archivo .pkg
4. Reinicia Terminal

### Linux (Ubuntu/Debian):
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

## 🌐 USO

1. **Iniciar:** Ejecuta el script correspondiente a tu sistema
2. **Acceder:** Abre http://localhost:8085 en tu navegador
3. **Detener:** Presiona Ctrl+C en la terminal

## 🔒 SEGURIDAD

- La aplicación se ejecuta localmente
- Los datos se sincronizan con Firebase
- No se almacenan datos sensibles localmente

## 📞 SOPORTE

Si tienes problemas:
1. Verifica que Node.js esté instalado: \`node --version\`
2. Verifica tu conexión a internet
3. Contacta al equipo de desarrollo

---
*Expertia CRM v1.9.0 - Expertia Medical Solutions SL*
`;

    fs.writeFileSync('portable/README.md', readme);
    console.log('✅ README portable creado');
}

// Función para crear archivos necesarios
function createPortablePackage() {
    console.log('\n📁 Creando estructura del paquete portable...');
    
    // Crear directorio portable
    if (fs.existsSync('portable')) {
        fs.rmSync('portable', { recursive: true });
    }
    fs.mkdirSync('portable', { recursive: true });
    
    // Archivos principales
    const mainFiles = [
        'index.html',
        'server.js',
        'firebase-config.js',
        'auth-simple.js',
        'main.js',
        'recharts.min.js',
        'storage.rules',
        'firestore.rules',
        'firestore.indexes.json',
        'firebase.json'
    ];
    
    console.log('📄 Copiando archivos principales...');
    mainFiles.forEach(file => {
        if (fs.existsSync(file)) {
            copyFile(file, `portable/${file}`);
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ⚠️  ${file} no encontrado`);
        }
    });
    
    // Crear archivos de configuración
    createPortablePackageJson();
    createStartScript();
    createStartScriptUnix();
    createPortableReadme();
    
    console.log('\n🎉 PAQUETE PORTABLE CREADO EXITOSAMENTE');
    console.log('=====================================');
    console.log('\n📦 Ubicación: ./portable/');
    console.log('\n📋 Archivos incluidos:');
    
    const portableFiles = fs.readdirSync('portable');
    portableFiles.forEach(file => {
        const filePath = path.join('portable', file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            const size = (stats.size / 1024).toFixed(2);
            console.log(`   📄 ${file} (${size} KB)`);
        } else {
            console.log(`   📁 ${file}/`);
        }
    });
    
    console.log('\n🚀 Próximos pasos:');
    console.log('   1. Comprimir la carpeta "portable" en un ZIP');
    console.log('   2. Enviar el ZIP a tu compañero');
    console.log('   3. Tu compañero debe seguir las instrucciones en README.md');
}

// Ejecutar
createPortablePackage();

