// Parse every delimited formula with the same local KaTeX used by the app.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const katex = require('../web/vendor/katex/katex.min.js');
const context = { window: {} };
vm.createContext(context);
for (const name of ['data.js', 'tthcm_data.js', 'tthcm_knowledge_data.js', 'vldc_data.js', 'vldc_knowledge_data.js', 'xstk_data.js', 'xstk_knowledge_data.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'web', name), 'utf8'), context);
}
let count = 0;
const errors = [];
function inspect(value, location) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
      const formula = match[1] ?? match[2] ?? match[3] ?? match[4];
      count++;
      try { katex.renderToString(formula, { throwOnError: true, strict: 'ignore' }); }
      catch (error) { errors.push({ location, formula, error: error.message }); }
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => inspect(item, location+'['+index+']'));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) inspect(item, (value.id || location)+'.'+key);
  }
}
for (const key of ['KTVXL_QUESTIONS', 'KTVXL_KNOWLEDGE', 'TTHCM_QUESTIONS_DATA', 'TTHCM_KNOWLEDGE_DATA', 'VLDC_QUESTIONS_DATA', 'VLDC_KNOWLEDGE_DATA', 'XSTK_QUESTIONS_DATA', 'XSTK_KNOWLEDGE_DATA']) inspect(context.window[key], key);
console.log('Parsed '+count+' math expressions; '+errors.length+' errors.');
if (errors.length) {
  console.error(JSON.stringify(errors.slice(0,30), null, 2));
  process.exitCode = 1;
}
