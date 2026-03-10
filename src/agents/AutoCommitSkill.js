import { execSync } from 'child_process';
import { run as registrarEnBitacora } from './RegistradorCommitSkill.js';

const EXCLUDE = ['BITACORA.md'];

export const run = async (payload = {}) => {
    try {
        // 1. git add . (Para incluir los cambios del código)
        execSync('git add .', { stdio: 'ignore' });

        // Obtener archivos en staging
        const stagingFilesRaw = execSync('git diff --cached --name-only', { encoding: 'utf-8' }).split('\n').filter(Boolean);

        const stagingFiles = [];
        for (const file of stagingFilesRaw) {
            if (EXCLUDE.includes(file)) continue;
            stagingFiles.push(file);
        }

        if (stagingFiles.length === 0) {
            return { success: false, error: "No hay cambios preparados para commit (excluyendo bitácora)." };
        }

        // 2. Generar el mensaje basado en el diff
        let listaDeFuncionesDetectadas = [];
        let seccionesMarkdownNuevas = [];

        for (const file of stagingFiles) {
            const ext = file.split('.').pop();
            const diff = execSync(`git diff --cached --unified=0 -- "${file}"`, { encoding: 'utf-8' });
            const lineasAnadidas = diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));

            if (ext === 'js' || ext === 'ts') {
                const regexFunciones = /^\+\s*(?:export\s+)?(?:const|function|class)\s+(\w+)/;
                lineasAnadidas.forEach(l => {
                    const match = l.match(regexFunciones);
                    if (match) listaDeFuncionesDetectadas.push(`- Añade función: ${match[1]}()`);
                });
            } else if (ext === 'md') {
                const regexTitulos = /^\+\s*(#+)\s+(.+)/;
                lineasAnadidas.forEach(l => {
                    const match = l.match(regexTitulos);
                    if (match) seccionesMarkdownNuevas.push(`- Añade sección: ${match[2].trim()}`);
                });
            }
        }

        const funcionesStr = listaDeFuncionesDetectadas.length > 0 ? listaDeFuncionesDetectadas.join('\n  ') : '- Sin nuevas funciones detectadas';
        const mdStr = seccionesMarkdownNuevas.length > 0 ? seccionesMarkdownNuevas.join('\n  ') : '- Sin nuevas secciones Markdown';

        const mensajeCommit = `feat: Actualización en ${stagingFiles.slice(0, 2).join(', ')}${stagingFiles.length > 2 ? ' y otros' : ''}`;
        const autor = execSync('git config user.name', { encoding: 'utf-8' }).trim() + ' <' + execSync('git config user.email', { encoding: 'utf-8' }).trim() + '>';

        // 3. git commit -m "[mensaje]" (commit inicial)
        execSync(`git commit -m "${mensajeCommit}"`, { stdio: 'ignore' });

        // 4. Obtener el Hash real: git rev-parse --short HEAD
        const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

        // 5. runRegistrador() enviando ese Hash real
        await registrarEnBitacora({
            hash: commitHash,
            autor: autor,
            funciones: funcionesStr,
            seccionesMd: mdStr,
            archivos: stagingFiles
        });

        // 6. git add BITACORA.md y git commit --amend --no-edit
        execSync('git add BITACORA.md', { stdio: 'ignore' });
        execSync('git commit --amend --no-edit', { stdio: 'ignore' });

        // Obtener el nuevo hash despues del amend, aunque el original puede ser el que se registraba (en realidad amend cambia el hash)
        // Pero el usuario pidió registrar el primer hash o el final? 
        // "Obtener el Hash real: git rev-parse --short HEAD. runRegistrador() enviando ese Hash real."
        // Así que el hash registrado en Bitácora será el pre-amend (o si el amend cambia el hash un poco, será con el pre-amend).
        // Vamos a devolver el hash final para estar seguros:
        const hashFinal = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

        return { success: true, data: { hash: hashFinal, mensaje: mensajeCommit } };
    } catch (error) {
        return { success: false, error: error.message };
    }
};// dummy test 2
