---
description: Estandarizar la creación de herramientas para el sistema de agentes.
---

1. **Análisis de Requisitos:**
   - Leer el nombre de la skill y su función principal.
   - Identificar si requiere otras skills existentes (ej. `FileReadSkill`).

2. **Ejecución de la Fábrica (Generación de Archivos):**
   - Crear el archivo en `src/agents/[Nombre]Skill.js` usando el **Skill Template**.
   - Crear la documentación técnica en `.agent/skills/[Nombre].md`.

3. **Registro en el Sistema:**
   - Actualizar el archivo `AGENTS.md` agregando la nueva regla de delegación.
   - Usar `documentadorSkill` para verificar que el registro sea correcto.

4. **Validación:**
   - Listar los archivos creados para confirmar la operación.