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

        // 2. Obtener estado
        const { stdout: diffOut } = await execAsync('git diff --cached --name-only');
        const archivos = diffOut.trim().split('\n').filter(Boolean);

        if (archivos.length === 0) {
            throw new Error("No se puede hacer commit: no hay archivos en el área de staging.");
        }

        // 3. Generar mensaje descriptivo
        const archivosNombres = archivos.map(f => f.split('/').pop());
        const maxFiles = 3;
        let listaNombres = archivosNombres.slice(0, maxFiles).join(', ');
        if (archivosNombres.length > maxFiles) {
            listaNombres += ` y ${archivosNombres.length - maxFiles} más`;
        }

        // Determinar un prefijo básico
        let tipo = "update";
        if (archivos.some(a => a.toLowerCase().includes('fix') || a.endsWith('Skill.js'))) {
            tipo = "fix";
        } else if (archivos.every(a => a.endsWith('.md'))) {
            tipo = "docs";
        }

        // En caso de no poder determinar los archivos modificados correctamente
        if (!listaNombres) {
            throw new Error("No se pudo determinar el cambio: nombre de archivos inválidos.");
        }

        let mensajeGenerado = `${tipo}: [${listaNombres}] y cambios relacionados`;

        console.log("Mensaje de commit generado:");
        console.log(mensajeGenerado);

        // 4. Hacer commit
        console.log("Ejecutando `git commit`...");
        const mensajeSeguro = mensajeGenerado.replace(/"/g, '\\"');
        await execAsync(`git commit -m "${mensajeSeguro}"`);

        console.log("Commit realizado. Registrando bitácora...");

        // 5. Invocar obligatoriamente RegistradorCommitSkill
        const registroResultado = await runRegistrador({ forceRewrite: p.forceRewrite || false });

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