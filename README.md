# 🎓 Academia JS - Laboratorio de Prácticas

¡Bienvenido al laboratorio de aprendizaje de JavaScript! Este repositorio está diseñado para practicar conceptos fundamentales de JS de manera interactiva a través de una consola.

---

## 🚀 Cómo empezar

Para iniciar el laboratorio interactivo, asegúrate de tener instalado Node.js y luego ejecuta:

```bash
npm install  # Si es la primera vez
npm run dev
```

Esto abrirá un menú en tu terminal donde podrás seleccionar qué lección estudiar.

---

## 📖 Lecciones Disponibles

A continuación, se listan las lecciones actuales en orden:

- **01** - [Variables y Tipos](src/lecciones/01-vars.js)
- **07** - [Consola y Logs](src/lecciones/07-log.js)
- **08** - [Control de Flujo: If/Else](src/lecciones/08-if-else.js)
- **09** - [Control de Flujo: Switch](src/lecciones/09-switch.js)
- **10** - [Bucles: For y While](src/lecciones/10-for-while.js)
- **11** - [Funciones](src/lecciones/11-function.js)
- **12** - [Scope (Alcance)](src/lecciones/12-scope.js)
- **13** - [Closures](src/lecciones/13-closure.js)
- **14** - [Arrays](src/lecciones/14-arrays.js)

---

## 🤖 Sistema de Agentes y Skills

Este proyecto utiliza un sistema de agentes para automatizar tareas comunes.

### Estándar de Skills
Utilizamos `SkillFactory.js` (ubicado en `agents/`) para estandarizar y facilitar la creación y gestión de habilidades de los agentes. Esto nos permite unificar la interfaz de ejecución y mantener un registro estructurado.

Para crear una nueva herramienta:
```bash
node agents/SkillFactory.js [nombre] "[descripcion]"
```

Consulta [AGENTS.md](AGENTS.md) para más detalles sobre las reglas de orquestación.

---

## 📂 Estructura del Proyecto

- `src/`: Lógica principal y lecciones.
- `agents/`: Lógica de los agentes y herramientas automatizadas.
- `BITACORA.md`: Registro de avances y cambios realizados.
- `PBI.md` & `TODOS.md`: Gestión de tareas y backlog.

---

Hecho con ❤️ por [Lancast](https://github.com/Lancast)
