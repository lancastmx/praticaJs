const nota = {
    id: 1,
    titulo: "Nota 1",
    contenido: "Contenido de la nota 1",
    fecha: "2022-01-01",
    importante: true,
    tags: ["importante", "nota"],
    categoria: {
        id: 1,
        nombre: "General"
    }
}

console.log(nota);

const campo = "categoria";
console.log(nota[campo]);