import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const run = async (data = {}) => {
    const bitacoraPath = path.join(process.cwd(), 'BITACORA.md');
    const tituloPrincipal = "# 📓 BITÁCORA DE INGENIERÍA\n\n";

    // Si es una reconstrucción (forceRewrite)
    if (data.forceRewrite) {
        let nuevoContenido = tituloPrincipal;

        try {
            // Obtener el historial de git y parsearlo a nuestro formato
            const logOut = execSync('git log --pretty=format:"%h|%an <%ae>|%ad|%s" --date=iso', { encoding: 'utf-8' });
            if (logOut) {
                const commits = logOut.split('\n');
                for (const commitLine of commits) {
                    const partes = commitLine.split('|');
                    if (partes.length < 4) continue;
                    const [hash, autor, fechaStr, mensaje] = partes;

                    const fecha = new Date(fechaStr).toLocaleString();
                    let archivos = [];
                    try {
                        const filesOut = execSync(`git show --name-only --format=tformat: ${hash} --`, { encoding: 'utf-8' });
                        archivos = filesOut.split('\n').filter(Boolean);
                    } catch (e) { }

                    const bloque = `## 🛠️ [ID: ${hash}] | ${fecha}
- **Autor:** ${autor}
- **Cambios Técnicos:**
  - ${mensaje}
- **Archivos:** ${archivos.join(', ') || 'Ninguno'}

---
`;
                    nuevoContenido += bloque;
                }
            }
            fs.writeFileSync(bitacoraPath, nuevoContenido);
            return { success: true, data: "Historial regenerado" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Modo inserción atómica (antes de commitear)
    const fecha = new Date().toLocaleString();
    const hash = data.hash || 'PENDIENTE'; // Al ir antes del commit, el ID real no existe todavía
    const autor = data.autor || 'Desconocido';
    const listaDeFuncionesDetectadas = data.funciones || '  - Sin nuevas funciones detectadas';
    const seccionesMarkdownNuevas = data.seccionesMd || '  - Sin nuevas secciones Markdown';
    const listaArchivos = (data.archivos && data.archivos.length) ? data.archivos.join(', ') : 'Ninguno';

    const bloque = `## 🛠️ [ID: ${hash}] | ${fecha}
- **Autor:** ${autor}
- **Cambios Técnicos:**
  ${listaDeFuncionesDetectadas}
  ${seccionesMarkdownNuevas}
- **Archivos:** ${listaArchivos}

---
`;

    let contenidoActual = "";
    if (fs.existsSync(bitacoraPath)) {
        contenidoActual = fs.readFileSync(bitacoraPath, 'utf-8');
    }

    if (!contenidoActual.startsWith("# 📓 BITÁCORA DE INGENIERÍA")) {
        // Reemplazar si empieza con "# Bitácora de Commits"
        contenidoActual = contenidoActual.replace(/^# Bitácora de Commits/, "# 📓 BITÁCORA DE INGENIERÍA");
        if (!contenidoActual.startsWith("# 📓 BITÁCORA DE INGENIERÍA")) {
            contenidoActual = tituloPrincipal + contenidoActual;
        }
    }

    // Reemplazamos el título principal para inyectar nuestra cabecera justo debajo
    // Usamos el título principal más el bloque
    let nuevoContenido = contenidoActual.replace(/# 📓 BITÁCORA DE INGENIERÍA\n*/, tituloPrincipal + bloque);

    fs.writeFileSync(bitacoraPath, nuevoContenido);
    return { success: true };
};