const chokidar = require('chokidar');
const path = require('path');

const VAULT_ROOT = path.resolve(__dirname, '..');
const watcher = chokidar.watch('**/*.md', {
  cwd: VAULT_ROOT,
  ignored: ['node_modules/**', 'public/**', 'build/**', 'quartz/**'],
  ignoreInitial: true
});

let buildTimer = null;
function scheduleBuild() {
  if (buildTimer) clearTimeout(buildTimer);
  buildTimer = setTimeout(() => {
    console.log('\n🔄 File changed, rebuilding...');
    require('./build.js');
  }, 500);
}

watcher
  .on('add', (f) => { console.log(`  + ${f}`); scheduleBuild(); })
  .on('unlink', (f) => { console.log(`  - ${f}`); scheduleBuild(); })
  .on('change', (f) => { console.log(`  ~ ${f}`); scheduleBuild(); });

console.log('👀 Watching for changes...');
