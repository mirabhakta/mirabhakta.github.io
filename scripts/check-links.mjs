// Crawl the static output: verify every local link, fragment, and mailto.
// Pass --external to also request public destinations without credentials.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
const root = resolve('dist');
const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (extname(path) === '.html') files.push(path);
  }
}
walk(root);
const external = new Set();
const failures = [];
let count = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + file.slice(root.length + 1).replaceAll('\\', '/').replace(/index\.html$/, '');
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    count++;
    if (href.startsWith('mailto:')) {
      if (new URL(href).pathname !== 'miraabhakta@gmail.com') failures.push(`${route}: unexpected email ${href}`);
      continue;
    }
    const url = new URL(href, 'http://portfolio.local' + route);
    if (url.origin !== 'http://portfolio.local') {
      if (url.protocol === 'https:') external.add(url.href);
      else failures.push(`${route}: unexpected protocol ${href}`);
      continue;
    }
    let target = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!target.startsWith(root)) { failures.push(`${route}: invalid path ${href}`); continue; }
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) { failures.push(`${route}: missing target ${href}`); continue; }
    if (url.hash && extname(target) === '.html') {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!readFileSync(target, 'utf8').includes(`id="${id}"`)) failures.push(`${route}: missing fragment ${href}`);
    }
  }
}
console.log(`Checked ${count} links across ${files.length} pages.`);
if (process.argv.includes('--external')) {
  for (const href of external) {
    try {
      const result = await fetch(href, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
      const blocked = [401,403,429,999].includes(result.status);
      console.log(`${result.ok ? 'PASS' : blocked ? 'UNVERIFIED' : 'FAIL'}  ${result.status} ${href}`);
      if (!result.ok && !blocked) failures.push(`External ${result.status}: ${href}`);
      await result.body?.cancel();
    } catch (error) {
      console.log(`UNVERIFIED  ${href}: ${error.message}`);
      process.exitCode = 2;
    }
  }
}
for (const failure of failures) console.error('FAIL  ' + failure);
if (failures.length) process.exitCode = 1;
else console.log('All local links, email actions, and fragments resolve.');
