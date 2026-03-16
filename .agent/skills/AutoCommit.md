# Skill: AutoCommit
> Ejecuta git status y git diff --cached para interpretar los cambios en lenguaje natural y generar un mensaje de commit descriptivo. Realiza git add ., git commit -m y actualiza la bitácora.

## 📂 Archivos y Activos

Lógica: agents/AutoCommitSkill.js

Documentación: .agent/skills/AutoCommit.md

Test: agents/test-AutoCommit.js

Dependencias: Llama a agents/RegistradorCommitSkill.js para persistir datos en BITACORA.md.

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: "Commit"
- Ante la necesidad de: Ejecuta git status y git diff --cached para interpretar los cambios en lenguaje natural y generar un mensaje de commit descriptivo. Realiza git add ., git commit -m y actualiza la bitácora.

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
{
  "action": "execute",
  "entryPoint": "../agents/AutoCommitSkill.js",
  "function": "run",
  "params": {}
}
```