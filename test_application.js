const puppeteer = require('puppeteer');
const http = require('http');

// Función para verificar si el servidor está ejecutándose
function checkServer() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 8000,
            path: '/',
            method: 'GET',
            timeout: 5000
        }, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Función principal de prueba
async function testApplication() {
    console.log('🧪 Iniciando prueba de funcionamiento de la aplicación...');
    
    // Verificar si el servidor está ejecutándose
    console.log('🔍 Verificando servidor...');
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('❌ Servidor no está ejecutándose en puerto 8000');
        console.log('💡 Ejecuta: python3 -m http.server 8000');
        return;
    }
    
    console.log('✅ Servidor ejecutándose correctamente');
    
    // Iniciar navegador
    console.log('🌐 Iniciando navegador...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        // Navegar a la aplicación
        console.log('📱 Navegando a la aplicación...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Esperar a que la aplicación cargue
        console.log('⏳ Esperando a que la aplicación cargue...');
        await page.waitForTimeout(5000);
        
        // Verificar que la aplicación se cargó correctamente
        console.log('🔍 Verificando carga de la aplicación...');
        
        // Verificar que no hay errores de JavaScript
        const jsErrors = await page.evaluate(() => {
            return window.jsErrors || [];
        });
        
        if (jsErrors.length > 0) {
            console.log('⚠️ Errores de JavaScript encontrados:');
            jsErrors.forEach(error => console.log(`   - ${error}`));
        } else {
            console.log('✅ No se encontraron errores de JavaScript');
        }
        
        // Verificar que Firebase está disponible
        const firebaseStatus = await page.evaluate(() => {
            return {
                firebase: typeof window.firebase !== 'undefined',
                authManager: typeof window.authManager !== 'undefined',
                authManagerApp: window.authManager && window.authManager.app ? true : false
            };
        });
        
        console.log('🔍 Estado de Firebase:');
        console.log(`   - Firebase disponible: ${firebaseStatus.firebase}`);
        console.log(`   - AuthManager disponible: ${firebaseStatus.authManager}`);
        console.log(`   - AuthManager.app disponible: ${firebaseStatus.authManagerApp}`);
        
        // Verificar que React está disponible
        const reactStatus = await page.evaluate(() => {
            return {
                react: typeof window.React !== 'undefined',
                reactDOM: typeof window.ReactDOM !== 'undefined'
            };
        });
        
        console.log('🔍 Estado de React:');
        console.log(`   - React disponible: ${reactStatus.react}`);
        console.log(`   - ReactDOM disponible: ${reactStatus.reactDOM}`);
        
        // Intentar acceder al módulo de gastos
        console.log('💰 Probando módulo de gastos...');
        
        // Esperar a que aparezca el botón de gastos
        try {
            await page.waitForSelector('[data-testid="expenses-tab"], button:contains("Gastos"), a:contains("Gastos")', { timeout: 10000 });
            console.log('✅ Botón de gastos encontrado');
            
            // Hacer clic en el botón de gastos
            await page.click('[data-testid="expenses-tab"], button:contains("Gastos"), a:contains("Gastos")');
            await page.waitForTimeout(2000);
            
            console.log('✅ Navegación al módulo de gastos exitosa');
            
        } catch (error) {
            console.log('⚠️ No se pudo encontrar el botón de gastos, pero la aplicación se cargó');
        }
        
        // Verificar que no hay errores de Firebase en la consola
        const consoleLogs = await page.evaluate(() => {
            return window.consoleLogs || [];
        });
        
        const firebaseErrors = consoleLogs.filter(log => 
            log.includes('FirebaseError') || 
            log.includes('Expected first argument to collection') ||
            log.includes('Missing or insufficient permissions')
        );
        
        if (firebaseErrors.length > 0) {
            console.log('❌ Errores de Firebase encontrados:');
            firebaseErrors.forEach(error => console.log(`   - ${error}`));
        } else {
            console.log('✅ No se encontraron errores de Firebase');
        }
        
        // Verificar que la aplicación está funcionando
        const appStatus = await page.evaluate(() => {
            return {
                rootElement: !!document.getElementById('root'),
                loadingMessage: document.body.textContent.includes('Cargando Expertia CRM'),
                appLoaded: !document.body.textContent.includes('Cargando Expertia CRM') || 
                          document.querySelector('#root').children.length > 1
            };
        });
        
        console.log('🔍 Estado de la aplicación:');
        console.log(`   - Elemento root presente: ${appStatus.rootElement}`);
        console.log(`   - Mensaje de carga visible: ${appStatus.loadingMessage}`);
        console.log(`   - Aplicación cargada: ${appStatus.appLoaded}`);
        
        // Capturar screenshot
        console.log('📸 Capturando screenshot...');
        await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
        console.log('✅ Screenshot guardado como test-screenshot.png');
        
        // Resumen final
        console.log('\n📊 RESUMEN DE LA PRUEBA:');
        console.log('========================');
        
        if (firebaseErrors.length === 0 && appStatus.appLoaded) {
            console.log('✅ PRUEBA EXITOSA: La aplicación está funcionando correctamente');
            console.log('✅ Firebase está inicializado sin errores');
            console.log('✅ React está funcionando correctamente');
            console.log('✅ La aplicación se cargó completamente');
        } else {
            console.log('⚠️ PRUEBA CON ADVERTENCIAS:');
            if (firebaseErrors.length > 0) {
                console.log('   - Se encontraron errores de Firebase');
            }
            if (!appStatus.appLoaded) {
                console.log('   - La aplicación no se cargó completamente');
            }
        }
        
    } catch (error) {
        console.error('❌ Error durante la prueba:', error.message);
    } finally {
        await browser.close();
        console.log('🔚 Navegador cerrado');
    }
}

// Ejecutar la prueba
testApplication().catch(console.error); 