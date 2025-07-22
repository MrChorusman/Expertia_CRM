# 📊 Modelo de Datos - Expertia CRM

## 🎯 Estructura General de Firestore

### 📋 Colecciones Principales

```
expertiacrm-7e7eb/
├── users/                  # Usuarios del sistema
├── clientes/              # Clientes y leads
├── productos/             # Catálogo de productos
├── facturas/              # Facturas y documentos fiscales
├── ofertas/               # Ofertas comerciales
├── empresas/              # Información de empresas cliente
├── actividades/           # Log de actividades comerciales
├── configuracion/         # Configuración del sistema
└── counters/              # Contadores para numeración automática
```

---

## 👥 Colección: `users`

**Propósito**: Gestión de usuarios y permisos del CRM

```javascript
{
  "id": "uid_firebase_auth",
  "email": "usuario@expertia.com",
  "name": "Juan Pérez",
  "role": "admin" | "comercial" | "viewer",
  "avatar": "url_opcional",
  "active": true,
  "permissions": {
    "canCreateClients": true,
    "canDeleteClients": false,
    "canCreateInvoices": true,
    "canViewReports": true,
    "canManageProducts": false
  },
  "preferences": {
    "language": "es",
    "timezone": "Europe/Madrid",
    "notifications": true
  },
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "admin_uid",
  "updatedBy": "admin_uid"
}
```

**Índices necesarios**:
- `email` (único)
- `role`
- `active`

---

## 🏢 Colección: `clientes`

**Propósito**: Gestión de clientes, leads y contactos comerciales

```javascript
{
  "id": "auto_generated_id",
  "name": "Dr. Juan García",
  "company": "Hospital San Juan",
  "email": "contacto@hospitalsanjuan.com",
  "phone": "+34 91 123 4567",
  "mobile": "+34 600 123 456",
  "address": {
    "street": "Calle Mayor 123",
    "city": "Madrid",
    "postalCode": "28001",
    "country": "España"
  },
  "funnelStage": "Lead" | "Primer Contacto" | "Interesado" | "Demo Realizada" | "Negociación" | "En Cierre" | "Ganado" | "Perdido",
  "contactPreference": "Email" | "Teléfono" | "WhatsApp" | "Visita Comercial",
  "productInterest": ["radiologia", "cardiologia", "laboratorio"],
  "source": "Web" | "Referido" | "Llamada Fría" | "Evento" | "Partner",
  "assignedTo": "comercial_uid",
  "priority": "Alta" | "Media" | "Baja",
  "budget": {
    "estimated": 50000,
    "currency": "EUR"
  },
  "nextAction": {
    "type": "Llamada" | "Email" | "Visita" | "Demo",
    "date": "2025-07-25T10:00:00Z",
    "description": "Presentar nueva línea de productos"
  },
  "tags": ["hospital", "publico", "urgente"],
  "notes": "Cliente prioritario con necesidades inmediatas",
  "consentGiven": true,
  "acceptsMarketing": true,
  "lastContact": "2025-07-20T14:30:00Z",
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "comercial_uid",
  "updatedBy": "comercial_uid"
}
```

**Subcolecciones**:
- `recordatorios/` - Recordatorios específicos del cliente
- `actividades/` - Historial de interacciones

**Índices necesarios**:
- `funnelStage`
- `assignedTo`
- `company`
- `createdAt`

---

## 📦 Colección: `productos`

**Propósito**: Catálogo de productos y servicios de Expertia

```javascript
{
  "id": "auto_generated_id",
  "name": "Equipo de Rayos X Digital",
  "sku": "EXP-RX-001",
  "description": "Sistema completo de radiografía digital con panel detector de última generación",
  "category": "Diagnóstico por Imagen",
  "subcategory": "Radiología",
  "supplier": "Storz Medical",
  "brand": "Storz",
  "model": "RX-Digital-Pro",
  "price": {
    "cost": 12000,
    "sale": 15000,
    "currency": "EUR"
  },
  "specifications": {
    "dimensions": "120x80x150 cm",
    "weight": "250 kg",
    "power": "220V",
    "certification": "CE, FDA"
  },
  "availability": "Disponible" | "Bajo Pedido" | "Descontinuado",
  "stock": 5,
  "minStock": 2,
  "images": [
    "https://storage.url/image1.jpg",
    "https://storage.url/image2.jpg"
  ],
  "documents": [
    {
      "name": "Manual Técnico",
      "url": "https://storage.url/manual.pdf",
      "type": "PDF"
    }
  ],
  "warranty": {
    "period": 24,
    "unit": "months",
    "type": "Completa"
  },
  "active": true,
  "featured": false,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "admin_uid",
  "updatedBy": "admin_uid"
}
```

**Índices necesarios**:
- `category`
- `supplier`
- `active`
- `sku` (único)

---

## 🧾 Colección: `facturas`

**Propósito**: Gestión de facturas y documentos fiscales

```javascript
{
  "id": "auto_generated_id",
  "invoiceNumber": "EXP001",
  "invoiceSeries": "EXP",
  "type": "Factura" | "Factura Proforma" | "Factura Rectificativa",
  "status": "Borrador" | "Enviada" | "Pagada" | "Vencida" | "Anulada",
  "clientId": "client_document_id",
  "clientData": {
    "name": "Hospital San Juan",
    "taxId": "A12345678",
    "address": "Calle Mayor 123, Madrid, 28001"
  },
  "invoiceDate": "2025-07-20",
  "dueDate": "2025-08-20",
  "items": [
    {
      "productId": "product_id",
      "description": "Equipo de Rayos X Digital",
      "quantity": 1,
      "price": 15000,
      "discount": 0,
      "total": 15000
    }
  ],
  "subtotal": 15000,
  "discountTotal": 0,
  "vatRate": 0.21,
  "vatAmount": 3150,
  "total": 18150,
  "currency": "EUR",
  "paymentTerms": "30 días",
  "paymentMethod": "Transferencia",
  "totalPaid": 18150,
  "balance": 0,
  "notes": "Instalación incluida",
  "originOfferId": "offer_id_opcional",
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "comercial_uid",
  "updatedBy": "comercial_uid"
}
```

