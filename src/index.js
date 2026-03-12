import readline from 'readline';
import { exec } from 'child_process';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Mapa de lecciones: aquí irás registrando tus avances
const lecciones = {
    "01": "./01-vars.js",
    "07": "./07.logig.js",
    "08": "./08-if-else.js",
};

console.log("--- 🎓 LABORATORIO DE JAVASCRIPT ---");
console.log("Selecciona una lección para ejecutar:");
Object.keys(lecciones).forEach(key => console.log(`${key}: ${lecciones[key]}`));

rl.question("\nDigita el número (ej: 01): ", async (respuesta) => {
    const archivo = lecciones[respuesta];

    if (archivo) {
        console.log(`\n🚀 Ejecutando: ${archivo}\n------------------`);
        try {
            // Importamos dinámicamente el archivo elegido
            await import(archivo);
        } catch (err) {
            console.error("❌ Error al ejecutar la lección:", err.message);
        }
    } else {
        console.log("⚠️ Opción no válida.");
    }

    rl.close();
});