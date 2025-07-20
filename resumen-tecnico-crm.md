# 🧠 Resumen Técnico – Expertia CRM v2.3

## 1. Arquitectura y Stack Tecnológico

- **Tipo de App**: Single-Page Application (SPA)  
- **Frontend**: React v18 + Tailwind CSS  
- **Gráficos**: Recharts  
- **Backend y Base de Datos**: Google Firebase (Firestore + Authentication)  
- **Distribución**: App de escritorio autocontenida con Electron  
- **Carga de recursos**: Dependencias desde CDNs en `index.html`

---

## 2. Módulos Funcionales

### 📁 Módulo 1: Gestión de Clientes (Dashboard)

- CRUD completo de clientes
- **Modelo de Datos**:
  - Nombre, clínica, email, teléfono
  - Dirección completa (calle, ciudad, CP, provincia)
  - Interés en productos (Storz/Zamar), notas de seguimiento
  - IBAN para domiciliación
- **Embudo de Ventas**: Visualización por etiquetas (Tags)
- **Consentimiento RGPD**:
  - `consentGiven` (obligatorio)
  - `acceptsMarketing` (opcional)

---

### 👤 Módulo 2: Ficha de Cliente y Seguimiento

- **Tareas y Recordatorios**:
  - Asignables por cliente, con fecha de vencimiento
- **Canal preferido de contacto**
- **Generadores de Documentos**:
  - Consentimiento RGPD (pre-rellenado)
  - Mandato SEPA (listo para firmar)
- **Parque Instalado y SAT**:
  - Registro de equipos con número de serie
  - Historial de incidencias por equipo

---

### 📄 Módulo 3: Ofertas Comerciales

- Asistente guiado para crear ofertas profesionales
- Dashboard con listado, visualización e impresión

---

### 💰 Módulo 4: Contabilidad y Facturación (VERIFACTU Simulado)

- CRUD de productos
- Facturación inalterable:
  - Doble serie (EXP/ALQ), contadores correlativos
  - Proformas convertibles a finales
  - Facturas rectificativas
- Simulación VERIFACTU:
  - Hash SHA-256 encadenado
  - Firma digital simulada + QR en factura
- Registro de pagos:
  - Parciales o completos
  - Cambio automático de estado a "Pagada"

---

### 🏦 Módulo 5: Gestión de Cobros (Remesas SEPA)

- Almacenamiento de IBAN + Mandato SEPA (ID + fecha)
- Selección de facturas finalizadas pendientes de cobro
- Generación de fichero XML (`pain.008.001.02`) para el banco

---

### 📊 Módulo 6: Informes de Ventas

- Dashboard visual con:
  - KPIs: Ventas Totales, Nº Facturas Pagadas, Ticket Medio
  - Gráficos: evolución mensual/trimestral
- Filtros dinámicos por producto y comercial

---

### 🧑‍💼 Módulo 7: Gestión de Perfiles y Marketing

- Perfil del comercial (incluye foto)
- Herramienta de comunicaciones masivas (Email BCC / WhatsApp)
  - Filtrado por consentimiento de marketing

---

**📦 Sugerencia de ubicación en el proyecto:**  
`/docs/resumen-tecnico-crm.md`
