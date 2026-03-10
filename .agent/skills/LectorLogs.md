# Skill: LectorLogs
> Skill para leer y analizar archivos de logs

## 📂 Archivos y Activos

Lógica: src/agents/LectorLogsSkill.js

Documentación: .agent/skills/LectorLogs.md

Test: src/agents/test-LectorLogs.js

Dependencias: [Ninguna especial]

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario necesite analizar o leer logs.

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
{
  "action": "execute",
  "entryPoint": "src/agents/LectorLogsSkill.js",
  "function": "run",
  "params": {}
}
```