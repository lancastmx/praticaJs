# Skill: BuscadorTodos
> Busca y lista todos los TODO (tareas pendientes) en los archivos de todo el proyecto.

## 📂 Archivos y Activos

Lógica: src/agents/BuscadorTodosSkill.js

Documentación: .agent/skills/BuscadorTodos.md

Test: src/agents/test-BuscadorTodos.js

Dependencias: [Ninguna especial]

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: "BuscadorTodos"
- Ante la necesidad de: Busca y lista todos los TODO (tareas pendientes) en los archivos de todo el proyecto.

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
{ "action": "execute", "params": { "path": "opcional/ruta/relativa" } }
```