**Subcolecciones**:
- `payments/` - Registro de pagos

**Índices necesarios**:
- `clientId`
- `status`
- `invoiceDate`
- `dueDate`

---

## 💼 Colección: `ofertas`

**Propósito**: Gestión de ofertas comerciales

```javascript
{
  "id": "auto_generated_id",
  "offerNumber": "OF-2025-001",
  "offerSeries": "OF",
  "status": "Borrador" | "Enviada" | "Aceptada" | "Rechazada" | "Expirada",
  "clientId": "client_document_id",
  "offerDate": "2025-07-20",
  "validUntil": "2025-08-20",
  "title": "Propuesta de Equipamiento Completo",
  "description": "Solución integral para modernización del departamento de radiología",
  "items": [
    {
      "productId": "product_id",
      "description": "Equipo de Rayos X Digital",
      "quantity": 1,
      "price": 15000,
      "discount": 5,
      "total": 14250
    }
  ],
  "subtotal": 14250,
  "vatAmount": 2992.5,
  "total": 17242.5,
  "currency": "EUR",
  "terms": "Oferta válida hasta la fecha indicada. Instalación y formación incluidas.",
  "deliveryTime": "4-6 semanas",
  "warranty": "2 años",
  "assignedTo": "comercial_uid",
  "probability": 75,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "comercial_uid",
  "updatedBy": "comercial_uid"
}
```

**Índices necesarios**:
- `clientId`
- `status`
- `assignedTo`
- `validUntil`

---

## 🏢 Colección: `empresas`

**Propósito**: Información detallada de empresas cliente

```javascript
{
  "id": "auto_generated_id",
  "name": "Hospital San Juan",
  "taxId": "A12345678",
  "industry": "Sanidad",
  "sector": "Público" | "Privado" | "Concertado",
  "size": "Grande" | "Mediana" | "Pequeña",
  "employees": 500,
  "revenue": 10000000,
  "website": "https://hospitalsanjuan.com",
  "addresses": [
    {
      "type": "Sede Principal",
      "street": "Calle Mayor 123",
      "city": "Madrid",
      "postalCode": "28001",
      "country": "España",
      "isPrimary": true
    }
  ],
  "contacts": ["client_id_1", "client_id_2"],
  "tags": ["hospital", "publico", "madrid"],
  "notes": "Hospital de referencia en la zona norte de Madrid",
  "active": true,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "comercial_uid",
  "updatedBy": "comercial_uid"
}
```

---

## 📈 Colección: `actividades`

**Propósito**: Log de actividades comerciales

```javascript
{
  "id": "auto_generated_id",
  "type": "Llamada" | "Email" | "Visita" | "Demo" | "Reunión" | "Propuesta",
  "subject": "Llamada de seguimiento",
  "description": "Contacto telefónico para conocer el estado de la decisión",
  "clientId": "client_document_id",
  "userId": "user_id",
  "duration": 30, // minutos
  "outcome": "Positivo" | "Neutro" | "Negativo",
  "nextAction": {
    "type": "Email",
    "date": "2025-07-25T10:00:00Z",
    "description": "Enviar documentación adicional"
  },
  "tags": ["seguimiento", "urgente"],
  "attachments": [
    {
      "name": "Propuesta.pdf",
      "url": "https://storage.url/propuesta.pdf"
    }
  ],
  "createdAt": "2025-07-20T10:30:00Z",
  "createdBy": "comercial_uid"
}
```

---

## ⚙️ Colección: `configuracion`

**Propósito**: Configuración global del sistema

```javascript
{
  "id": "general",
  "company": {
    "name": "Expertia Medical Solutions",
    "taxId": "B12345678",
    "address": "Calle Innovación 1, Madrid",
    "phone": "+34 91 000 0000",
    "email": "info@expertia.com",
    "website": "https://expertia.com"
  },
  "invoice": {
    "series": ["EXP", "ALQ"],
    "nextNumbers": {
      "EXP": 1,
      "ALQ": 1
    },
    "vatRate": 0.21,
    "paymentTerms": 30
  },
  "sales": {
    "funnelStages": [
      "Lead",
      "Primer Contacto",
      "Interesado",
      "Demo Realizada",
      "Negociación",
      "En Cierre",
      "Ganado",
      "Perdido"
    ],
    "priorities": ["Alta", "Media", "Baja"]
  },
  "updatedAt": "2025-07-20T10:30:00Z",
  "updatedBy": "admin_uid"
}
```

---

## 🔢 Colección: `counters`

**Propósito**: Contadores para numeración automática

```javascript
{
  "id": "EXP",
  "current": 1,
  "updatedAt": "2025-07-20T10:30:00Z"
}
```

---

