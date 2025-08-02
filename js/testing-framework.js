/**
 * Framework de Testing - Expertia CRM
 * Sistema completo de tests unitarios e integración
 */

const TestingFramework = {
    // Configuración del framework
    config: {
        TIMEOUT: 5000,
        RETRY_ATTEMPTS: 3,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        AUTO_RUN: true
    },
    
    // Estado del testing
    state: {
        tests: [],
        results: {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0
        },
        currentTest: null,
        isRunning: false
    },
    
    // Inicializar framework
    init: () => {
        TestingFramework.setupUI();
        TestingFramework.setupEventListeners();
        SecureLogger.success('Framework de testing inicializado');
    },
    
    // Configurar UI de testing
    setupUI: () => {
        const testPanel = document.createElement('div');
        testPanel.id = 'testing-panel';
        testPanel.className = 'testing-panel';
        testPanel.innerHTML = `
            <div class="testing-header">
                <h3>🧪 Testing Framework</h3>
                <button id="run-tests-btn" class="btn btn-primary">Ejecutar Tests</button>
                <button id="clear-results-btn" class="btn btn-secondary">Limpiar</button>
            </div>
            <div class="testing-content">
                <div class="test-summary">
                    <span class="test-passed">✅ <span id="passed-count">0</span></span>
                    <span class="test-failed">❌ <span id="failed-count">0</span></span>
                    <span class="test-skipped">⏭️ <span id="skipped-count">0</span></span>
                </div>
                <div id="test-results" class="test-results"></div>
            </div>
        `;
        
        document.body.appendChild(testPanel);
        
        // Agregar estilos
        const style = document.createElement('style');
        style.textContent = `
            .testing-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 400px;
                max-height: 500px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
            }
            
            .testing-header {
                padding: 12px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .testing-header h3 {
                margin: 0;
                font-size: 14px;
            }
            
            .testing-content {
                padding: 12px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .test-summary {
                display: flex;
                gap: 12px;
                margin-bottom: 12px;
                font-weight: bold;
            }
            
            .test-passed { color: #10B981; }
            .test-failed { color: #EF4444; }
            .test-skipped { color: #F59E0B; }
            
            .test-results {
                font-size: 11px;
            }
            
            .test-item {
                padding: 4px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .test-item.passed { color: #10B981; }
            .test-item.failed { color: #EF4444; }
            .test-item.skipped { color: #F59E0B; }
            
            .test-duration {
                color: #6B7280;
                font-size: 10px;
            }
            
            .test-error {
                color: #EF4444;
                font-size: 10px;
                margin-top: 4px;
            }
            
            .btn {
                padding: 4px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 11px;
            }
            
            .btn-primary {
                background: #006666;
                color: white;
                border-color: #006666;
            }
            
            .btn-secondary {
                background: #6B7280;
                color: white;
                border-color: #6B7280;
            }
            
            @media (max-width: 768px) {
                .testing-panel {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    // Configurar event listeners
    setupEventListeners: () => {
        const runTestsBtn = document.getElementById('run-tests-btn');
        const clearResultsBtn = document.getElementById('clear-results-btn');
        
        if (runTestsBtn) {
            runTestsBtn.addEventListener('click', () => {
                TestingFramework.runAllTests();
            });
        }
        
        if (clearResultsBtn) {
            clearResultsBtn.addEventListener('click', () => {
                TestingFramework.clearResults();
            });
        }
    },
    
    // Registrar test
    registerTest: (name, testFunction, options = {}) => {
        const test = {
            id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            function: testFunction,
            category: options.category || 'general',
            critical: options.critical || false,
            timeout: options.timeout || TestingFramework.config.TIMEOUT,
            retries: options.retries || TestingFramework.config.RETRY_ATTEMPTS,
            dependencies: options.dependencies || []
        };
        
        TestingFramework.state.tests.push(test);
        return test.id;
    },
    
    // Ejecutar test individual
    runTest: async (test) => {
        const startTime = Date.now();
        let attempts = 0;
        let lastError = null;
        
        while (attempts < test.retries) {
            try {
                TestingFramework.state.currentTest = test;
                
                // Verificar dependencias
                for (const dependency of test.dependencies) {
                    if (!TestingFramework.checkDependency(dependency)) {
                        throw new Error(`Dependencia no satisfecha: ${dependency}`);
                    }
                }
                
                // Ejecutar test
                const result = await Promise.race([
                    test.function(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), test.timeout)
                    )
                ]);
                
                const duration = Date.now() - startTime;
                TestingFramework.recordResult(test, 'passed', duration, result);
                return true;
                
            } catch (error) {
                lastError = error;
                attempts++;
                
                if (attempts < test.retries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        const duration = Date.now() - startTime;
        TestingFramework.recordResult(test, 'failed', duration, null, lastError);
        return false;
    },
    
    // Verificar dependencia
    checkDependency: (dependency) => {
        switch (dependency) {
            case 'firebase':
                return typeof window.firebase !== 'undefined';
            case 'auth':
                return typeof window.authManager !== 'undefined';
            case 'notification':
                return typeof NotificationSystem !== 'undefined';
            case 'loading':
                return typeof LoadingSystem !== 'undefined';
            case 'accessibility':
                return typeof AccessibilitySystem !== 'undefined';
            default:
                return true;
        }
    },
    
    // Registrar resultado
    recordResult: (test, status, duration, result, error = null) => {
        const testResult = {
            test,
            status,
            duration,
            result,
            error,
            timestamp: new Date()
        };
        
        // Actualizar contadores
        switch (status) {
            case 'passed':
                TestingFramework.state.results.passed++;
                break;
            case 'failed':
                TestingFramework.state.results.failed++;
                break;
            case 'skipped':
                TestingFramework.state.results.skipped++;
                break;
        }
        
        TestingFramework.state.results.total++;
        
        // Actualizar UI
        TestingFramework.updateUI(testResult);
        
        // Log
        const logMessage = `${status.toUpperCase()}: ${test.name} (${duration}ms)`;
        if (status === 'passed') {
            SecureLogger.success(logMessage);
        } else {
            SecureLogger.error(logMessage, error);
        }
    },
    
    // Actualizar UI
    updateUI: (testResult) => {
        const resultsContainer = document.getElementById('test-results');
        const passedCount = document.getElementById('passed-count');
        const failedCount = document.getElementById('failed-count');
        const skippedCount = document.getElementById('skipped-count');
        
        if (resultsContainer) {
            const testItem = document.createElement('div');
            testItem.className = `test-item ${testResult.status}`;
            testItem.innerHTML = `
                <div>
                    <strong>${testResult.test.name}</strong>
                    <span class="test-duration">(${testResult.duration}ms)</span>
                </div>
                ${testResult.error ? `<div class="test-error">${testResult.error.message}</div>` : ''}
            `;
            resultsContainer.appendChild(testItem);
        }
        
        if (passedCount) passedCount.textContent = TestingFramework.state.results.passed;
        if (failedCount) failedCount.textContent = TestingFramework.state.results.failed;
        if (skippedCount) skippedCount.textContent = TestingFramework.state.results.skipped;
    },
    
    // Ejecutar todos los tests
    runAllTests: async () => {
        if (TestingFramework.state.isRunning) {
            console.log('⚠️ Tests ya en ejecución');
            return;
        }
        
        TestingFramework.state.isRunning = true;
        TestingFramework.clearResults();
        
        console.log('🧪 Iniciando ejecución de tests...');
        
        const startTime = Date.now();
        let passed = 0;
        let failed = 0;
        
        for (const test of TestingFramework.state.tests) {
            const result = await TestingFramework.runTest(test);
            if (result) {
                passed++;
            } else {
                failed++;
            }
        }
        
        const totalTime = Date.now() - startTime;
        
        console.log(`✅ Tests completados: ${passed} pasados, ${failed} fallidos (${totalTime}ms)`);
        
        TestingFramework.state.isRunning = false;
        
        // Mostrar resumen
        if (failed === 0) {
            NotificationSystem.success('Tests Completados', `Todos los tests pasaron (${passed} tests)`);
        } else {
            NotificationSystem.warning('Tests Completados', `${passed} pasados, ${failed} fallidos`);
        }
    },
    
    // Limpiar resultados
    clearResults: () => {
        const resultsContainer = document.getElementById('test-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        
        TestingFramework.state.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0
        };
        
        const passedCount = document.getElementById('passed-count');
        const failedCount = document.getElementById('failed-count');
        const skippedCount = document.getElementById('skipped-count');
        
        if (passedCount) passedCount.textContent = '0';
        if (failedCount) failedCount.textContent = '0';
        if (skippedCount) skippedCount.textContent = '0';
    },
    
    // Tests predefinidos
    registerDefaultTests: () => {
        // Test de Firebase
        TestingFramework.registerTest(
            'Firebase Connection',
            async () => {
                if (!window.firebase) {
                    throw new Error('Firebase no está disponible');
                }
                return true;
            },
            { category: 'firebase', critical: true }
        );
        
        // Test de autenticación
        TestingFramework.registerTest(
            'Authentication System',
            async () => {
                if (!window.authManager) {
                    throw new Error('Sistema de autenticación no disponible');
                }
                return true;
            },
            { category: 'auth', critical: true, dependencies: ['firebase'] }
        );
        
        // Test de notificaciones
        TestingFramework.registerTest(
            'Notification System',
            async () => {
                if (!NotificationSystem) {
                    throw new Error('Sistema de notificaciones no disponible');
                }
                
                // Test de notificación
                const notification = NotificationSystem.success('Test', 'Notificación de prueba');
                if (!notification) {
                    throw new Error('No se pudo crear notificación');
                }
                
                return true;
            },
            { category: 'ui', critical: false }
        );
        
        // Test de loading
        TestingFramework.registerTest(
            'Loading System',
            async () => {
                if (!LoadingSystem) {
                    throw new Error('Sistema de loading no disponible');
                }
                
                // Test de spinner
                const spinner = LoadingSystem.createSpinner('md');
                if (!spinner) {
                    throw new Error('No se pudo crear spinner');
                }
                
                return true;
            },
            { category: 'ui', critical: false }
        );
        
        // Test de accesibilidad
        TestingFramework.registerTest(
            'Accessibility System',
            async () => {
                if (!AccessibilitySystem) {
                    throw new Error('Sistema de accesibilidad no disponible');
                }
                
                // Test de anuncio
                AccessibilitySystem.announceToScreenReader('Test de accesibilidad');
                
                return true;
            },
            { category: 'accessibility', critical: false }
        );
        
        // Test de funciones de gastos
        TestingFramework.registerTest(
            'Expense Functions',
            async () => {
                if (typeof window.loadExpenses !== 'function') {
                    throw new Error('Función loadExpenses no disponible');
                }
                
                if (typeof window.saveExpense !== 'function') {
                    throw new Error('Función saveExpense no disponible');
                }
                
                return true;
            },
            { category: 'business', critical: true, dependencies: ['firebase', 'auth'] }
        );
        
        // Test de configuración
        TestingFramework.registerTest(
            'Configuration System',
            async () => {
                if (!AppConstants) {
                    throw new Error('Constantes de aplicación no disponibles');
                }
                
                return true;
            },
            { category: 'config', critical: false }
        );
        
        // Test de validación
        TestingFramework.registerTest(
            'Validation System',
            async () => {
                if (!DataValidator) {
                    throw new Error('Sistema de validación no disponible');
                }
                
                return true;
            },
            { category: 'security', critical: true }
        );
        
        // Test de logging
        TestingFramework.registerTest(
            'Logging System',
            async () => {
                if (!SecureLogger) {
                    throw new Error('Sistema de logging no disponible');
                }
                
                SecureLogger.log('Test de logging');
                
                return true;
            },
            { category: 'security', critical: false }
        );
        
        // Test de caché
        TestingFramework.registerTest(
            'Cache System',
            async () => {
                if (!FirebaseCache) {
                    throw new Error('Sistema de caché no disponible');
                }
                
                return true;
            },
            { category: 'performance', critical: false }
        );
        
        // Test de optimización
        TestingFramework.registerTest(
            'Optimization Systems',
            async () => {
                if (!QueryOptimizer && !ReactOptimizer && !MemoryManager) {
                    throw new Error('Sistemas de optimización no disponibles');
                }
                
                return true;
            },
            { category: 'performance', critical: false }
        );
    },
    
    // Generar reporte
    generateReport: () => {
        const results = TestingFramework.state.results;
        const tests = TestingFramework.state.tests;
        
        return {
            summary: {
                total: results.total,
                passed: results.passed,
                failed: results.failed,
                skipped: results.skipped,
                successRate: results.total > 0 ? (results.passed / results.total) * 100 : 0
            },
            tests: tests.map(test => ({
                name: test.name,
                category: test.category,
                critical: test.critical,
                status: 'pending' // Se actualizaría durante la ejecución
            })),
            timestamp: new Date().toISOString()
        };
    }
};

// Exponer globalmente
if (typeof window !== 'undefined') {
    window.TestingFramework = TestingFramework;
}

console.log('🧪 Framework de testing cargado'); 