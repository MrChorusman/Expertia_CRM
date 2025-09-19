// ===============================
// SCRIPT PARA DESPLEGAR EN LA NUBE - EXPERTIA CRM
// ===============================

const fs = require('fs');
const path = require('path');

console.log('☁️  CREANDO DESPLIEGUE EN LA NUBE PARA EXPERTIA CRM');
console.log('==================================================');

// Función para crear configuración de Vercel
function createVercelConfig() {
    const vercelConfig = {
        "version": 2,
        "name": "expertia-crm",
        "builds": [
            {
                "src": "server.js",
                "use": "@vercel/node"
            }
        ],
        "routes": [
            {
                "src": "/(.*)",
                "dest": "server.js"
            }
        ],
        "env": {
            "NODE_ENV": "production"
        }
    };
    
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    console.log('✅ Configuración de Vercel creada');
}

// Función para crear configuración de Netlify
function createNetlifyConfig() {
    const netlifyConfig = `[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`;

    fs.writeFileSync('netlify.toml', netlifyConfig);
    console.log('✅ Configuración de Netlify creada');
}

// Función para crear script de despliegue
function createDeployScript() {
    const deployScript = `#!/bin/bash
echo "🚀 DESPLEGANDO EXPERTIA CRM EN LA NUBE"
echo "====================================="
echo ""

# Verificar si git está configurado
if ! git config user.name &> /dev/null; then
    echo "⚠️  Git no está configurado. Configurando..."
    git config --global user.name "Expertia CRM"
    git config --global user.email "crm@expertia.com"
fi

# Crear repositorio si no existe
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit - Expertia CRM"
fi

echo "📦 Preparando archivos para despliegue..."
echo ""

# Crear .gitignore si no existe
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOF
node_modules/
dist/
portable/
*.log
.DS_Store
.env
.env.local
.env.production
EOF
    echo "✅ .gitignore creado"
fi

echo "🌐 OPCIONES DE DESPLIEGUE:"
echo "1. Vercel (Recomendado - Gratis)"
echo "2. Netlify (Gratis)"
echo "3. Heroku (Gratis con limitaciones)"
echo "4. Railway (Gratis)"
echo ""

read -p "Selecciona una opción (1-4): " choice

case $choice in
    1)
        echo "🚀 Desplegando en Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Instalando Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 Desplegando en Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Instalando Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod --dir .
        ;;
    3)
        echo "🚀 Desplegando en Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "Instalando Heroku CLI..."
            # Instrucciones para instalar Heroku CLI
            echo "Por favor instala Heroku CLI desde: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        heroku create expertia-crm-$(date +%s)
        git push heroku main
        ;;
    4)
        echo "🚀 Desplegando en Railway..."
        if ! command -v railway &> /dev/null; then
            echo "Instalando Railway CLI..."
            npm install -g @railway/cli
        fi
        railway login
        railway init
        railway up
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 DESPLIEGUE COMPLETADO"
echo "========================"
echo ""
echo "Tu aplicación estará disponible en la URL proporcionada"
echo "Comparte esta URL con tu compañero para que pueda probar la aplicación"
`;

    fs.writeFileSync('desplegar.sh', deployScript);
    
    // Hacer ejecutable
    try {
        execSync('chmod +x desplegar.sh');
        console.log('✅ Script de despliegue creado');
    } catch (error) {
        console.log('⚠️  Script creado, pero no se pudo hacer ejecutable automáticamente');
    }
}

