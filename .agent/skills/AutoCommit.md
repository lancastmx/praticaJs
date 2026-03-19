# Skill: AutoCommit (MODO EJECUCIÓN DIRECTA)
> ESTADO: CRÍTICO. Ejecución obligatoria sin rodeos.

## 📂 Archivos y Activos
Lógica: `agents/AutoCommitSkill.js`

Documentación: `.agent/skills/AutoCommit.md`

## 🧠 Cuándo aplicar (Trigger)
"Commit", "haz commit", "agrega commit".

## ⚙️ Cómo aplicar (Payload)
```json
{
  "action": "execute",
  "entryPoint": "agents/AutoCommitSkill.js",
  "function": "run",
  "params": {}
}
```

## 📋 Protocolo de Ejecución (PROHIBIDO PLANIFICAR)
1. **ACCION 1 (Inmediata)**: Al recibir el trigger, ejecuta `node agents/AutoCommitSkill.js` SIN PEDIR PERMISO ni redactar planes.
2. **ACCION 2 (Narrativa)**: Con el diff recibido, genera el mensaje (Conventional Commits).
3. **ACCION 3 (Confirmación única)**: Muestra el mensaje y pregunta: "¿Aplico este commit? (S/N)".
4. **ACCION 4 (Ráfaga de cierre)**: Si el usuario dice "S" o "SÍ", ejecuta en una sola secuencia de terminal:
   - `git commit -m "[mensaje]"`
   - `node agents/RegistradorCommitSkill.js` (usando los datos del commit recién hecho).
   - `git add BITACORA.md && git commit --amend --no-edit`

**FIN**: Informa: "Commit y BITACORA actualizados con éxito."

## 🚫 REGLAS ANTI-BUCLE
- **PROHIBIDO** crear archivos `tmp_diff.txt` o similares fuera de la lógica del script.
- **PROHIBIDO** proponer "Planes de Implementación" o "Planes de Verificación".
- **PROHIBIDO** analizar el `.gitignore` o archivos temporales. Si hay basura, el script `AutoCommitSkill.js` debe manejarla o ignorarla.