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
                    if (match) listaDeFuncionesDetectadas.push(`- En \`${file}\`: \`${match[1]}\``);
                });
            } else if (ext === 'md') {
                const regexTitulos = /^\+\s*(#+)\s+(.+)/;
                lineasAnadidas.forEach(l => {
                    const match = l.match(regexTitulos);
                    if (match) seccionesMarkdownNuevas.push(`- En \`${file}\`: Sección ${match[1]} ${match[2].trim()}`);
                });
            }
        }

        const funcionesStr = listaDeFuncionesDetectadas.length > 0 ? listaDeFuncionesDetectadas.join('\n  ') : '- Sin nuevas funciones detectadas';
        const mdStr = seccionesMarkdownNuevas.length > 0 ? seccionesMarkdownNuevas.join('\n  ') : '- Sin nuevas secciones Markdown';

        const mensajeCommit = `feat: Actualización en ${stagingFiles.slice(0, 2).join(', ')}${stagingFiles.length > 2 ? ' y otros' : ''}`;
        const autor = execSync('git config user.name', { encoding: 'utf-8' }).trim() + ' <' + execSync('git config user.email', { encoding: 'utf-8' }).trim() + '>';

        // 3. runRegistrador() (Escribir en la bitácora antes del commit)
        await registrarEnBitacora({
            autor: autor,
            funciones: funcionesStr,
            seccionesMd: mdStr,
            archivos: stagingFiles
        });

        // 4. git add BITACORA.md (Para incluir la actualización de la bitácora en el mismo commit)
        execSync('git add BITACORA.md', { stdio: 'ignore' });

        // 5. git commit -m "..."
        execSync(`git commit -m "${mensajeCommit}"`, { stdio: 'ignore' });

        // 6. git rev-parse --short HEAD (Para obtener el ID final y confirmarlo)
        const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

        return { success: true, data: { hash: commitHash, mensaje: mensajeCommit } };
    } catch (error) {
        return { success: false, error: error.message };
    }
};