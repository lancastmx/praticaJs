import { exec } from 'child_process';
import { promisify } from 'util';
import { appendFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export const run = async (p = {}) => {
    try {
        const bitacoraPath = path.join(process.cwd(), 'BITACORA.md');
        const logFormat = "%an <%ae>%n%ad%n%B";

        // MODO REESCRITURA TOTAL
        if (p.forceRewrite) {
            // Obtenemos todos los commits con un delimitador seguro
            const logFormat = "%H|%an <%ae>|%ad|%B";
            const { stdout } = await execAsync(`git log --format="${logFormat}" --date=format:"%Y-%m-%d %H:%M:%S"`);
            const rawCommits = stdout.trim().split(/\n(?=[a-f0-9]{40}\|)/);

            let nuevaBitacora = "# Bitácora de Commits\n\n";

            for (const c of rawCommits) {
                const parts = c.trim().split('|');
                if (parts.length >= 4) {
                    const hash = parts[0];
                    const autor = parts[1];
                    const fecha = parts[2];
                    let mensaje = parts.slice(3).join('|').trim();

                    // Limpieza profunda: reemplazar genéricos usando la nueva heurística explícita
                    if (mensaje === "chore: actualización automática" || mensaje === "chore: actualizacion automatica") {
                        try {
                            const { stdout: diffOut } = await execAsync(`git diff-tree --no-commit-id --name-only -r ${hash}`);
                            const archivos = diffOut.trim().split('\n').filter(Boolean);
                            const { stdout: diffUnified } = await execAsync(`git show ${hash} --unified=0`);
                            const lineasAgregadas = diffUnified.split('\n').filter(line => line.startsWith('+') && !line.startsWith('+++'));

                            const acciones = [];
                            archivos.forEach(archivo => {
                                const nombreArchivo = archivo.split('/').pop();
                                const esMarkdown = archivo.endsWith('.md');

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

                            if (acciones.length > 0) {
                                const accionesUnicas = [...new Set(acciones)];
                                mensaje = accionesUnicas.join('; ');
                            }
                        } catch (e) {
                            // Ignorar errores y mantener el original si algo falla
                        }
                    }

                    nuevaBitacora += `## [${fecha}] | Autor: ${autor} | Mensaje: ${mensaje}\n\n`;
                }
            }

            await fs.promises.writeFile(bitacoraPath, nuevaBitacora, 'utf8');
            return {
                success: true,
                data: { message: "Bitácora reescrita por completo exitosamente.", file: bitacoraPath }
            };
        }

        // MODO INCREMENTAL
        // 1. Obtener el último commit
        const { stdout } = await execAsync(`git log -1 --format="${logFormat}" --date=format:"%Y-%m-%d %H:%M:%S"`);
        const lines = stdout.trim().split('\n');

        if (lines.length < 3) {
            return { success: false, error: "No commit message found." };
        }

        const autor = lines[0];
        const fecha = lines[1];
        const mensaje = lines.slice(2).join('\n').trim();
        const nuevaEntrada = `## [${fecha}] | Autor: ${autor} | Mensaje: ${mensaje}\n\n`;

        // 2. Comprobar si ya existe
        let bitacoraContent = '';
        if (fs.existsSync(bitacoraPath)) {
            bitacoraContent = await fs.promises.readFile(bitacoraPath, 'utf8');
        }

        if (bitacoraContent.includes(`## [${fecha}]`)) {
            return {
                success: true,
                data: { message: "No hay commits nuevos para registrar.", file: bitacoraPath }
            };
        }

        // 3. Agregar el nuevo commit
        if (!bitacoraContent) {
            bitacoraContent = '# Bitácora de Commits\n\n';
        } else if (!bitacoraContent.includes('# Bitácora de Commits')) {
            bitacoraContent = '# Bitácora de Commits\n\n' + bitacoraContent;
        }

        bitacoraContent = bitacoraContent.replace(
            /# Bitácora de Commits\s*/,
            `# Bitácora de Commits\n\n${nuevaEntrada.trim()}\n\n`
        );

        await fs.promises.writeFile(bitacoraPath, bitacoraContent, 'utf8');

        return {
            success: true,
            data: {
                message: `Commit de ${autor} registrado de forma incremental.`,
                commitInfo: { autor, fecha, mensaje },
                file: bitacoraPath
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};