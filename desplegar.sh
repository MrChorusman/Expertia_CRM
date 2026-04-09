#!/bin/bash
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