## 🔐 Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir su propio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Clientes - acceso basado en rol
    match /clientes/{clientId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole() == 'admin' || getUserRole() == 'comercial');
    }
    
    // Productos - solo admin puede escribir
    match /productos/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && getUserRole() == 'admin';
    }
    
    // Facturas - comercial y admin
    match /facturas/{invoiceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole() == 'admin' || getUserRole() == 'comercial');
    }
    
    // Función helper para obtener rol
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
  }
}
```

---

## 📊 Estrategia de Índices

### Índices Compuestos Recomendados:

1. **Clientes**:
   - `assignedTo` + `funnelStage`
   - `createdAt` (descendente) + `funnelStage`

2. **Facturas**:
   - `clientId` + `status`
   - `status` + `dueDate`

3. **Ofertas**:
   - `assignedTo` + `status`
   - `clientId` + `status`

4. **Actividades**:
   - `clientId` + `createdAt` (descendente)
   - `userId` + `type`

---

## 🚀 Plan de Migración

1. **Fase 1**: Crear colecciones base (users, clientes, productos)
2. **Fase 2**: Implementar facturas y ofertas
3. **Fase 3**: Añadir empresas y actividades
4. **Fase 4**: Configuración y optimización de índices

---

## 📝 Notas de Implementación

- Todos los timestamps en formato ISO 8601 UTC
- Campos de auditoría obligatorios: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- Validación de datos en cliente y reglas de Firestore
- Backup automático configurado en Firebase
- Monitorización de uso y costos activada

---

## 📋 Definiciones Detalladas de Campos

### 🔗 Campos de Auditoría (Comunes a todas las colecciones)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id` | String | ✅ | Identificador único del documento (auto-generado por Firestore) |
| `createdAt` | Timestamp | ✅ | Fecha y hora de creación del registro en formato ISO 8601 UTC |
| `updatedAt` | Timestamp | ✅ | Fecha y hora de última modificación en formato ISO 8601 UTC |
| `createdBy` | String | ✅ | UID del usuario que creó el registro |
| `updatedBy` | String | ✅ | UID del usuario que modificó el registro por última vez |

### 👥 Colección `users` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores Permitidos |
|-------|------|-------------|-------------|-------------------|
| `email` | String | ✅ | Dirección de correo electrónico única del usuario | Formato email válido |
| `name` | String | ✅ | Nombre completo del usuario | Mínimo 2 caracteres |
| `role` | String | ✅ | Rol del usuario en el sistema | `superadmin`, `admin`, `comercial`, `viewer` |
| `avatar` | String | ❌ | URL de la imagen de perfil del usuario | URL válida |
| `active` | Boolean | ✅ | Estado activo/inactivo del usuario | `true`, `false` |
| `permissions` | Object | ✅ | Objeto con permisos específicos del usuario | Ver tabla de permisos |
| `preferences` | Object | ✅ | Preferencias personales del usuario | Ver tabla de preferencias |

#### Tabla de Permisos (`permissions`)

| Permiso | Tipo | Descripción |
|---------|------|-------------|
| `canCreateClients` | Boolean | Puede crear nuevos clientes |
| `canDeleteClients` | Boolean | Puede eliminar clientes |
| `canCreateInvoices` | Boolean | Puede crear facturas |
| `canDeleteInvoices` | Boolean | Puede eliminar facturas |
| `canViewReports` | Boolean | Puede acceder a reportes |
| `canManageProducts` | Boolean | Puede gestionar el catálogo de productos |
| `canManageUsers` | Boolean | Puede gestionar otros usuarios |
| `canManageConfig` | Boolean | Puede modificar configuración del sistema |
| `canManageSystem` | Boolean | Puede acceder a funciones del sistema |
| `canInitializeData` | Boolean | Puede inicializar datos de ejemplo |
| `canManageFirebase` | Boolean | Puede gestionar Firebase |
| `canManageBackups` | Boolean | Puede gestionar copias de seguridad |

#### Tabla de Preferencias (`preferences`)

| Preferencia | Tipo | Descripción | Valores |
|-------------|------|-------------|---------|
| `language` | String | Idioma de la interfaz | `es`, `en`, `fr` |
| `timezone` | String | Zona horaria del usuario | Formato IANA (ej: `Europe/Madrid`) |
| `notifications` | Boolean | Recibir notificaciones | `true`, `false` |

### 🏢 Colección `clientes` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `name` | String | ✅ | Nombre completo del contacto | Mínimo 2 caracteres |
| `company` | String | ✅ | Nombre de la empresa/organización | Mínimo 2 caracteres |
| `email` | String | ✅ | Email principal de contacto | Formato email válido |
| `phone` | String | ❌ | Teléfono fijo | Formato internacional (+34...) |
| `mobile` | String | ❌ | Teléfono móvil | Formato internacional (+34...) |
| `address` | Object | ❌ | Dirección completa | Ver tabla de dirección |
| `funnelStage` | String | ✅ | Etapa en el embudo de ventas | Ver tabla de etapas |
| `contactPreference` | String | ✅ | Preferencia de contacto | `Email`, `Teléfono`, `WhatsApp`, `Visita Comercial` |
| `productInterest` | Array | ❌ | Productos/categorías de interés | Array de strings |
| `source` | String | ✅ | Origen del lead | `Web`, `Referido`, `Llamada Fría`, `Evento`, `Partner`, `Publicidad` |
| `assignedTo` | String | ✅ | UID del comercial asignado | UID válido de usuario |
| `priority` | String | ✅ | Prioridad del cliente | `Alta`, `Media`, `Baja` |
| `budget` | Object | ❌ | Presupuesto estimado | Ver tabla de presupuesto |
| `nextAction` | Object | ❌ | Próxima acción planificada | Ver tabla de próxima acción |
| `tags` | Array | ❌ | Etiquetas personalizadas | Array de strings |
| `notes` | String | ❌ | Notas adicionales | Texto libre |
| `consentGiven` | Boolean | ✅ | Consentimiento RGPD | `true`, `false` |
| `acceptsMarketing` | Boolean | ✅ | Acepta marketing | `true`, `false` |
| `lastContact` | Timestamp | ❌ | Fecha del último contacto | ISO 8601 UTC |

