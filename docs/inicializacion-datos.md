# 🚀 Script de Inicialización de Datos - Expertia CRM

## Configuración Inicial de Firebase Firestore

Este script debe ejecutarse una vez para crear la estructura inicial de datos en Firebase.

### 1. Configuración General

```javascript
// Documento: configuracion/general
{
  "id": "general",
  "company": {
    "name": "Expertia Medical Solutions",
    "taxId": "B12345678",
    "address": "Calle Innovación 1, Madrid, 28001",
    "phone": "+34 91 000 0000",
    "email": "info@expertia.com",
    "website": "https://expertia.com",
    "logo": "./LOGO_EXPERTIA.jpg"
  },
  "invoice": {
    "series": ["EXP", "ALQ", "PROF"],
    "nextNumbers": {
      "EXP": 1,
      "ALQ": 1,
      "PROF": 1
    },
    "vatRate": 0.21,
    "paymentTerms": 30,
    "defaultCurrency": "EUR"
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
    "priorities": ["Alta", "Media", "Baja"],
    "contactPreferences": ["Email", "Teléfono", "WhatsApp", "Visita Comercial"],
    "sources": ["Web", "Referido", "Llamada Fría", "Evento", "Partner", "Publicidad"]
  },
  "products": {
    "categories": [
      "Diagnóstico por Imagen",
      "Cardiología",
      "Laboratorio", 
      "Quirófano",
      "UCI",
      "Emergencias",
      "Rehabilitación",
      "Servicios"
    ],
    "suppliers": [
      "Storz Medical",
      "Zamar Medical",
      "Phillips Healthcare",
      "GE Healthcare",
      "Siemens Healthineers"
    ]
  },
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "updatedBy": "system"
}
```

### 2. Productos Iniciales

```javascript
// Documento: productos/prod_001
{
  "id": "prod_001",
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
  "availability": "Disponible",
  "stock": 5,
  "minStock": 2,
  "warranty": {
    "period": 24,
    "unit": "months",
    "type": "Completa"
  },
  "active": true,
  "featured": true,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}

// Documento: productos/prod_002
{
  "id": "prod_002", 
  "name": "Monitor de Signos Vitales",
  "sku": "EXP-MSV-002",
  "description": "Monitor multiparamétrico para UCI con pantalla táctil de 15 pulgadas",
  "category": "UCI",
  "subcategory": "Monitorización",
  "supplier": "Zamar Medical",
  "brand": "Zamar",
  "model": "Vital-Pro-15",
  "price": {
    "cost": 2800,
    "sale": 3500,
    "currency": "EUR"
  },
  "specifications": {
    "screen": "15\" táctil",
    "parameters": "ECG, SpO2, NIBP, Temperatura",
    "connectivity": "WiFi, Ethernet",
    "certification": "CE, FDA"
  },
  "availability": "Disponible",
  "stock": 12,
  "minStock": 3,
  "warranty": {
    "period": 36,
    "unit": "months", 
    "type": "Completa"
  },
  "active": true,
  "featured": true,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}

// Documento: productos/prod_003
{
  "id": "prod_003",
  "name": "Desfibrilador Automático",
  "sku": "EXP-DEA-003",
  "description": "DEA con pantalla LCD, guía de voz y análisis automático del ritmo cardíaco",
  "category": "Emergencias", 
  "subcategory": "Reanimación",
  "supplier": "Storz Medical",
  "brand": "Storz",
  "model": "Life-Save-Auto",
  "price": {
    "cost": 6800,
    "sale": 8500,
    "currency": "EUR"
  },
  "specifications": {
    "energy": "1-200 Joules",
    "battery": "Litio, 5 años standby",
    "display": "LCD con indicadores LED",
    "certification": "CE, FDA"
  },
  "availability": "Disponible",
  "stock": 8,
  "minStock": 2,
  "warranty": {
    "period": 60,
    "unit": "months",
    "type": "Completa"
  },
  "active": true,
  "featured": false,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z", 
  "createdBy": "system",
  "updatedBy": "system"
}
```

### 3. Empresas de Ejemplo

```javascript
// Documento: empresas/emp_001
{
  "id": "emp_001",
  "name": "Hospital San Juan",
  "taxId": "A12345678",
  "industry": "Sanidad",
  "sector": "Público",
  "size": "Grande",
  "employees": 500,
  "revenue": 15000000,
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
  "tags": ["hospital", "publico", "madrid", "referencia"],
  "notes": "Hospital de referencia en la zona norte de Madrid. Cliente estratégico con múltiples departamentos.",
  "active": true,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}

// Documento: empresas/emp_002  
{
  "id": "emp_002",
  "name": "Clínica Dental López",
  "taxId": "B87654321",
  "industry": "Sanidad",
  "sector": "Privado", 
  "size": "Pequeña",
  "employees": 15,
  "revenue": 800000,
  "website": "https://clinicalopez.com",
  "addresses": [
    {
      "type": "Clínica Principal",
      "street": "Av. Diagonal 456", 
      "city": "Barcelona",
      "postalCode": "08007",
      "country": "España",
      "isPrimary": true
    }
  ],
  "tags": ["clinica", "dental", "barcelona", "privado"],
  "notes": "Clínica dental especializada en implantología. Interesados en modernizar equipamiento.",
  "active": true,
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "system", 
  "updatedBy": "system"
}
```

### 4. Clientes de Ejemplo

