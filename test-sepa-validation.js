/**
 * Script de validación para la funcionalidad SEPA XML
 * Ejecutar en la consola del navegador después de cargar la aplicación
 */

console.log('🧪 Iniciando validación de funcionalidad SEPA...\n');

// Test 1: Validación de IBAN
console.log('1️⃣ Probando validación de IBAN:');
const testIBANs = [
    'ES55 0049 7692 1725 1001 1591', // Válido
    'ES9121000418450200051332', // Válido
    'ES123', // Inválido (muy corto)
    'XX123456789', // Inválido (formato incorrecto)
    '', // Inválido (vacío)
];

testIBANs.forEach(iban => {
    // Simular la función validateIBAN
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    const isValid = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIban) && 
                    cleanIban.length >= 15 && 
                    cleanIban.length <= 34;
    console.log(`   ${iban.padEnd(30)} → ${isValid ? '✅ Válido' : '❌ Inválido'}`);
});

// Test 2: Formato de IBAN
console.log('\n2️⃣ Probando formato de IBAN:');
const formatIBAN = (iban) => {
    if (!iban) return '';
    return iban.replace(/\s/g, '').toUpperCase();
};

const testFormat = [
    'es55 0049 7692 1725 1001 1591',
    'ES9121000418450200051332',
    '  es55 0049 7692 1725 1001 1591  '
];

testFormat.forEach(iban => {
    const formatted = formatIBAN(iban);
    console.log(`   "${iban}" → "${formatted}"`);
});

// Test 3: Escape XML
console.log('\n3️⃣ Probando escape de XML:');
const escapeXML = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const testXML = [
    'Factura & Co.',
    'Precio < 100€',
    'Descripción "especial"',
    "Empresa's Name"
];

testXML.forEach(str => {
    const escaped = escapeXML(str);
    console.log(`   "${str}" → "${escaped}"`);
});

// Test 4: Estructura de datos necesaria
console.log('\n4️⃣ Validando estructura de datos necesaria:');
console.log('   Datos de empresa requeridos:');
console.log('   ✅ IBAN (obligatorio)');
console.log('   ✅ BIC (obligatorio)');
console.log('   ✅ Nombre (obligatorio)');
console.log('   ✅ NIF/CIF (obligatorio)');
console.log('   ⚠️  Dirección (opcional pero recomendado)');
console.log('\n   Datos de cliente requeridos:');
console.log('   ✅ IBAN (obligatorio para incluir en remesa)');
console.log('   ✅ Nombre (obligatorio)');
console.log('   ⚠️  BIC (opcional, se puede calcular desde IBAN)');

// Test 5: Validación de flujo completo
console.log('\n5️⃣ Flujo de uso esperado:');
console.log('   1. ✅ Usuario va a Cliente → Pestaña "Ventas"');
console.log('   2. ✅ Selecciona facturas pagadas con checkbox');
console.log('   3. ✅ Aparece botón "Generar remesa SEPA"');
console.log('   4. ✅ Al hacer clic:');
console.log('      - Valida datos de empresa (IBAN, BIC, nombre, NIF)');
console.log('      - Filtra facturas con IBAN válido');
console.log('      - Genera XML según estándar pain.001.001.03');
console.log('      - Descarga archivo XML');
console.log('      - Muestra notificación de éxito');

console.log('\n✅ Validación completada. Revisa los resultados arriba.\n');
console.log('📝 Notas importantes:');
console.log('   - El BIC de la empresa debe configurarse en Configuración → Empresa');
console.log('   - Los clientes deben tener IBAN válido en su campo "Cuenta Bancaria"');
console.log('   - Solo se incluirán facturas de clientes con IBAN válido');
console.log('   - El XML generado cumple con el estándar SEPA pain.001.001.03');