#### Tabla de Dirección (`address`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `street` | String | Dirección completa |
| `city` | String | Ciudad |
| `postalCode` | String | Código postal |
| `country` | String | País |

#### Tabla de Etapas del Embudo (`funnelStage`)

| Etapa | Descripción |
|-------|-------------|
| `Lead` | Contacto inicial identificado |
| `Primer Contacto` | Primer contacto establecido |
| `Interesado` | Ha mostrado interés en los productos |
| `Demo Realizada` | Se ha realizado demostración |
| `Negociación` | En proceso de negociación |
| `En Cierre` | A punto de cerrar la venta |
| `Ganado` | Cliente ganado |
| `Perdido` | Oportunidad perdida |

#### Tabla de Presupuesto (`budget`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `estimated` | Number | Presupuesto estimado |
| `currency` | String | Moneda (`EUR`, `USD`) |

#### Tabla de Próxima Acción (`nextAction`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | String | Tipo de acción (`Llamada`, `Email`, `Visita`, `Demo`) |
| `date` | Timestamp | Fecha programada |
| `description` | String | Descripción de la acción |

### 📦 Colección `productos` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `name` | String | ✅ | Nombre del producto | Mínimo 3 caracteres |
| `sku` | String | ✅ | Código único del producto | Formato: XXX-XXX-XXX |
| `description` | String | ✅ | Descripción detallada | Mínimo 10 caracteres |
| `category` | String | ✅ | Categoría principal | Ver tabla de categorías |
| `subcategory` | String | ❌ | Subcategoría | String libre |
| `supplier` | String | ✅ | Proveedor | Ver tabla de proveedores |
| `brand` | String | ❌ | Marca del producto | String libre |
| `model` | String | ❌ | Modelo específico | String libre |
| `price` | Object | ✅ | Información de precios | Ver tabla de precios |
| `specifications` | Object | ❌ | Especificaciones técnicas | Ver tabla de especificaciones |
| `availability` | String | ✅ | Estado de disponibilidad | `Disponible`, `Bajo Pedido`, `Descontinuado` |
| `stock` | Number | ✅ | Cantidad en stock | Número entero ≥ 0 |
| `minStock` | Number | ✅ | Stock mínimo | Número entero ≥ 0 |
| `images` | Array | ❌ | URLs de imágenes | Array de URLs válidas |
| `documents` | Array | ❌ | Documentos adjuntos | Ver tabla de documentos |
| `warranty` | Object | ❌ | Información de garantía | Ver tabla de garantía |
| `active` | Boolean | ✅ | Producto activo | `true`, `false` |
| `featured` | Boolean | ✅ | Producto destacado | `true`, `false` |

#### Tabla de Categorías de Productos

| Categoría | Descripción |
|-----------|-------------|
| `Diagnóstico por Imagen` | Equipos de radiología, resonancia, etc. |
| `Cardiología` | Equipos cardiovasculares |
| `Laboratorio` | Equipos de análisis clínicos |
| `Quirófano` | Equipamiento quirúrgico |
| `UCI` | Equipos de cuidados intensivos |
| `Emergencias` | Equipos de urgencias |
| `Rehabilitación` | Equipos de fisioterapia |
| `Servicios` | Servicios de mantenimiento, formación |

#### Tabla de Proveedores Predefinidos

| Proveedor | Especialidad |
|-----------|--------------|
| `Storz Medical` | Equipos médicos generales |
| `Zamar Medical` | Diagnóstico por imagen |
| `Phillips Healthcare` | Tecnología médica avanzada |
| `GE Healthcare` | Equipos hospitalarios |
| `Siemens Healthineers` | Soluciones médicas integrales |

#### Tabla de Precios (`price`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `cost` | Number | Precio de coste |
| `sale` | Number | Precio de venta |
| `currency` | String | Moneda (`EUR`, `USD`) |

#### Tabla de Especificaciones (`specifications`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `dimensions` | String | Dimensiones físicas |
| `weight` | String | Peso del equipo |
| `power` | String | Requerimientos eléctricos |
| `certification` | String | Certificaciones (CE, FDA, etc.) |

#### Tabla de Documentos (`documents`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre del documento |
| `url` | String | URL del archivo |
| `type` | String | Tipo de archivo (`PDF`, `DOC`, `XLS`) |

#### Tabla de Garantía (`warranty`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `period` | Number | Duración de la garantía |
| `unit` | String | Unidad (`months`, `years`) |
| `type` | String | Tipo de garantía (`Completa`, `Limitada`) |

