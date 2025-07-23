// SCRIPT DE DIAGNÓSTICO PARA PROBLEMA DE INFORMES
// Ejecutar en la consola del navegador

console.log("🔍 INICIANDO DIAGNÓSTICO DE INFORMES");

// 1. Verificar si React está disponible
console.log("✅ React disponible:", typeof window.React !== 'undefined');
console.log("✅ ReactDOM disponible:", typeof window.ReactDOM !== 'undefined');
console.log("✅ Recharts disponible:", typeof window.Recharts !== 'undefined');

// 2. Verificar el estado actual de la aplicación
const root = document.getElementById('root');
console.log("✅ Root element:", root);

// 3. Función para verificar el estado cuando se hace clic en Informes
function debugInformes() {
    const informesButton = document.querySelector('span:contains("Informes")') || 
                          Array.from(document.querySelectorAll('span')).find(span => 
                              span.textContent.includes('Informes'));
    
    if (informesButton) {
        console.log("✅ Botón Informes encontrado:", informesButton);
        
        // Añadir listener de debug
        informesButton.addEventListener('click', function(e) {
            console.log("🎯 CLICK EN INFORMES DETECTADO");
            console.log("Evento:", e);
            
            // Verificar después de un breve delay
            setTimeout(() => {
                console.log("🔄 VERIFICANDO ESTADO DESPUÉS DEL CLICK:");
                const currentView = window.location.hash || 'unknown';
                console.log("Current view/hash:", currentView);
                
                // Verificar si hay errores en el DOM
                const errorElements = document.querySelectorAll('[data-error], .error');
                console.log("Errores en DOM:", errorElements.length);
                
                // Verificar si el componente ReportsDashboard se renderizó
                const reportsElements = document.querySelectorAll('[class*="reports"], [data-testid*="reports"]');
                console.log("Elementos relacionados con reports:", reportsElements.length);
                
                // Verificar si hay algún texto relacionado con informes
                const bodyText = document.body.innerText;
                const hasInformesText = bodyText.includes('Informes de Ventas') || 
                                       bodyText.includes('Ventas Totales') ||
                                       bodyText.includes('No hay datos para mostrar');
                console.log("¿Hay contenido de informes visible?", hasInformesText);
                
                if (!hasInformesText) {
                    console.log("❌ PROBLEMA: No se encontró contenido de informes después del click");
                    console.log("Contenido actual del body (primeros 500 chars):", bodyText.substring(0, 500));
                }
            }, 100);
        });
        
        console.log("✅ Debug listener añadido al botón Informes");
    } else {
        console.log("❌ No se pudo encontrar el botón Informes");
    }
}

// 4. Ejecutar diagnóstico cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugInformes);
} else {
    debugInformes();
}

// 5. Función manual para activar informes
window.testInformes = function() {
    console.log("🧪 PRUEBA MANUAL DE INFORMES");
    
    // Simular click en informes
    const informesButton = Array.from(document.querySelectorAll('span')).find(span => 
        span.textContent.includes('Informes'));
    
    if (informesButton) {
        informesButton.click();
        console.log("✅ Click simulado en Informes");
    } else {
        console.log("❌ No se pudo encontrar el botón Informes para click manual");
    }
};

console.log("🔍 DIAGNÓSTICO COMPLETADO");
console.log("💡 Para probar manualmente: window.testInformes()");
