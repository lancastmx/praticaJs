# Skill: GestionPBI
> Automatiza el flujo de ramas: sincroniza main -> dev y crea ramas pbi-[nombre] con un archivo PBI.md inicial.

## 📂 Archivos y Activos

Lógica: src/agents/GestionPBISkill.js

Documentación: .agent/skills/GestionPBI.md

Test: src/agents/test-GestionPBI.js

Dependencias: 
[Ninguna especial]

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: "GestionPBI"
- Ante la necesidad de: Automatiza el flujo de ramas: sincroniza main -> dev y crea ramas pbi-[nombre] con un archivo PBI.md inicial.

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
{
  "action": "execute",
  "entryPoint": "src/agents/GestionPBISkill.js",
  "function": "run",
  "params": {}
}
```