### 🧾 Colección `facturas` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `invoiceNumber` | String | ✅ | Número de factura | Auto-generado secuencial |
| `invoiceSeries` | String | ✅ | Serie de la factura | `EXP`, `ALQ`, `PROF` |
| `type` | String | ✅ | Tipo de documento | `Factura`, `Factura Proforma`, `Factura Rectificativa` |
| `status` | String | ✅ | Estado de la factura | `Borrador`, `Enviada`, `Pagada`, `Vencida`, `Anulada` |
| `clientId` | String | ✅ | ID del cliente | Referencia a `clientes` |
| `clientData` | Object | ✅ | Datos del cliente snapshot | Ver tabla de datos cliente |
| `invoiceDate` | String | ✅ | Fecha de emisión | Formato YYYY-MM-DD |
| `dueDate` | String | ✅ | Fecha de vencimiento | Formato YYYY-MM-DD |
| `items` | Array | ✅ | Líneas de factura | Ver tabla de items |
| `subtotal` | Number | ✅ | Subtotal sin impuestos | Número decimal |
| `discountTotal` | Number | ✅ | Descuento total aplicado | Número decimal |
| `vatRate` | Number | ✅ | Tipo de IVA | Decimal (ej: 0.21 para 21%) |
| `vatAmount` | Number | ✅ | Importe del IVA | Número decimal |
| `total` | Number | ✅ | Total de la factura | Número decimal |
| `currency` | String | ✅ | Moneda | `EUR`, `USD` |
| `paymentTerms` | String | ✅ | Condiciones de pago | String libre |
| `paymentMethod` | String | ❌ | Método de pago | `Transferencia`, `Cheque`, `Efectivo`, `Tarjeta` |
| `totalPaid` | Number | ✅ | Total pagado | Número decimal (default: 0) |
| `balance` | Number | ✅ | Saldo pendiente | Número decimal |
| `notes` | String | ❌ | Notas adicionales | Texto libre |
| `originOfferId` | String | ❌ | ID de oferta origen | Referencia a `ofertas` |

#### Tabla de Datos Cliente (`clientData`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre del cliente |
| `taxId` | String | NIF/CIF del cliente |
| `address` | String | Dirección completa |

#### Tabla de Items de Factura (`items`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `productId` | String | ID del producto |
| `description` | String | Descripción del item |
| `quantity` | Number | Cantidad |
| `price` | Number | Precio unitario |
| `discount` | Number | Descuento porcentual |
| `total` | Number | Total de la línea |

### 💼 Colección `ofertas` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `offerNumber` | String | ✅ | Número de oferta | Auto-generado: OF-YYYY-XXX |
| `offerSeries` | String | ✅ | Serie de ofertas | `OF` |
| `status` | String | ✅ | Estado de la oferta | `Borrador`, `Enviada`, `Aceptada`, `Rechazada`, `Expirada` |
| `clientId` | String | ✅ | ID del cliente | Referencia a `clientes` |
| `offerDate` | String | ✅ | Fecha de la oferta | Formato YYYY-MM-DD |
| `validUntil` | String | ✅ | Válida hasta | Formato YYYY-MM-DD |
| `title` | String | ✅ | Título de la oferta | Mínimo 5 caracteres |
| `description` | String | ❌ | Descripción detallada | Texto libre |
| `items` | Array | ✅ | Productos ofertados | Ver tabla de items |
| `subtotal` | Number | ✅ | Subtotal | Número decimal |
| `vatAmount` | Number | ✅ | IVA | Número decimal |
| `total` | Number | ✅ | Total | Número decimal |
| `currency` | String | ✅ | Moneda | `EUR`, `USD` |
| `terms` | String | ❌ | Términos y condiciones | Texto libre |
| `deliveryTime` | String | ❌ | Tiempo de entrega | String libre |
| `warranty` | String | ❌ | Garantía ofrecida | String libre |
| `assignedTo` | String | ✅ | Comercial asignado | UID de usuario |
| `probability` | Number | ❌ | Probabilidad de éxito | 0-100 |

### 🏢 Colección `empresas` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `name` | String | ✅ | Razón social | Mínimo 3 caracteres |
| `taxId` | String | ✅ | NIF/CIF | Formato válido español |
| `industry` | String | ✅ | Sector industrial | `Sanidad`, `Veterinaria`, `Investigación` |
| `sector` | String | ✅ | Tipo de sector | `Público`, `Privado`, `Concertado` |
| `size` | String | ✅ | Tamaño de empresa | `Pequeña`, `Mediana`, `Grande` |
| `employees` | Number | ❌ | Número de empleados | Número entero |
| `revenue` | Number | ❌ | Facturación anual | Número decimal |
| `website` | String | ❌ | Sitio web | URL válida |
| `addresses` | Array | ✅ | Direcciones | Ver tabla de direcciones |
| `contacts` | Array | ❌ | Contactos asociados | Array de IDs de `clientes` |
| `tags` | Array | ❌ | Etiquetas | Array de strings |
| `notes` | String | ❌ | Notas | Texto libre |
| `active` | Boolean | ✅ | Empresa activa | `true`, `false` |

#### Tabla de Direcciones de Empresa (`addresses`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | String | Tipo de dirección (`Sede Principal`, `Sucursal`, `Almacén`) |
| `street` | String | Dirección completa |
| `city` | String | Ciudad |
| `postalCode` | String | Código postal |
| `country` | String | País |
| `isPrimary` | Boolean | Es dirección principal |

### 📈 Colección `actividades` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `type` | String | ✅ | Tipo de actividad | `Llamada`, `Email`, `Visita`, `Demo`, `Reunión`, `Propuesta` |
| `subject` | String | ✅ | Asunto | Mínimo 3 caracteres |
| `description` | String | ✅ | Descripción detallada | Mínimo 10 caracteres |
| `clientId` | String | ✅ | Cliente relacionado | Referencia a `clientes` |
| `userId` | String | ✅ | Usuario que realizó | UID de usuario |
| `duration` | Number | ❌ | Duración en minutos | Número entero |
| `outcome` | String | ❌ | Resultado | `Positivo`, `Neutro`, `Negativo` |
| `nextAction` | Object | ❌ | Próxima acción | Ver tabla de próxima acción |
| `tags` | Array | ❌ | Etiquetas | Array de strings |
| `attachments` | Array | ❌ | Archivos adjuntos | Ver tabla de adjuntos |

