// arrays
console.log("--- EXPLICACIÓN DE ARRAYS EN JAVASCRIPT ---");

const frutas = ["manzana", "banana", "uva", "pera"];
console.log("1. Estado inicial del array:", frutas);

// (CREATE) CREAR    
console.log("\n--- (CREATE) AGREGAR ELEMENTOS ---");

// agregar un elemento al inicio
console.log("Operación: unshift('naranja') -> Agrega al inicio");
frutas.unshift("naranja");
console.log("Resultado unshift:", frutas);

// agregar un elemento al final
console.log("Operación: push('naranja') -> Agrega al final");
frutas.push("naranja");
console.log("Resultado push:", frutas);


// (READ) LEER
console.log("\n--- (READ) LEER ELEMENTOS ---");

console.log("Leyendo índice 0:", frutas[0]);
console.log("Leyendo índice 1:", frutas[1]);
console.log("Leyendo índice 2:", frutas[2]);
console.log("Leyendo índice 3:", frutas[3]);
console.log("Propiedad length (total de elementos):", frutas.length);

// (UPDATE) ACTUALIZAR
console.log("\n--- (UPDATE) ACTUALIZAR ELEMENTOS ---");

console.log("Operación: frutas[0] = 'mango' -> Actualización directa por índice");
frutas[0] = "mango";
console.log("Resultado actualización directa:", frutas);

console.log("Operación: splice(1, 1, 'fresa') -> Reemplaza 1 elemento en el índice 1");
frutas.splice(1, 1, "fresa");
console.log("Resultado splice:", frutas);

// (DELETE) ELIMINAR
console.log("\n--- (DELETE) ELIMINAR ELEMENTOS ---");

// eliminar el ultimo elemento
console.log("Operación: pop() -> Elimina el último elemento");
frutas.pop();
console.log("Resultado pop:", frutas);

// eliminar el primer elemento
console.log("Operación: shift() -> Elimina el primer elemento");
frutas.shift();
console.log("Resultado shift:", frutas);

console.log("\n--- FIN DE LA EXPLICACIÓN ---");

