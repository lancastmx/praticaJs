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

// Spead 
const nota5 = { id: 5, title: 'hola' };
const admin = { esAdmin: true };

const nota6 = { ...nota5, ...admin };
console.log(nota6);

// spread operator
const nota2 = { ...nota, importante: false };
console.log(nota2);

// Object.keys, Object.values, Object.entries
console.log(Object.keys(nota));
console.log(Object.values(nota));
console.log(Object.entries(nota));

// rest operator
const { titulo, ...resto } = nota;
console.log(titulo, resto);