#### Tabla de Adjuntos (`attachments`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre del archivo |
| `url` | String | URL del archivo |
| `type` | String | Tipo MIME |
| `size` | Number | Tamaño en bytes |

### ⚙️ Colección `configuracion` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `company` | Object | ✅ | Datos de la empresa | Ver tabla de empresa |
| `invoice` | Object | ✅ | Configuración facturas | Ver tabla de facturación |
| `sales` | Object | ✅ | Configuración ventas | Ver tabla de ventas |

#### Tabla de Empresa (`company`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre de la empresa |
| `taxId` | String | NIF/CIF |
| `address` | String | Dirección completa |
| `phone` | String | Teléfono |
| `email` | String | Email corporativo |
| `website` | String | Sitio web |
| `logo` | String | URL del logo |

#### Tabla de Facturación (`invoice`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `series` | Array | Series disponibles |
| `nextNumbers` | Object | Próximos números por serie |
| `vatRate` | Number | Tipo de IVA por defecto |
| `paymentTerms` | Number | Días de pago por defecto |
| `defaultCurrency` | String | Moneda por defecto |

#### Tabla de Ventas (`sales`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `funnelStages` | Array | Etapas del embudo |
| `priorities` | Array | Prioridades disponibles |
| `contactPreferences` | Array | Preferencias de contacto |
| `sources` | Array | Fuentes de leads |

### 🔢 Colección `counters` - Definiciones de Campos

| Campo | Tipo | Obligatorio | Descripción | Valores/Formato |
|-------|------|-------------|-------------|-----------------|
| `current` | Number | ✅ | Contador actual | Número entero |
| `description` | String | ❌ | Descripción del contador | Texto libre |

---

## 🔗 Relaciones Entre Colecciones

### Diagrama de Relaciones

```
users (1) ←→ (N) clientes [assignedTo]
users (1) ←→ (N) facturas [createdBy]
users (1) ←→ (N) ofertas [assignedTo]
users (1) ←→ (N) actividades [userId]

clientes (1) ←→ (N) facturas [clientId]
clientes (1) ←→ (N) ofertas [clientId]
clientes (1) ←→ (N) actividades [clientId]
clientes (N) ←→ (1) empresas [contacts array]

productos (1) ←→ (N) factura_items [productId]
productos (1) ←→ (N) oferta_items [productId]

ofertas (1) ←→ (1) facturas [originOfferId]

configuracion (1) ←→ (N) counters [series]
```

### Integridad Referencial

| Relación | Tipo | Restricción |
|----------|------|-------------|
| `clientes.assignedTo` → `users.id` | FK | Usuario debe existir y estar activo |
| `facturas.clientId` → `clientes.id` | FK | Cliente debe existir |
| `ofertas.clientId` → `clientes.id` | FK | Cliente debe existir |
| `actividades.clientId` → `clientes.id` | FK | Cliente debe existir |
| `actividades.userId` → `users.id` | FK | Usuario debe existir |
| `facturas.items.productId` → `productos.id` | FK | Producto debe existir |

---

## ✅ Validaciones y Restricciones

### Validaciones de Datos

#### Campos de Email
- Formato válido de email
- Único en la colección `users`
- Obligatorio en `users` y `clientes`

#### Campos de Teléfono
- Formato internacional (+XX XXX XXX XXX)
- Mínimo 9 dígitos

#### Campos Monetarios
- Números decimales con máximo 2 decimales
- Valores no negativos
- Moneda válida (EUR, USD)

#### Campos de Fecha
- Formato ISO 8601 UTC
- `dueDate` debe ser posterior a `invoiceDate`
- `validUntil` debe ser posterior a `offerDate`

#### SKU de Productos
- Formato: XXX-XXX-XXX
- Único en la colección `productos`
- Solo caracteres alfanuméricos y guiones

### Restricciones de Negocio

#### Estados de Factura
- `Borrador` → `Enviada` → `Pagada`
- `Borrador` → `Anulada`
- No se puede eliminar una factura `Pagada`

#### Estados de Oferta
- `Borrador` → `Enviada` → (`Aceptada` | `Rechazada`)
- `Enviada` → `Expirada` (automático por fecha)
- Solo ofertas `Aceptadas` pueden convertirse en facturas

#### Permisos por Rol
- `viewer`: Solo lectura
- `comercial`: CRUD en clientes, ofertas, actividades
- `admin`: CRUD en todas las colecciones excepto usuarios
- `superadmin`: CRUD completo en todas las colecciones

---

## 📊 Consultas Comunes y Optimización

### Consultas Frecuentes por Colección

#### Clientes
```javascript
// Clientes por comercial y etapa
db.collection('clientes')
  .where('assignedTo', '==', userId)
  .where('funnelStage', '==', 'Negociación')
  .orderBy('updatedAt', 'desc')

// Clientes por prioridad
db.collection('clientes')
  .where('priority', '==', 'Alta')
  .where('funnelStage', 'in', ['Interesado', 'Demo Realizada', 'Negociación'])

// Clientes con próximas acciones vencidas
db.collection('clientes')
  .where('nextAction.date', '<=', new Date())
  .orderBy('nextAction.date', 'asc')
```

