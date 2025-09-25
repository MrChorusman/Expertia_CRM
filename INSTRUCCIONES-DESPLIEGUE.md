# ☁️  DESPLIEGUE EN LA NUBE - EXPERTIA CRM

## 🚀 OPCIONES DE DESPLIEGUE

### 1. 🌟 VERCEL (Recomendado)
**Ventajas:** Gratis, rápido, fácil de usar
**Pasos:**
1. Ejecuta: `./desplegar.sh` y selecciona opción 1
2. O manualmente:
   - Instala Vercel CLI: `npm install -g vercel`
   - Ejecuta: `vercel --prod`
   - Sigue las instrucciones

### 2. 🌐 NETLIFY
**Ventajas:** Gratis, bueno para sitios estáticos
**Pasos:**
1. Ejecuta: `./desplegar.sh` y selecciona opción 2
2. O manualmente:
   - Instala Netlify CLI: `npm install -g netlify-cli`
   - Ejecuta: `netlify deploy --prod --dir .`

### 3. 🟣 HEROKU
**Ventajas:** Gratis con limitaciones, muy popular
**Pasos:**
1. Ejecuta: `./desplegar.sh` y selecciona opción 3
2. O manualmente:
   - Instala Heroku CLI
   - Ejecuta: `heroku create tu-app-name`
   - Ejecuta: `git push heroku main`

### 4. 🚂 RAILWAY
**Ventajas:** Gratis, moderno, fácil
**Pasos:**
1. Ejecuta: `./desplegar.sh` y selecciona opción 4
2. O manualmente:
   - Instala Railway CLI: `npm install -g @railway/cli`
   - Ejecuta: `railway login`
   - Ejecuta: `railway init`
   - Ejecuta: `railway up`

## 📋 REQUISITOS PREVIOS

- **Git** instalado y configurado
- **Node.js** (versión 14 o superior)
- **Cuenta** en la plataforma elegida

## 🔧 CONFIGURACIÓN

### Variables de Entorno (si es necesario)
Algunas plataformas pueden requerir configurar variables de entorno:

```bash
# Firebase (ya configurado en el código)
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_domain
FIREBASE_PROJECT_ID=tu_project_id
```

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
```bash
npm install --production
```

### Error de puerto:
Verifica que el puerto esté configurado correctamente en server.js

### Error de Firebase:
Verifica que las credenciales estén correctas

---
*Expertia CRM v1.9.0 - Expertia Medical Solutions SL*
