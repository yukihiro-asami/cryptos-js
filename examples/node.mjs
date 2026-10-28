import { examples } from './catalog.js';

const selected = process.argv.slice(2);
const ids = new Set(examples.map(example => example.id));
if (selected.some(id => !ids.has(id))) {
  console.error('Unknown example. Choose: ' + [...ids].join(', '));
  process.exitCode = 1;
} else {
  let passed = 0, checks = 0;
  const targets = examples.filter(example => selected.length === 0 || selected.includes(example.id));
  for (const example of targets) {
    try {
      const { run } = await example.load();
      const result = run();
      console.log('\nPASS ' + example.title + ' — ' + example.basis);
      console.log(JSON.stringify(result, null, 2));
      passed++;
      checks += result.checks.length;
    } catch (error) {
      console.error('\nFAIL ' + example.title + ': ' + error.message);
      process.exitCode = 1;
    }
  }
  console.log('\n' + passed + '/' + targets.length + ' examples passed; ' + checks + ' checks.');
}
