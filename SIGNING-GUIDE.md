# 🔏 Guía de Firma de Código - Expertia CRM

Esta guía describe cómo firmar los binarios para reducir advertencias (SmartScreen en Windows, Gatekeeper en macOS).

---

## 🪟 Windows (Code Signing)

### Opción A: Certificado EV (recomendado)
- Compra un certificado EV Code Signing (ej. DigiCert, Sectigo).
- Se entrega en token USB/HSM. Requiere firmar desde Windows.
- Ventaja: reduce significativamente SmartScreen.

### Opción B: Certificado estándar (OV)
- Certificado PFX (archivo .pfx con clave privada).
- Necesitas la contraseña del PFX.

### Paso a paso (certificado PFX)
1. Coloca `cert.pfx` en un lugar seguro (no lo subas al repo).
2. Exporta variable de entorno con la contraseña:
```powershell
$env:CSC_LINK="C:\\ruta\\cert.pfx"
$env:CSC_KEY_PASSWORD="tu_password"
```
3. Genera el instalador en Windows:
```powershell
npm run build-win
```
4. electron-builder firmará automáticamente el .exe si detecta `CSC_LINK` y `CSC_KEY_PASSWORD`.

### Firma manual con signtool (opcional)
```powershell
signtool sign /fd SHA256 /f cert.pfx /p tu_password /tr http://timestamp.digicert.com /td SHA256 "dist\\Expertia CRM Setup 1.9.0.exe"
```

---

## 🍏 macOS (Code Signing & Notarization)

### Certificados necesarios
- Apple Developer (pago)
- Identidad: "Developer ID Application" y "Developer ID Installer"

### Variables de entorno
```bash
export CSC_IDENTITY_AUTO_DISCOVERY=true
export APPLE_ID="tu@appleid.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="ABCDEFGHIJ"
```

### Build firmado y notarizado
```bash
npm run build-mac
```
- electron-builder firmará y mandará a notarizar si detecta las variables.

### Firma manual (ejemplo)
```bash
codesign --deep --force --options runtime --timestamp \
  --sign "Developer ID Application: TU NOMBRE (TEAMID)" \
  "dist/mac/Expertia CRM.app"

xcrun notarytool submit "dist/Expertia CRM-1.9.0.dmg" --apple-id "$APPLE_ID" --team-id "$APPLE_TEAM_ID" --password "$APPLE_APP_SPECIFIC_PASSWORD" --wait

xcrun stapler staple "dist/Expertia CRM-1.9.0.dmg"
```

---

## 🔐 Buenas prácticas
- Nunca subas certificados ni contraseñas al repositorio.
- Usa variables de entorno/gestores de secretos (CI/CD).
- Mantén la hora del sistema correcta para marca de tiempo.
- Renueva certificados antes de expirar.

---

## ❓ Preguntas frecuentes
- "Sigue apareciendo SmartScreen": incluso con firma, SmartScreen puede tardar en ganar reputación. Un certificado EV acelera el proceso.
- "Gatekeeper bloquea la app": verifica firma y notarización; abre la app una vez desde clic derecho → Abrir para registrar confianza.





