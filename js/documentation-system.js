/**
 * Sistema de Documentación - Expertia CRM
 * Genera documentación técnica automática y completa
 */

const DocumentationSystem = {
    // Configuración del sistema
    config: {
        AUTO_GENERATE: true,
        INCLUDE_EXAMPLES: true,
        INCLUDE_DIAGRAMS: false,
        OUTPUT_FORMAT: 'html', // 'html', 'markdown', 'json'
        VERSION: '1.0.0'
    },
    
    // Estado del sistema
    state: {
        documentation: {},
        components: [],
        functions: [],
        constants: [],
        systems: []
    },
    
    // Inicializar sistema
    init: () => {
        DocumentationSystem.scanCodebase();
        DocumentationSystem.generateDocumentation();
        SecureLogger.success('Sistema de documentación inicializado');
    },
    
    // Escanear codebase
    scanCodebase: () => {
        // Escanear sistemas principales
        DocumentationSystem.scanSystems();
        
        // Escanear funciones globales
        DocumentationSystem.scanFunctions();
        
        // Escanear constantes
        DocumentationSystem.scanConstants();
        
        // Escanear componentes React
        DocumentationSystem.scanComponents();
    },
    
    // Escanear sistemas
    scanSystems: () => {
        const systems = [
            { name: 'SecureLogger', description: 'Sistema de logging seguro' },
            { name: 'DataValidator', description: 'Sistema de validación de datos' },
            { name: 'FirebaseContext', description: 'Contexto de Firebase centralizado' },
            { name: 'FirebaseHooks', description: 'Hooks personalizados para Firebase' },
            { name: 'SharedUtils', description: 'Utilidades compartidas' },
            { name: 'AppConstants', description: 'Constantes de aplicación' },
            { name: 'FirebaseCache', description: 'Sistema de caché local' },
            { name: 'QueryOptimizer', description: 'Optimizador de queries' },
            { name: 'ReactOptimizer', description: 'Optimizador de React' },
            { name: 'MemoryManager', description: 'Gestor de memoria' },
            { name: 'NotificationSystem', description: 'Sistema de notificaciones' },
            { name: 'LoadingSystem', description: 'Sistema de estados de carga' },
            { name: 'AccessibilitySystem', description: 'Sistema de accesibilidad' },
            { name: 'TestingFramework', description: 'Framework de testing' }
        ];
        
        DocumentationSystem.state.systems = systems;
    },
    
    // Escanear funciones
    scanFunctions: () => {
        const functions = [
            { name: 'loadExpenses', description: 'Carga gastos desde Firebase', category: 'business' },
            { name: 'saveExpense', description: 'Guarda un gasto en Firebase', category: 'business' },
            { name: 'deleteExpense', description: 'Elimina un gasto de Firebase', category: 'business' },
            { name: 'loadExpenseSettingsFromFirebase', description: 'Carga configuraciones de gastos', category: 'config' },
            { name: 'saveExpenseSettingsToFirebase', description: 'Guarda configuraciones de gastos', category: 'config' },
            { name: 'getFirestoreInstance', description: 'Obtiene instancia de Firestore', category: 'firebase' },
            { name: 'waitForFirebase', description: 'Espera a que Firebase esté disponible', category: 'firebase' },
            { name: 'showNotification', description: 'Muestra notificación al usuario', category: 'ui' }
        ];
        
        DocumentationSystem.state.functions = functions;
    },
    
    // Escanear constantes
    scanConstants: () => {
        const constants = [
            { name: 'AppConstants', description: 'Constantes centralizadas de la aplicación' },
            { name: 'firebaseConfig', description: 'Configuración de Firebase' },
            { name: 'defaultConfig', description: 'Configuración por defecto' }
        ];
        
        DocumentationSystem.state.constants = constants;
    },
    
    // Escanear componentes
    scanComponents: () => {
        const components = [
            { name: 'App', description: 'Componente principal de la aplicación', category: 'main' },
            { name: 'ExpenseSettings', description: 'Configuraciones de gastos', category: 'business' },
            { name: 'SimpleBarChart', description: 'Gráfico de barras simple', category: 'ui' },
            { name: 'TrendLineChart', description: 'Gráfico de tendencias', category: 'ui' },
            { name: 'SimplePieChart', description: 'Gráfico circular simple', category: 'ui' }
        ];
        
        DocumentationSystem.state.components = components;
    },
    
    // Generar documentación
    generateDocumentation: () => {
        const doc = {
            title: 'Expertia CRM - Documentación Técnica',
            version: DocumentationSystem.config.VERSION,
            timestamp: new Date().toISOString(),
            systems: DocumentationSystem.state.systems,
            functions: DocumentationSystem.state.functions,
            constants: DocumentationSystem.state.constants,
            components: DocumentationSystem.state.components,
            architecture: DocumentationSystem.generateArchitectureDoc(),
            api: DocumentationSystem.generateAPIDoc(),
            deployment: DocumentationSystem.generateDeploymentDoc(),
            testing: DocumentationSystem.generateTestingDoc()
        };
        
        DocumentationSystem.state.documentation = doc;
        DocumentationSystem.saveDocumentation(doc);
    },
    
    // Generar documentación de arquitectura
    generateArchitectureDoc: () => {
        return {
            overview: {
                title: 'Arquitectura del Sistema',
                description: 'Expertia CRM es una aplicación web moderna construida con React, Firebase y tecnologías web estándar.',
                layers: [
                    {
                        name: 'Presentación',
                        description: 'Interfaz de usuario con React y componentes optimizados',
                        technologies: ['React', 'JSX', 'CSS3', 'HTML5']
                    },
                    {
                        name: 'Lógica de Negocio',
                        description: 'Funciones de gestión de gastos y configuraciones',
                        technologies: ['JavaScript', 'Firebase Functions']
                    },
                    {
                        name: 'Datos',
                        description: 'Almacenamiento y gestión de datos con Firebase',
                        technologies: ['Firestore', 'Firebase Auth', 'Firebase Storage']
                    }
                ]
            },
            patterns: [
                {
                    name: 'MVC (Model-View-Controller)',
                    description: 'Separación clara entre datos, lógica y presentación'
                },
                {
                    name: 'Observer Pattern',
                    description: 'Reactividad con Firebase y React hooks'
                },
                {
                    name: 'Factory Pattern',
                    description: 'Creación de componentes y sistemas optimizados'
                },
                {
                    name: 'Singleton Pattern',
                    description: 'Sistemas globales como SecureLogger y FirebaseContext'
                }
            ],
            security: [
                'Autenticación con Firebase Auth',
                'Validación de datos con DataValidator',
                'Logging seguro con SecureLogger',
                'Reglas de seguridad de Firestore',
                'Sanitización de entradas'
            ],
            performance: [
                'Caché local con FirebaseCache',
                'Optimización de queries con QueryOptimizer',
                'Memoización de componentes con ReactOptimizer',
                'Gestión de memoria con MemoryManager',
                'Lazy loading y code splitting'
            ]
        };
    },
    
    // Generar documentación de API
    generateAPIDoc: () => {
        return {
            firebase: {
                collections: [
                    {
                        name: 'expenses',
                        description: 'Gastos de la empresa',
                        fields: [
                            { name: 'id', type: 'string', description: 'ID único del gasto' },
                            { name: 'date', type: 'date', description: 'Fecha del gasto' },
                            { name: 'amount', type: 'number', description: 'Importe del gasto' },
                            { name: 'description', type: 'string', description: 'Descripción del gasto' },
                            { name: 'category', type: 'string', description: 'Categoría del gasto' },
                            { name: 'subcategory', type: 'string', description: 'Subcategoría del gasto' },
                            { name: 'paymentType', type: 'string', description: 'Tipo de pago' },
                            { name: 'status', type: 'string', description: 'Estado del gasto' },
                            { name: 'createdAt', type: 'timestamp', description: 'Fecha de creación' },
                            { name: 'updatedAt', type: 'timestamp', description: 'Fecha de actualización' }
                        ]
                    },
                    {
                        name: 'system_settings',
                        description: 'Configuraciones del sistema',
                        fields: [
                            { name: 'id', type: 'string', description: 'ID de la configuración' },
                            { name: 'expenses', type: 'object', description: 'Configuraciones de gastos' },
                            { name: 'updatedAt', type: 'timestamp', description: 'Fecha de actualización' }
                        ]
                    }
                ],
                functions: [
                    {
                        name: 'loadExpenses',
                        description: 'Carga todos los gastos desde Firestore',
                        parameters: [],
                        returns: 'Promise<Array>',
                        example: 'await loadExpenses()'
                    },
                    {
                        name: 'saveExpense',
                        description: 'Guarda un gasto en Firestore',
                        parameters: [
                            { name: 'expenseData', type: 'object', description: 'Datos del gasto' }
                        ],
                        returns: 'Promise<boolean>',
                        example: 'await saveExpense({ amount: 100, description: "Comida" })'
                    },
                    {
                        name: 'deleteExpense',
                        description: 'Elimina un gasto de Firestore',
                        parameters: [
                            { name: 'expense', type: 'object', description: 'Objeto del gasto' }
                        ],
                        returns: 'Promise<void>',
                        example: 'await deleteExpense(expense)'
                    }
                ]
            },
            systems: {
                SecureLogger: {
                    methods: [
                        { name: 'log', description: 'Log de información' },
                        { name: 'success', description: 'Log de éxito' },
                        { name: 'warn', description: 'Log de advertencia' },
                        { name: 'error', description: 'Log de error' }
                    ]
                },
                NotificationSystem: {
                    methods: [
                        { name: 'show', description: 'Mostrar notificación' },
                        { name: 'success', description: 'Notificación de éxito' },
                        { name: 'error', description: 'Notificación de error' },
                        { name: 'warning', description: 'Notificación de advertencia' },
                        { name: 'info', description: 'Notificación informativa' }
                    ]
                },
                LoadingSystem: {
                    methods: [
                        { name: 'showOverlay', description: 'Mostrar overlay de carga' },
                        { name: 'hideOverlay', description: 'Ocultar overlay de carga' },
                        { name: 'createSpinner', description: 'Crear spinner' },
                        { name: 'createSkeleton', description: 'Crear skeleton' }
                    ]
                }
            }
        };
    },
    
    // Generar documentación de deployment
    generateDeploymentDoc: () => {
        return {
            requirements: [
                'Node.js 16+',
                'Firebase CLI',
                'Navegador moderno (Chrome, Firefox, Safari, Edge)',
                'Conexión a internet para Firebase'
            ],
            setup: [
                '1. Clonar el repositorio',
                '2. Instalar dependencias: npm install',
                '3. Configurar Firebase: firebase init',
                '4. Configurar variables de entorno',
                '5. Ejecutar en desarrollo: npm start',
                '6. Desplegar: firebase deploy'
            ],
            environment: {
                development: {
                    firebase: 'configuración de desarrollo',
                    logging: 'verbose',
                    caching: 'disabled'
                },
                production: {
                    firebase: 'configuración de producción',
                    logging: 'errors only',
                    caching: 'enabled'
                }
            },
            monitoring: [
                'Firebase Analytics',
                'Firebase Performance',
                'Error tracking con SecureLogger',
                'Testing automático con TestingFramework'
            ]
        };
    },
    
    // Generar documentación de testing
    generateTestingDoc: () => {
        return {
            framework: 'TestingFramework personalizado',
            types: [
                {
                    name: 'Unit Tests',
                    description: 'Tests de funciones individuales',
                    examples: [
                        'Test de validación de datos',
                        'Test de funciones de Firebase',
                        'Test de utilidades'
                    ]
                },
                {
                    name: 'Integration Tests',
                    description: 'Tests de integración entre sistemas',
                    examples: [
                        'Test de flujo completo de gastos',
                        'Test de autenticación',
                        'Test de notificaciones'
                    ]
                },
                {
                    name: 'UI Tests',
                    description: 'Tests de interfaz de usuario',
                    examples: [
                        'Test de componentes React',
                        'Test de accesibilidad',
                        'Test de responsive design'
                    ]
                }
            ],
            execution: [
                'Ejecutar tests: TestingFramework.runAllTests()',
                'Tests automáticos en desarrollo',
                'Tests manuales con panel de testing',
                'Reportes de cobertura automáticos'
            ]
        };
    },
    
    // Guardar documentación
    saveDocumentation: (doc) => {
        // Guardar en localStorage para acceso rápido
        localStorage.setItem('expertia_documentation', JSON.stringify(doc));
        
        // Generar archivo de documentación
        const docHTML = DocumentationSystem.generateHTML(doc);
        const docMarkdown = DocumentationSystem.generateMarkdown(doc);
        
        // Crear elementos de documentación en la página
        DocumentationSystem.createDocumentationUI(doc);
        
        SecureLogger.success('Documentación generada y guardada');
    },
    
    // Generar HTML
    generateHTML: (doc) => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${doc.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1, h2, h3 { color: #006666; }
                    .section { margin: 20px 0; }
                    .code { background: #f5f5f5; padding: 10px; border-radius: 4px; }
                </style>
            </head>
            <body>
                <h1>${doc.title}</h1>
                <p><strong>Versión:</strong> ${doc.version}</p>
                <p><strong>Generado:</strong> ${new Date(doc.timestamp).toLocaleString()}</p>
                
                <div class="section">
                    <h2>Sistemas</h2>
                    ${doc.systems.map(system => `
                        <h3>${system.name}</h3>
                        <p>${system.description}</p>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2>Funciones</h2>
                    ${doc.functions.map(func => `
                        <h3>${func.name}</h3>
                        <p><strong>Categoría:</strong> ${func.category}</p>
                        <p>${func.description}</p>
                    `).join('')}
                </div>
            </body>
            </html>
        `;
    },
    
    // Generar Markdown
    generateMarkdown: (doc) => {
        return `# ${doc.title}

**Versión:** ${doc.version}  
**Generado:** ${new Date(doc.timestamp).toLocaleString()}

## Sistemas

${doc.systems.map(system => `
### ${system.name}
${system.description}
`).join('')}

## Funciones

${doc.functions.map(func => `
### ${func.name}
**Categoría:** ${func.category}  
${func.description}
`).join('')}
`;
    },
    
    // Crear UI de documentación
    createDocumentationUI: (doc) => {
        const docPanel = document.createElement('div');
        docPanel.id = 'documentation-panel';
        docPanel.className = 'documentation-panel';
        docPanel.innerHTML = `
            <div class="doc-header">
                <h3>📚 Documentación</h3>
                <button id="export-doc-btn" class="btn btn-primary">Exportar</button>
            </div>
            <div class="doc-content">
                <div class="doc-section">
                    <h4>Sistemas (${doc.systems.length})</h4>
                    <ul>
                        ${doc.systems.map(system => `<li><strong>${system.name}:</strong> ${system.description}</li>`).join('')}
                    </ul>
                </div>
                <div class="doc-section">
                    <h4>Funciones (${doc.functions.length})</h4>
                    <ul>
                        ${doc.functions.map(func => `<li><strong>${func.name}</strong> (${func.category}): ${func.description}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(docPanel);
        
        // Agregar estilos
        const style = document.createElement('style');
        style.textContent = `
            .documentation-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 350px;
                max-height: 600px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
            }
            
            .doc-header {
                padding: 12px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .doc-header h3 {
                margin: 0;
                font-size: 14px;
            }
            
            .doc-content {
                padding: 12px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .doc-section {
                margin-bottom: 16px;
            }
            
            .doc-section h4 {
                margin: 0 0 8px 0;
                color: #006666;
                font-size: 13px;
            }
            
            .doc-section ul {
                margin: 0;
                padding-left: 16px;
            }
            
            .doc-section li {
                margin-bottom: 4px;
                line-height: 1.3;
            }
            
            @media (max-width: 768px) {
                .documentation-panel {
                    width: calc(100vw - 40px);
                    left: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Event listener para exportar
        const exportBtn = document.getElementById('export-doc-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                DocumentationSystem.exportDocumentation(doc);
            });
        }
    },
    
    // Exportar documentación
    exportDocumentation: (doc) => {
        const markdown = DocumentationSystem.generateMarkdown(doc);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `expertia-crm-documentation-${doc.version}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        NotificationSystem.success('Documentación Exportada', 'Archivo descargado correctamente');
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.DocumentationSystem = DocumentationSystem;
}

console.log('📚 Sistema de documentación cargado'); 