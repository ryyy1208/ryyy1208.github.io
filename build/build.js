const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return '<pre class="hljs"><code>' +
        hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
        '</code></pre>';
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const VAULT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(VAULT_ROOT, 'public');
const PARTITIONS = ['00_Inbox', '10_Cyber', '20_Dev', '30_Sys', '40_Project', '60_BioAI', '90_Config'];

const HTML_TEMPLATE = (title, body, nav) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | COMMAND_CENTER</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <nav class="sidebar">${nav}</nav>
  <main class="content">${body}</main>
</body>
</html>`;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function scanMdFiles(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'public' && entry.name !== 'build') {
        results.push(...scanMdFiles(path.join(dir, entry.name), rel));
      }
    } else if (entry.name.endsWith('.md')) {
      results.push(rel);
    }
  }
  return results;
}

function generateNav(files) {
  const grouped = {};
  for (const f of files) {
    const part = f.split(path.sep)[0];
    if (!grouped[part]) grouped[part] = [];
    grouped[part].push(f);
  }
  let html = '<h3>COMMAND_CENTER</h3>';
  for (const part of PARTITIONS) {
    if (!grouped[part]) continue;
    const label = part.replace(/^\d+_/, '');
    html += `<div class="nav-section"><h4>${label}</h4><ul>`;
    for (const f of grouped[part]) {
      const name = path.basename(f, '.md');
      const href = '/' + f.replace(/\.md$/, '.html').replace(/\\/g, '/');
      const active = f === 'README.md' ? ' class="active"' : '';
      html += `<li${active}><a href="${href}">${name}</a></li>`;
    }
    html += '</ul></div>';
  }
  return html;
}

function convertFile(relPath) {
  const abs = path.join(VAULT_ROOT, relPath);
  const raw = fs.readFileSync(abs, 'utf-8');
  const { data, content } = matter(raw);
  const title = data.title || path.basename(relPath, '.md');
  const body = md.render(content);
  const outPath = path.join(PUBLIC_DIR, relPath.replace(/\.md$/, '.html'));
  ensureDir(path.dirname(outPath));
  return { relPath, title, body, outPath };
}

function generateIndexMd(partition) {
  const dir = path.join(VAULT_ROOT, partition);
  const mdFiles = [];
  if (!fs.existsSync(dir)) return;
  for (const f of scanMdFiles(dir, partition)) {
    if (path.basename(f) === 'index.md') continue;
    const name = path.basename(f, '.md');
    const stat = fs.statSync(path.join(VAULT_ROOT, f));
    mdFiles.push({ name, file: f, mtime: stat.mtime });
  }
  mdFiles.sort((a, b) => b.mtime - a.mtime);

  const lines = [
    '---',
    'type: index',
    `tags: [${partition.split('_')[1]?.toLowerCase() || 'index'}]`,
    'status:',
    `  created: ${new Date().toISOString().slice(0, 16)}`,
    '---',
    '',
    `# ${partition}`,
    '',
    '| 笔记 | 最后修改 |',
    '|------|----------|',
  ];
  for (const f of mdFiles) {
    const date = f.mtime.toISOString().slice(0, 10);
    lines.push(`| [[${f.name}]] | ${date} |`);
  }
  lines.push('');

  const indexPath = path.join(dir, 'index.md');
  fs.writeFileSync(indexPath, lines.join('\n'), 'utf-8');
  console.log(`  [index] ${partition}/index.md (${mdFiles.length} files)`);
}

function generateStyle() {
  const css = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; min-height: 100vh; background: #0d1117; color: #c9d1d9; }
.sidebar { width: 260px; background: #161b22; border-right: 1px solid #30363d; padding: 20px; overflow-y: auto; position: fixed; height: 100vh; }
.sidebar h3 { color: #58a6ff; margin-bottom: 16px; font-size: 14px; letter-spacing: 2px; }
.sidebar h4 { color: #8b949e; font-size: 12px; text-transform: uppercase; margin: 16px 0 8px; letter-spacing: 1px; }
.sidebar ul { list-style: none; }
.sidebar li a { color: #c9d1d9; text-decoration: none; display: block; padding: 4px 8px; border-radius: 6px; font-size: 13px; }
.sidebar li a:hover, .sidebar li.active a { background: #21262d; color: #58a6ff; }
.content { margin-left: 260px; flex: 1; padding: 40px 60px; max-width: 900px; }
.content h1 { color: #f0f6fc; margin-bottom: 24px; border-bottom: 1px solid #30363d; padding-bottom: 12px; }
.content h2 { color: #58a6ff; margin: 32px 0 16px; }
.content h3 { color: #79c0ff; margin: 24px 0 12px; }
.content p { margin: 12px 0; line-height: 1.7; }
.content a { color: #58a6ff; }
.content code { background: #161b22; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
.content pre { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 16px 0; }
.content pre code { background: none; padding: 0; }
.content table { border-collapse: collapse; margin: 16px 0; width: 100%; }
.content th, .content td { border: 1px solid #30363d; padding: 8px 12px; text-align: left; }
.content th { background: #161b22; color: #58a6ff; }
.content blockquote { border-left: 3px solid #58a6ff; padding: 8px 16px; margin: 16px 0; background: #161b22; border-radius: 0 8px 8px 0; }
.content ul, .content ol { padding-left: 24px; margin: 12px 0; }
.content li { margin: 4px 0; }
`;
  ensureDir(PUBLIC_DIR);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'style.css'), css, 'utf-8');
}

function build() {
  console.log('🔨 Building site...');
  ensureDir(PUBLIC_DIR);

  console.log('📝 Generating index.md files...');
  for (const part of PARTITIONS) generateIndexMd(part);

  const allFiles = scanMdFiles(VAULT_ROOT);
  allFiles.unshift('README.md');
  const unique = [...new Set(allFiles)];

  const nav = generateNav(unique);
  generateStyle();

  console.log(`📄 Converting ${unique.length} files...`);
  for (const f of unique) {
    try {
      const { title, body, outPath } = convertFile(f);
      const html = HTML_TEMPLATE(title, body, nav);
      fs.writeFileSync(outPath, html, 'utf-8');
    } catch (e) {
      console.error(`  ❌ ${f}: ${e.message}`);
    }
  }
  const readmeHtml = path.join(PUBLIC_DIR, 'README.html');
  const indexHtml = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(readmeHtml) && !fs.existsSync(indexHtml)) {
    fs.copyFileSync(readmeHtml, indexHtml);
  }

  console.log(`✅ Done! Output: ${PUBLIC_DIR}`);
}

build();
