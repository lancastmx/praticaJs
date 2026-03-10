// v1.1 - Soporte para mensajes en lenguaje natural.
import { exec } from 'child_process';
import { promisify } from 'util';
import { run as runRegistrador } from './RegistradorCommitSkill.js';

const execAsync = promisify(exec);

export const run = async (p = {}) => {
    try {
        console.log("Iniciando AutoCommitSkill...");

        // 1. Añadir cambios
        console.log("Ejecutando `git add .`...");
        await execAsync('git add .');

        // 2. Obtener estado ignorando BITACORA.md
        const { stdout: diffOut } = await execAsync('git diff --cached --name-only');
        const archivos = diffOut.trim().split('\n').filter(Boolean).filter(a => a !== 'BITACORA.md');

        if (archivos.length === 0) {
            throw new Error("No se puede hacer commit: no hay archivos relevantes en el área de staging (excluyendo BITACORA.md).");
        }

        // 3. Análisis Real de Contenido
        let lineasAgregadas = [];
        if (archivos.length > 0) {
            const { stdout: diffFiles } = await execAsync(`git diff --cached --unified=0 -- ${archivos.join(' ')}`);
            lineasAgregadas = diffFiles.split('\n').filter(line => line.startsWith('+') && !line.startsWith('+++'));
        }

        // Mapeos explícitos
        const acciones = [];

        archivos.forEach(archivo => {
            const nombreArchivo = archivo.split('/').pop();
            const esMarkdown = archivo.endsWith('.md');

            // Buscar porciones del diff para este archivo en específico es complejo con unified=0
            // Aplicaremos una heurística simplificada sobre todas las líneas agregadas, 
            // pero para ser hiper-precisos habría que parsear el diff por archivo.
            // Adoptaremos un enfoque global de las líneas agregadas por ahora,
            // vinculando al archivo si la línea pertenece a una función o markdown conocido

            if (esMarkdown) {
                const headers = lineasAgregadas.filter(l => l.match(/^\+\s*#{1,6}\s+(.*)/));
                if (headers.length > 0) {
                    headers.forEach(h => {
                        const match = h.match(/^\+\s*(#{1,6}\s+.*)/);
                        if (match) {
                            acciones.push(`Agrega sección ${match[1].trim()} en ${nombreArchivo}`);
                        }
                    });
                } else if (lineasAgregadas.length > 0) {
                    acciones.push(`Edita contenido en ${nombreArchivo}`);
                }
            } else {
                // Código JS / TS
                const functions = lineasAgregadas.filter(l => l.match(/^\+\s*(export const|function|class)\s+(\w+)/));
                if (functions.length > 0) {
                    functions.forEach(f => {
                        const match = f.match(/^\+\s*(?:export const|function|class)\s+(\w+)/);
                        if (match) {
                            const tipo = f.includes('class') ? 'clase' : 'función';
                            acciones.push(`Añade ${tipo} ${match[1]}() en ${nombreArchivo}`);
                        }
                    });
                } else if (lineasAgregadas.some(l => l.includes('console.log'))) {
                    acciones.push(`Añade logs en ${nombreArchivo}`);
                } else if (lineasAgregadas.length > 0) {
                    acciones.push(`Modifica lógica en ${nombreArchivo}`);
                }
            }
        });

        if (acciones.length === 0) {
            throw new Error("No se pudo extraer una acción específica (función, clase, sección md).");
        }

        // Deduplicar y formatear
        const accionesUnicas = [...new Set(acciones)];
        const mensajeGenerado = accionesUnicas.join('; ');

        console.log("Mensaje de commit generado:");
        console.log(mensajeGenerado);

        // 4. Registro: Invocar a RegistradorCommitSkill ANTES del commit real
        if (p.forceRewrite) {
            console.log("Ejecutando limpieza profunda de bitácora (forceRewrite)...");
            await runRegistrador({ forceRewrite: true });
        }

        console.log("Añadiendo el mensaje a BITACORA.md...");
        const registroResultado = await runRegistrador({ mensajeGenerado });

        // 5. Commit Total
        console.log("Ejecutando `git add .` final y `git commit`...");
        await execAsync('git add .'); // Asegurarnos de añadir los cambios de BITACORA.md

        const mensajeFinal = `${mensajeGenerado}; actualiza BITACORA.md`;
        const mensajeSeguro = mensajeFinal.replace(/"/g, '\\"');
        await execAsync(`git commit -m "${mensajeSeguro}"`);

        console.log("Commit finalizado con éxito.");

        return {
            success: true,
            data: {
                mensajeGenerado: mensajeFinal,
                registro: registroResultado
            }
        };
    } catch (error) {
        console.error("Error en AutoCommitSkill:", error);
        return { success: false, error: error.message };
    }
};