// Función para crear instrucciones de despliegue
function createDeployInstructions() {
    const instructions = `# ☁️  DESPLIEGUE EN LA NUBE - EXPERTIA CRM

## 🚀 OPCIONES DE DESPLIEGUE

### 1. 🌟 VERCEL (Recomendado)
**Ventajas:** Gratis, rápido, fácil de usar
**Pasos:**
1. Ejecuta: \`./desplegar.sh\` y selecciona opción 1
2. O manualmente:
   - Instala Vercel CLI: \`npm install -g vercel\`
   - Ejecuta: \`vercel --prod\`
   - Sigue las instrucciones

### 2. 🌐 NETLIFY
**Ventajas:** Gratis, bueno para sitios estáticos
**Pasos:**
1. Ejecuta: \`./desplegar.sh\` y selecciona opción 2
2. O manualmente:
   - Instala Netlify CLI: \`npm install -g netlify-cli\`
   - Ejecuta: \`netlify deploy --prod --dir .\`

### 3. 🟣 HEROKU
**Ventajas:** Gratis con limitaciones, muy popular
**Pasos:**
1. Ejecuta: \`./desplegar.sh\` y selecciona opción 3
2. O manualmente:
   - Instala Heroku CLI
   - Ejecuta: \`heroku create tu-app-name\`
   - Ejecuta: \`git push heroku main\`

### 4. 🚂 RAILWAY
**Ventajas:** Gratis, moderno, fácil
**Pasos:**
1. Ejecuta: \`./desplegar.sh\` y selecciona opción 4
2. O manualmente:
   - Instala Railway CLI: \`npm install -g @railway/cli\`
   - Ejecuta: \`railway login\`
   - Ejecuta: \`railway init\`
   - Ejecuta: \`railway up\`

## 📋 REQUISITOS PREVIOS

- **Git** instalado y configurado
- **Node.js** (versión 14 o superior)
- **Cuenta** en la plataforma elegida

## 🔧 CONFIGURACIÓN

### Variables de Entorno (si es necesario)
Algunas plataformas pueden requerir configurar variables de entorno:

\`\`\`bash
# Firebase (ya configurado en el código)
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_domain
FIREBASE_PROJECT_ID=tu_project_id
\`\`\`

## 🌐 COMPARTIR CON TU COMPAÑERO

Una vez desplegado:
1. **Copia la URL** proporcionada por la plataforma
2. **Comparte la URL** con tu compañero
3. **Tu compañero** solo necesita abrir la URL en su navegador

## 🔒 SEGURIDAD

- La aplicación se ejecuta en la nube
- Los datos se sincronizan con Firebase
- No se almacenan datos sensibles en el servidor

## 📊 MONITOREO

- **Vercel:** Dashboard en vercel.com
- **Netlify:** Dashboard en netlify.com
- **Heroku:** Dashboard en heroku.com
- **Railway:** Dashboard en railway.app

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error de dependencias:
\`\`\`bash
npm install --production
\`\`\`

### Error de puerto:
Verifica que el puerto esté configurado correctamente en server.js

### Error de Firebase:
Verifica que las credenciales estén correctas

---
*Expertia CRM v1.9.0 - Expertia Medical Solutions SL*
`;

    fs.writeFileSync('INSTRUCCIONES-DESPLIEGUE.md', instructions);
    console.log('✅ Instrucciones de despliegue creadas');
}

// Función principal
function main() {
    console.log('\n📁 Creando archivos de configuración...');
    
    createVercelConfig();
    createNetlifyConfig();
    createDeployScript();
    createDeployInstructions();
    
    console.log('\n🎉 ARCHIVOS DE DESPLIEGUE CREADOS');
    console.log('=================================');
    console.log('\n📦 Archivos generados:');
    console.log('   📄 vercel.json');
    console.log('   📄 netlify.toml');
    console.log('   📄 desplegar.sh');
    console.log('   📄 INSTRUCCIONES-DESPLIEGUE.md');
    
    console.log('\n🚀 Próximos pasos:');
    console.log('   1. Ejecuta: ./desplegar.sh');
    console.log('   2. Selecciona tu plataforma preferida');
    console.log('   3. Sigue las instrucciones');
    console.log('   4. Comparte la URL con tu compañero');
    
    console.log('\n💡 RECOMENDACIÓN:');
    console.log('   Usa Vercel para la opción más rápida y fácil');
}

// Ejecutar
main();

