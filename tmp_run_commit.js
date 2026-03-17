import { run } from './agents/AutoCommitSkill.js';

run().then(result => {
    console.log(JSON.stringify(result));
}).catch(err => {
    console.error(err);
    process.exit(1);
});
