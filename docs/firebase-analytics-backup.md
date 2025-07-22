# Configuración de Firebase Analytics y Backup para Expertia CRM

## Firebase Analytics

### Configuración inicial
1. Analytics ya está configurado automáticamente con Firebase
2. Los eventos se registran automáticamente en la consola de Firebase

### Eventos personalizados implementados:
- `login_user`: Cuando un usuario se autentica
- `create_client`: Cuando se crea un nuevo cliente
- `create_opportunity`: Cuando se crea una nueva oportunidad
- `convert_opportunity`: Cuando se convierte una oportunidad en factura
- `generate_invoice`: Cuando se genera una nueva factura

### Métricas importantes:
- Usuarios activos diarios/mensuales
- Retención de usuarios
- Flujo de conversión de oportunidades
- Tiempo promedio de sesión
- Funcionalidades más utilizadas

## Estrategia de Backup

### Backup automático (Cloud Firestore)
- Firestore incluye backup automático de 7 días
- Para backups más largos, configurar en Firebase Console:
  - Ir a Firestore → Backup
  - Configurar schedule de backups
  - Retención recomendada: 30 días

### Backup manual con Cloud Functions
```javascript
// Función para backup bajo demanda
exports.backupDatabase = functions.https.onCall(async (data, context) => {
  const client = new FirestoreAdminClient();
  const databaseName = client.databasePath(projectId, '(default)');
  
  const [operation] = await client.exportDocuments({
    name: databaseName,
    outputUriPrefix: `gs://${bucketName}/backups/${Date.now()}`,
    collectionIds: ['clientes', 'oportunidades', 'actividades', 'productos', 'facturas']
  });
  
  return { operationName: operation.name };
});
```

### Archivos críticos para backup:
1. **Firestore Database**: Todos los datos del CRM
2. **Firebase Storage**: Archivos subidos (imágenes, documentos)
3. **Configuración**: firebase-config.js, firestore.rules, storage.rules
4. **Código fuente**: index.html, main.js, estilos

### Plan de recuperación:
1. **RTO (Recovery Time Objective)**: 4 horas
2. **RPO (Recovery Point Objective)**: 24 horas
3. **Responsable**: Administrador del sistema
4. **Procedimiento**: Documentado en docs/plan-recuperacion.md

## Monitoreo y Alertas

### Métricas clave:
- Errores de la aplicación (> 1% error rate)
- Tiempo de respuesta (> 3 segundos)
- Usuarios activos (drops > 20%)
- Fallos de autenticación (> 5%)

### Alertas configuradas:
- Email al administrador en caso de errores críticos
- Notificación por degradación de performance
- Alerta por intentos de acceso no autorizado

## Comandos útiles

### Inicializar Analytics en la app:
```javascript
import { getAnalytics, logEvent } from "firebase/analytics";
const analytics = getAnalytics();
logEvent(analytics, 'custom_event', { parameter: 'value' });
```

### Exportar datos para backup:
```bash
gcloud firestore export gs://expertiacrm-backup/$(date +%Y%m%d) --collection-ids=clientes,oportunidades,actividades
```

### Restaurar desde backup:
```bash
gcloud firestore import gs://expertiacrm-backup/20241201/backup-file
```

## Configuración en Firebase Console

### Analytics:
1. Ir a Analytics → Events
2. Configurar custom events
3. Crear audiences para segmentación
4. Configurar conversion events

### Backup:
1. Ir a Firestore → Backup and Restore
2. Schedule daily backups
3. Configure retention policy
4. Set up monitoring alerts

## Costos estimados

### Analytics: Gratis
- Hasta 500 eventos distintivos
- Reportes ilimitados
- Audiences ilimitadas

### Backup Storage:
- ~$0.023/GB/mes para almacenamiento
- ~$0.065/GB para operaciones de backup
- Estimado mensual: $5-15 dependiendo del volumen

## Compliance y Seguridad

### GDPR:
- Data retention configurada en 14 meses
- User-ID puede ser eliminado bajo petición
- Analytics respeta configuración de privacidad

### Audit Logs:
- Habilitados en Firebase Console
- Retención de 90 días
- Incluye acceso a datos, cambios de configuración, exports

---

Fecha de última actualización: Diciembre 2024
Responsable: Administrador de Sistema Expertia CRM