#### Facturas
```javascript
// Facturas pendientes de pago
db.collection('facturas')
  .where('status', '==', 'Enviada')
  .where('dueDate', '<=', new Date())
  .orderBy('dueDate', 'asc')

// Facturas por cliente
db.collection('facturas')
  .where('clientId', '==', clientId)
  .orderBy('invoiceDate', 'desc')

// Facturación mensual
db.collection('facturas')
  .where('status', '==', 'Pagada')
  .where('invoiceDate', '>=', startOfMonth)
  .where('invoiceDate', '<=', endOfMonth)
```

#### Ofertas
```javascript
// Ofertas por comercial
db.collection('ofertas')
  .where('assignedTo', '==', userId)
  .where('status', 'in', ['Enviada', 'Borrador'])
  .orderBy('offerDate', 'desc')

// Ofertas próximas a expirar
db.collection('ofertas')
  .where('status', '==', 'Enviada')
  .where('validUntil', '<=', nextWeek)
  .orderBy('validUntil', 'asc')
```

#### Actividades
```javascript
// Actividades recientes de un cliente
db.collection('actividades')
  .where('clientId', '==', clientId)
  .orderBy('createdAt', 'desc')
  .limit(10)

// Actividades por usuario y tipo
db.collection('actividades')
  .where('userId', '==', userId)
  .where('type', '==', 'Llamada')
  .orderBy('createdAt', 'desc')
```

### Índices Requeridos

#### Índices Simples
```javascript
// Clientes
'assignedTo' (ASC)
'funnelStage' (ASC)
'priority' (ASC)
'company' (ASC)
'createdAt' (DESC)
'nextAction.date' (ASC)

// Facturas
'clientId' (ASC)
'status' (ASC)
'invoiceDate' (DESC)
'dueDate' (ASC)

// Ofertas
'assignedTo' (ASC)
'clientId' (ASC)
'status' (ASC)
'offerDate' (DESC)
'validUntil' (ASC)

// Actividades
'clientId' (ASC)
'userId' (ASC)
'type' (ASC)
'createdAt' (DESC)

// Productos
'category' (ASC)
'supplier' (ASC)
'active' (ASC)
'sku' (ASC)

// Users
'email' (ASC)
'role' (ASC)
'active' (ASC)
```

#### Índices Compuestos
```javascript
// Clientes
['assignedTo', 'funnelStage']
['funnelStage', 'priority']
['assignedTo', 'createdAt']
['company', 'active']

// Facturas
['clientId', 'status']
['status', 'dueDate']
['status', 'invoiceDate']
['clientId', 'invoiceDate']

// Ofertas
['assignedTo', 'status']
['clientId', 'status']
['status', 'validUntil']
['assignedTo', 'offerDate']

// Actividades
['clientId', 'createdAt']
['userId', 'type']
['userId', 'createdAt']
['clientId', 'type']
```

---

## 🔐 Reglas de Seguridad Detalladas

