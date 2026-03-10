import { run } from './AutoCommitSkill.js';
console.time('Test-AutoCommit');
run({ test: true }).then(res => {
    console.log("Resultado:", res);
    console.timeEnd('Test-AutoCommit');
});