/**
 * 🚀 Script de Inicialización Automática - Expertia CRM
 * 
 * Este script inicializa la base de datos Firebase con datos de ejemplo.
 * Para ejecutar: copiar y pegar en la consola del navegador con la aplicación abierta.
 */

(async function initializeFirebaseData() {
  console.log('🚀 Iniciando configuración de datos Firebase...');

  // Verificar que Firebase está disponible
  if (typeof db === 'undefined') {
    console.error('❌ Error: Firebase no está disponible. Asegúrate de que la aplicación esté cargada.');
    return;
  }

  try {
    // 1. Configuración General
    console.log('📋 Creando configuración general...');
    await db.collection('configuracion').doc('general').set({
      id: "general",
      company: {
        name: "Expertia Medical Solutions",
        taxId: "B12345678",
        address: "Calle Innovación 1, Madrid, 28001",
        phone: "+34 91 000 0000",
        email: "info@expertia.com",
        website: "https://expertia.com",
        logo: "./LOGO EXPERTIA MEDICAL SOLUTIONS.jpg"
      },
      invoice: {
        series: ["EXP", "ALQ", "PROF"],
        nextNumbers: {
          EXP: 1,
          ALQ: 1,
          PROF: 1
        },
        vatRate: 0.21,
        paymentTerms: 30,
        defaultCurrency: "EUR"
      },
      sales: {
        funnelStages: [
          "Lead",
          "Primer Contacto", 
          "Interesado",
          "Demo Realizada",
          "Negociación",
          "En Cierre",
          "Ganado",
          "Perdido"
        ],
        priorities: ["Alta", "Media", "Baja"],
        contactPreferences: ["Email", "Teléfono", "WhatsApp", "Visita Comercial"],
        sources: ["Web", "Referido", "Llamada Fría", "Evento", "Partner", "Publicidad"]
      },
      products: {
        categories: [
          "Diagnóstico por Imagen",
          "Cardiología",
          "Laboratorio", 
          "Quirófano",
          "UCI",
          "Emergencias",
          "Rehabilitación",
          "Servicios"
        ],
        suppliers: [
          "Storz Medical",
          "Zamar Medical",
          "Phillips Healthcare",
          "GE Healthcare",
          "Siemens Healthineers"
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: "system"
    });

    // 2. Productos
    console.log('📦 Creando productos de ejemplo...');
    const productos = [
      {
        id: "prod_001",
        name: "Equipo de Rayos X Digital",
        sku: "EXP-RX-001", 
        description: "Sistema completo de radiografía digital con panel detector de última generación",
        category: "Diagnóstico por Imagen",
        subcategory: "Radiología",
        supplier: "Storz Medical",
        brand: "Storz",
        model: "RX-Digital-Pro",
        price: {
          cost: 12000,
          sale: 15000,
          currency: "EUR"
        },
        specifications: {
          dimensions: "120x80x150 cm",
          weight: "250 kg", 
          power: "220V",
          certification: "CE, FDA"
        },
        availability: "Disponible",
        stock: 5,
        minStock: 2,
        warranty: {
          period: 24,
          unit: "months",
          type: "Completa"
        },
        active: true,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
        updatedBy: "system"
      },
      {
        id: "prod_002", 
        name: "Monitor de Signos Vitales",
        sku: "EXP-MSV-002",
        description: "Monitor multiparamétrico para UCI con pantalla táctil de 15 pulgadas",
        category: "UCI",
        subcategory: "Monitorización",
        supplier: "Zamar Medical",
        brand: "Zamar",
        model: "Vital-Pro-15",
        price: {
          cost: 2800,
          sale: 3500,
          currency: "EUR"
        },
        specifications: {
          screen: "15\" táctil",
          parameters: "ECG, SpO2, NIBP, Temperatura",
          connectivity: "WiFi, Ethernet",
          certification: "CE, FDA"
        },
        availability: "Disponible",
        stock: 12,
        minStock: 3,
        warranty: {
          period: 36,
          unit: "months", 
          type: "Completa"
        },
        active: true,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
        updatedBy: "system"
      },
      {
        id: "prod_003",
        name: "Desfibrilador Automático",
        sku: "EXP-DEA-003",
        description: "DEA con pantalla LCD, guía de voz y análisis automático del ritmo cardíaco",
        category: "Emergencias", 
        subcategory: "Reanimación",
        supplier: "Storz Medical",
        brand: "Storz",
        model: "Life-Save-Auto",
        price: {
          cost: 6800,
          sale: 8500,
          currency: "EUR"
        },
        specifications: {
          energy: "1-200 Joules",
          battery: "Litio, 5 años standby",
          display: "LCD con indicadores LED",
          certification: "CE, FDA"
        },
        availability: "Disponible",
        stock: 8,
        minStock: 2,
        warranty: {
          period: 60,
          unit: "months",
          type: "Completa"
        },
        active: true,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), 
        createdBy: "system",
        updatedBy: "system"
      }
    ];

    for (const producto of productos) {
      await db.collection('productos').doc(producto.id).set(producto);
    }

    // 3. Empresas
    console.log('🏢 Creando empresas de ejemplo...');
    const empresas = [
      {
        id: "emp_001",
        name: "Hospital San Juan",
        taxId: "A12345678",
        industry: "Sanidad",
        sector: "Público",
        size: "Grande",
        employees: 500,
        revenue: 15000000,
        website: "https://hospitalsanjuan.com",
        addresses: [
          {
            type: "Sede Principal",
            street: "Calle Mayor 123",
            city: "Madrid",
            postalCode: "28001",
            country: "España",
            isPrimary: true
          }
        ],
        tags: ["hospital", "publico", "madrid", "referencia"],
        notes: "Hospital de referencia en la zona norte de Madrid. Cliente estratégico con múltiples departamentos.",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
        updatedBy: "system"
      },
      {
        id: "emp_002",
        name: "Clínica Dental López",
        taxId: "B87654321",
        industry: "Sanidad",
        sector: "Privado", 
        size: "Pequeña",
        employees: 15,
        revenue: 800000,
        website: "https://clinicalopez.com",
        addresses: [
          {
            type: "Clínica Principal",
            street: "Av. Diagonal 456", 
            city: "Barcelona",
            postalCode: "08007",
            country: "España",
            isPrimary: true
          }
        ],
        tags: ["clinica", "dental", "barcelona", "privado"],
        notes: "Clínica dental especializada en implantología. Interesados en modernizar equipamiento.",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system", 
        updatedBy: "system"
      }
    ];

    for (const empresa of empresas) {
      await db.collection('empresas').doc(empresa.id).set(empresa);
    }

    // 4. Clientes
    console.log('👥 Creando clientes de ejemplo...');
    const clientes = [
      {
        id: "client_001",
        name: "Dr. Juan García",
        company: "Hospital San Juan",
        email: "j.garcia@hospitalsanjuan.com",
        phone: "+34 91 123 4567",
        mobile: "+34 600 123 456",
        address: {
          street: "Calle Mayor 123",
          city: "Madrid", 
          postalCode: "28001",
          country: "España"
        },
        position: "Director Médico",
        department: "Dirección",
        funnelStage: "Ganado",
        contactPreference: "Email",
        productInterest: ["radiologia", "cardiologia"],
        source: "Referido",
        assignedTo: "comercial_001",
        priority: "Alta",
        budget: {
          estimated: 50000,
          currency: "EUR"
        },
        tags: ["hospital", "publico", "director", "decisor"],
        notes: "Director médico con capacidad de decisión. Muy interesado en modernizar el área de diagnóstico.",
        consentGiven: true,
        acceptsMarketing: true,
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "comercial_001",
        updatedBy: "comercial_001"
      },
      {
        id: "client_002", 
        name: "Dra. María López",
        company: "Clínica Dental López",
        email: "maria@clinicalopez.com",
        phone: "+34 93 234 5678",
        mobile: "+34 610 234 567",
        address: {
          street: "Av. Diagonal 456",
          city: "Barcelona",
          postalCode: "08007", 
          country: "España"
        },
        position: "Directora",
        department: "Dirección",
        funnelStage: "En Cierre",
        contactPreference: "Teléfono",
        productInterest: ["dental", "radiologia"],
        source: "Web",
        assignedTo: "comercial_001", 
        priority: "Alta",
        budget: {
          estimated: 15000,
          currency: "EUR"
        },
        nextAction: {
          type: "Llamada",
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 días
          description: "Llamada de seguimiento para cerrar propuesta de equipamiento dental"
        },
        tags: ["clinica", "dental", "directora", "barcelona"],
        notes: "Directora de clínica dental. Muy interesada en nuestros equipos de radiología dental.",
        consentGiven: true,
        acceptsMarketing: false,
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ayer
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Hace 10 días
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "comercial_001",
        updatedBy: "comercial_001"
      }
    ];

    for (const cliente of clientes) {
      await db.collection('clientes').doc(cliente.id).set(cliente);
    }

    // 5. Contadores
    console.log('🔢 Creando contadores...');
    const contadores = [
      { id: "EXP", current: 1, description: "Facturas de venta" },
      { id: "ALQ", current: 1, description: "Facturas de alquiler" },
      { id: "PROF", current: 1, description: "Facturas proforma" },
      { id: "offers", count: 1, description: "Numeración de ofertas" }
    ];

    for (const contador of contadores) {
      await db.collection('counters').doc(contador.id).set({
        ...contador,
        updatedAt: new Date().toISOString()
      });
    }

    // 6. Crear algunas actividades de ejemplo
    console.log('📋 Creando actividades de ejemplo...');
    const actividades = [
      {
        id: "act_001",
        clientId: "client_001",
        type: "Llamada",
        subject: "Primera llamada de contacto",
        description: "Llamada inicial para presentar Expertia Medical Solutions y conocer necesidades del hospital.",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        outcome: "Interesado en equipos de diagnóstico por imagen",
        nextAction: {
          type: "Visita",
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Visita para demo de equipo de rayos X"
        },
        assignedTo: "comercial_001",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "comercial_001"
      },
      {
        id: "act_002",
        clientId: "client_002",
        type: "Email",
        subject: "Envío de propuesta comercial",
        description: "Enviada propuesta detallada para equipamiento de radiología dental incluyendo instalación y formación.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: "Propuesta recibida, pendiente de revisión",
        nextAction: {
          type: "Llamada",
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Llamada de seguimiento para resolver dudas sobre la propuesta"
        },
        assignedTo: "comercial_001",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "comercial_001"
      }
    ];

    for (const actividad of actividades) {
      await db.collection('actividades').doc(actividad.id).set(actividad);
    }

    console.log('✅ ¡Inicialización completada exitosamente!');
    console.log('📊 Datos creados:');
    console.log('   • 1 configuración general');
    console.log('   • 3 productos');
    console.log('   • 2 empresas');
    console.log('   • 2 clientes');
    console.log('   • 4 contadores');
    console.log('   • 2 actividades');
    console.log('');
    console.log('🔄 Recarga la página para ver los datos en la aplicación.');

  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  }
})();

// Función auxiliar para limpiar todos los datos (usar con precaución)
window.limpiarDatosFirebase = async function() {
  if (!confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
    return;
  }

  console.log('🗑️ Eliminando todos los datos...');

  try {
    const colecciones = ['configuracion', 'productos', 'empresas', 'clientes', 'counters', 'actividades', 'users', 'facturas', 'ofertas'];

    for (const coleccion of colecciones) {
      const snapshot = await db.collection(coleccion).get();
      const batch = db.batch();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Eliminada colección: ${coleccion}`);
    }

    console.log('✅ Todos los datos han sido eliminados.');
  } catch (error) {
    console.error('❌ Error eliminando datos:', error);
  }
};
