import { execSync } from 'child_process';

const EXCLUDE = ['BITACORA.md'];

/**
 * Skill: AutoCommit
 *
 * Hace git add ., captura el diff staged y lo retorna como string
 * para que el agente del IDE genere la narrativa del commit.
 */
export const run = async (payload = {}) => {
    try {
        // 1. Preparar staging
        execSync('git add .', { stdio: 'ignore' });

        // 2. Verificar que hay archivos staged (excluyendo bitácora)
        const stagingFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
            .split('\n')
            .filter(f => f && !EXCLUDE.includes(f));

        if (stagingFiles.length === 0) {
            return { success: false, error: 'No hay cambios preparados para commit (excluyendo bitácora).' };
        }

        // 3. Obtener el diff completo de staging y granulado por archivo (Estratega de Versiones)
        const diff = execSync('git diff --cached', { encoding: 'utf-8' });
        const diffsByFile = {};
        stagingFiles.forEach(file => {
            diffsByFile[file] = execSync(`git diff --cached -- "${file}"`, { encoding: 'utf-8' });
        });

        // 4. Analítica Senior (Detección de "Ensalada de Cambios")
        const lineCount = diff.split('\n').length;
        const fileCount = stagingFiles.length;
        let warning = null;

        if (lineCount > 50 || fileCount > 3) {
            warning = `⚠️ Estratega de Versiones: Este commit parece un "cajón de sastre" (${lineCount} líneas, ${fileCount} archivos). Considera fragmentar los cambios para mantener la atomicidad.`;
        }

        console.log('\n✅ Diffs capturados y agrupados. El agente analizará la arquitectura.\n');
        console.log('📂 Archivos en staging:', stagingFiles.join(', '));
        if (warning) console.log(warning);

        return { success: true, diff, diffsByFile, stagingFiles, warning };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