```javascript
// Documento: clientes/client_001
{
  "id": "client_001",
  "name": "Dr. Juan García",
  "company": "Hospital San Juan",
  "email": "j.garcia@hospitalsanjuan.com",
  "phone": "+34 91 123 4567",
  "mobile": "+34 600 123 456",
  "address": {
    "street": "Calle Mayor 123",
    "city": "Madrid", 
    "postalCode": "28001",
    "country": "España"
  },
  "position": "Director Médico",
  "department": "Dirección",
  "funnelStage": "Ganado",
  "contactPreference": "Email",
  "productInterest": ["radiologia", "cardiologia"],
  "source": "Referido",
  "assignedTo": "comercial_001",
  "priority": "Alta",
  "budget": {
    "estimated": 50000,
    "currency": "EUR"
  },
  "tags": ["hospital", "publico", "director", "decisor"],
  "notes": "Director médico con capacidad de decisión. Muy interesado en modernizar el área de diagnóstico.",
  "consentGiven": true,
  "acceptsMarketing": true,
  "lastContact": "2025-07-18T14:30:00Z",
  "createdAt": "2025-07-15T10:30:00Z",
  "updatedAt": "2025-07-18T14:30:00Z",
  "createdBy": "comercial_001",
  "updatedBy": "comercial_001"
}

// Documento: clientes/client_002
{
  "id": "client_002", 
  "name": "Dra. María López",
  "company": "Clínica Dental López",
  "email": "maria@clinicalopez.com",
  "phone": "+34 93 234 5678",
  "mobile": "+34 610 234 567",
  "address": {
    "street": "Av. Diagonal 456",
    "city": "Barcelona",
    "postalCode": "08007", 
    "country": "España"
  },
  "position": "Directora",
  "department": "Dirección",
  "funnelStage": "En Cierre",
  "contactPreference": "Teléfono",
  "productInterest": ["dental", "radiologia"],
  "source": "Web",
  "assignedTo": "comercial_001", 
  "priority": "Alta",
  "budget": {
    "estimated": 15000,
    "currency": "EUR"
  },
  "nextAction": {
    "type": "Llamada",
    "date": "2025-07-22T10:00:00Z",
    "description": "Llamada de seguimiento para cerrar propuesta de equipamiento dental"
  },
  "tags": ["clinica", "dental", "directora", "barcelona"],
  "notes": "Directora de clínica dental. Muy interesada en nuestros equipos de radiología dental.",
  "consentGiven": true,
  "acceptsMarketing": false,
  "lastContact": "2025-07-19T16:00:00Z",
  "createdAt": "2025-07-10T11:00:00Z",
  "updatedAt": "2025-07-19T16:00:00Z", 
  "createdBy": "comercial_001",
  "updatedBy": "comercial_001"
}
```

### 5. Contadores Iniciales

```javascript
// Documento: counters/EXP
{
  "id": "EXP",
  "current": 1,
  "description": "Facturas de venta",
  "updatedAt": "2025-07-20T10:30:00Z"
}

// Documento: counters/ALQ  
{
  "id": "ALQ",
  "current": 1,
  "description": "Facturas de alquiler",
  "updatedAt": "2025-07-20T10:30:00Z"
}

// Documento: counters/PROF
{
  "id": "PROF", 
  "current": 1,
  "description": "Facturas proforma",
  "updatedAt": "2025-07-20T10:30:00Z"
}

// Documento: counters/offers
{
  "id": "offers",
  "count": 1,
  "description": "Numeración de ofertas",
  "updatedAt": "2025-07-20T10:30:00Z"
}
```

### 6. Usuario Administrador Inicial

```javascript
// Documento: users/admin_user_id (usar UID real de Firebase Auth)
{
  "id": "admin_user_id",
  "email": "admin@expertia.com",
  "name": "Administrador",
  "role": "admin",
  "active": true,
  "permissions": {
    "canCreateClients": true,
    "canDeleteClients": true,
    "canCreateInvoices": true,
    "canViewReports": true,
    "canManageProducts": true,
    "canManageUsers": true,
    "canManageConfig": true
  },
  "preferences": {
    "language": "es",
    "timezone": "Europe/Madrid",
    "notifications": true
  },
  "createdAt": "2025-07-20T10:30:00Z",
  "updatedAt": "2025-07-20T10:30:00Z",
  "createdBy": "system",
  "updatedBy": "system"
}
```

---

## 🔧 Instrucciones de Instalación

1. **Crear las colecciones** en Firebase Console
2. **Copiar y pegar** cada documento en su colección correspondiente
3. **Actualizar** los IDs de usuario con UIDs reales de Firebase Auth
4. **Verificar** las reglas de seguridad están aplicadas
5. **Crear índices** según las necesidades de consulta

---

## 📊 Índices Recomendados

Crear estos índices compuestos en Firebase Console:

1. **clientes**: `funnelStage` (ASC) + `createdAt` (DESC)
2. **clientes**: `assignedTo` (ASC) + `funnelStage` (ASC)
3. **facturas**: `clientId` (ASC) + `status` (ASC)
4. **ofertas**: `assignedTo` (ASC) + `status` (ASC)
5. **actividades**: `clientId` (ASC) + `createdAt` (DESC)

---

## ⚠️ Notas Importantes

- Cambiar todos los IDs de usuario por UIDs reales de Firebase Auth
- Actualizar información de la empresa en configuración/general
- Personalizar productos según el catálogo real
- Configurar backup automático en Firebase Console
- Monitorizar uso y costos en Firebase Console
