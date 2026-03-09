---
description: Este flujo asegura que cada habilidad en `.agent/skills/` tenga su lógica correspondiente en `scripts/` y que el archivo `AGENTS.md` esté sincronizado.
---

Este proceso valida que la inteligencia del agente (.agent/skills) tenga "músculos" para ejecutar (scripts/).

## 📋 Steps
1. **Inventory**: Lista archivos en `.agent/skills/*.md`.
2. **Match**: Por cada archivo encontrado, busca su pareja en `./scripts/*.js`.
3. **Execution**:
   - Si coinciden: Ejecuta `node scripts/documentador.js "Skill [nombre] verificada y lista"`.
   - Si falta el script: Genera un reporte de error en `AGENTS.md` usando el mismo documentador.

## 🚫 Constraints
- No modifiques archivos dentro de `src/core` sin permiso.
- Solo usa `scripts/documentador.js` para escribir logs.