### Estructura de Reglas por Colección

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Funciones helper
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && getUserRole() == 'superadmin';
    }
    
    function isAdmin() {
      return isAuthenticated() && (getUserRole() == 'admin' || getUserRole() == 'superadmin');
    }
    
    function isCommercialOrAdmin() {
      return isAuthenticated() && getUserRole() in ['comercial', 'admin', 'superadmin'];
    }
    
    function isOwnerOrAdmin(ownerId) {
      return isAuthenticated() && (request.auth.uid == ownerId || isAdmin());
    }
    
    // USUARIOS
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (request.auth.uid == userId || isSuperAdmin());
      allow delete: if isSuperAdmin();
    }
    
    // CLIENTES
    match /clientes/{clientId} {
      allow read: if isAuthenticated();
      allow create: if isCommercialOrAdmin() && 
        request.resource.data.keys().hasAll(['name', 'company', 'email', 'assignedTo', 'funnelStage']);
      allow update: if isCommercialOrAdmin() && 
        (resource.data.assignedTo == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
      
      // Subcolección de recordatorios
      match /recordatorios/{recordatorioId} {
        allow read, write: if isCommercialOrAdmin();
      }
      
      // Subcolección de actividades del cliente
      match /actividades/{actividadId} {
        allow read, write: if isCommercialOrAdmin();
      }
    }
    
    // PRODUCTOS
    match /productos/{productId} {
      allow read: if isAuthenticated();
      allow create, update: if isAdmin() && 
        request.resource.data.keys().hasAll(['name', 'sku', 'description', 'category', 'price']);
      allow delete: if isSuperAdmin();
    }
    
    // FACTURAS
    match /facturas/{invoiceId} {
      allow read: if isAuthenticated();
      allow create: if isCommercialOrAdmin() && 
        request.resource.data.keys().hasAll(['clientId', 'items', 'total']);
      allow update: if isCommercialOrAdmin() && 
        (resource.data.createdBy == request.auth.uid || isAdmin()) &&
        // No permitir modificar facturas pagadas
        resource.data.status != 'Pagada';
      allow delete: if isAdmin() && resource.data.status == 'Borrador';
      
      // Subcolección de pagos
      match /payments/{paymentId} {
        allow read, write: if isCommercialOrAdmin();
      }
    }
    
    // OFERTAS
    match /ofertas/{offerId} {
      allow read: if isAuthenticated();
      allow create: if isCommercialOrAdmin() && 
        request.resource.data.keys().hasAll(['clientId', 'items', 'total', 'assignedTo']);
      allow update: if isCommercialOrAdmin() && 
        (resource.data.assignedTo == request.auth.uid || isAdmin());
      allow delete: if isAdmin() || 
        (resource.data.assignedTo == request.auth.uid && resource.data.status == 'Borrador');
    }
    
    // EMPRESAS
    match /empresas/{empresaId} {
      allow read: if isAuthenticated();
      allow create, update: if isCommercialOrAdmin();
      allow delete: if isAdmin();
    }
    
    // ACTIVIDADES
    match /actividades/{actividadId} {
      allow read: if isAuthenticated();
      allow create: if isCommercialOrAdmin() && 
        request.resource.data.keys().hasAll(['type', 'subject', 'clientId', 'userId']) &&
        request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAdmin() || resource.data.userId == request.auth.uid;
    }
    
    // CONFIGURACIÓN
    match /configuracion/{configId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // CONTADORES
    match /counters/{counterId} {
      allow read: if isAuthenticated();
      allow write: if isCommercialOrAdmin();
    }
  }
}
```

---

## 🚀 Plan de Implementación por Fases

### Fase 1: Fundación (Semana 1-2)
**Objetivo**: Establecer la base del sistema

**Colecciones a implementar**:
- ✅ `users` - Sistema de usuarios y autenticación
- ✅ `configuracion` - Configuración básica del sistema
- ✅ `counters` - Contadores para numeración

**Tareas**:
1. Configurar Firebase project y reglas básicas
2. Implementar autenticación con roles
3. Crear estructura de usuarios con permisos
4. Configurar contadores automáticos
5. Sistema de configuración básica

### Fase 2: Gestión Comercial (Semana 3-4)
**Objetivo**: Core del CRM - gestión de clientes y oportunidades

**Colecciones a implementar**:
- ✅ `clientes` - Gestión completa de leads y clientes
- ✅ `empresas` - Información de empresas cliente
- ✅ `actividades` - Seguimiento de interacciones

**Tareas**:
1. CRUD completo de clientes con embudo de ventas
2. Sistema de actividades y seguimiento
3. Gestión de empresas y contactos múltiples
4. Dashboard comercial con métricas
5. Sistema de recordatorios y tareas

### Fase 3: Catálogo y Ofertas (Semana 5-6)
**Objetivo**: Gestión de productos y generación de ofertas

**Colecciones a implementar**:
- ✅ `productos` - Catálogo completo de productos
- ✅ `ofertas` - Sistema de ofertas comerciales

**Tareas**:
1. Catálogo de productos con especificaciones
2. Generación automática de ofertas
3. Sistema de aprobaciones y workflow
4. Conversión de ofertas a facturas
5. Gestión de stocks y disponibilidad

### Fase 4: Facturación (Semana 7-8)
**Objetivo**: Sistema completo de facturación

**Colecciones a implementar**:
- ✅ `facturas` - Facturación completa con pagos

**Tareas**:
1. Generación automática de facturas
2. Sistema de numeración automática
3. Gestión de pagos y vencimientos
4. Reportes de facturación
5. Integración contable básica

### Fase 5: Optimización y Analytics (Semana 9-10)
**Objetivo**: Optimización del rendimiento y análisis de datos

**Tareas**:
1. Optimización de índices y consultas
2. Dashboard de analytics avanzado
3. Reportes personalizados
4. Sistema de backups automático
5. Monitorización de rendimiento

---

## 📈 Métricas y KPIs del Sistema

### Métricas de Negocio

#### Embudo de Ventas
```javascript
// Distribución por etapa
const funnelStats = {
  'Lead': { count: 45, percentage: 30 },
  'Primer Contacto': { count: 25, percentage: 17 },
  'Interesado': { count: 20, percentage: 13 },
  'Demo Realizada': { count: 15, percentage: 10 },
  'Negociación': { count: 12, percentage: 8 },
  'En Cierre': { count: 8, percentage: 5 },
  'Ganado': { count: 15, percentage: 10 },
  'Perdido': { count: 10, percentage: 7 }
};

// Tasa de conversión
const conversionRate = (ganados / totalOportunidades) * 100;

// Tiempo promedio en cada etapa
const avgTimeByStage = {
  'Lead': '3 días',
  'Primer Contacto': '5 días',
  'Interesado': '10 días',
  'Demo Realizada': '7 días',
  'Negociación': '15 días',
  'En Cierre': '8 días'
};
```

#### Métricas Comerciales
```javascript
// Facturación mensual
const monthlyRevenue = {
  current: 125000,
  target: 150000,
  growth: 15.2 // porcentaje vs mes anterior
};

// Valor promedio por cliente
const avgDealSize = totalRevenue / numberOfDeals;

// Actividad comercial
const activityMetrics = {
  callsPerDay: 8.5,
  emailsPerDay: 12,
  meetingsPerWeek: 4,
  proposalsPerMonth: 6
};
```

### Métricas Técnicas

#### Rendimiento de Consultas
```javascript
// Consultas más utilizadas (tiempo promedio)
const queryPerformance = {
  'clientes.byAssignedTo': '45ms',
  'facturas.byStatus': '32ms',
  'ofertas.byClient': '28ms',
  'actividades.recent': '55ms'
};

// Uso de índices
const indexUsage = {
  'clientes_assignedTo_funnelStage': '1,245 lecturas/día',
  'facturas_status_dueDate': '856 lecturas/día',
  'ofertas_assignedTo_status': '432 lecturas/día'
};
```

#### Crecimiento de Datos
```javascript
// Documentos por colección
const collectionSize = {
  'clientes': 1250,
  'facturas': 890,
  'ofertas': 567,
  'actividades': 3400,
  'productos': 145,
  'users': 12
};

// Crecimiento mensual estimado
const monthlyGrowth = {
  'clientes': '+15%',
  'facturas': '+25%',
  'ofertas': '+20%',
  'actividades': '+40%'
};
```
