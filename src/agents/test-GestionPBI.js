import { run } from './GestionPBISkill.js';
console.time('Test-GestionPBI');
run({ test: true }).then(res => {
    console.log("Resultado:", res);
    console.timeEnd('Test-GestionPBI');
});