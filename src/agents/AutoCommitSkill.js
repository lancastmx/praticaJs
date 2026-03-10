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

        // 2. Obtener estado
        const { stdout: statusOut } = await execAsync('git status --short');
        if (!statusOut.trim()) {
            return { success: true, message: "No hay cambios para hacer commit." };
        }

        // Parseamos los archivos modificados
        const lineas = statusOut.trim().split('\n');
        const archivosaAgregados = [];
        const archivosModificados = [];
        const archivosEliminados = [];

        lineas.forEach(linea => {
            const estado = linea.substring(0, 2).trim();
            const archivo = linea.substring(3).trim();
            if (estado.includes('A') || estado === '??') archivosaAgregados.push(archivo);
            else if (estado.includes('M')) archivosModificados.push(archivo);
            else if (estado.includes('D')) archivosEliminados.push(archivo);
        });

        // 3. Generar mensaje descriptivo
        let mensajeGenerado = "chore: actualización automática\n\n";

        if (archivosaAgregados.length > 0) {
            mensajeGenerado += `- Archivos añadidos: ${archivosaAgregados.map(f => f.split('/').pop()).join(', ')}\n`;
        }
        if (archivosModificados.length > 0) {
            mensajeGenerado += `- Archivos modificados: ${archivosModificados.map(f => f.split('/').pop()).join(', ')}\n`;
        }
        if (archivosEliminados.length > 0) {
            mensajeGenerado += `- Archivos eliminados: ${archivosEliminados.map(f => f.split('/').pop()).join(', ')}\n`;
        }

        // Agregar información de diff para mayor detalle
        try {
            const { stdout: diffOut } = await execAsync('git diff --cached --stat');
            mensajeGenerado += `\nDetalles del diff:\n${diffOut.trim()}`;
        } catch (e) {
            console.log("No se pudo obtener el dif, continuando...");
        }

        console.log("Mensaje de commit generado:");
        console.log(mensajeGenerado);

        // 4. Hacer commit
        console.log("Ejecutando `git commit`...");
        // Reemplazar comillas dobles en el mensaje para evitar romper el comando
        const mensajeSeguro = mensajeGenerado.replace(/"/g, '\\"');
        await execAsync(`git commit -m "${mensajeSeguro}"`);

        console.log("Commit realizado. Registrando bitácora...");

        // 5. Invocar obligatoriamente RegistradorCommitSkill
        const registroResultado = await runRegistrador({ forceRewrite: false });

        return {
            success: true,
            data: {
                mensajeGenerado,
                registro: registroResultado
            }
        };
    } catch (error) {
        console.error("Error en AutoCommitSkill:", error);
        return { success: false, error: error.message };
    }
};