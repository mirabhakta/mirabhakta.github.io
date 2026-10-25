// Genuine fixed-viewport screenshots of the new Phase 2B.2 sections.
// One real Chrome page per width; Page.captureScreenshot at true viewport size.
import { Browser, sleep } from 'file:///C:/Users/miraa/AppData/Local/hermes/skills/creative/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const url = process.argv[2] || 'http://127.0.0.1:4321/';
const out = process.argv[3] || '.taste-skill/real-shots-2b2';
mkdirSync(out, { recursive: true });

const sizes = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
];

const targets = ['research', 'experience', 'about', 'contact'];

const browser = await Browser.launch({ width: 1440, height: 900 });
const results = [];
try {
  for (const s of sizes) {
    const page = await browser.newPage({ width: s.width, height: s.height, dsf: 1, mobile: s.mobile });
    await page.goto(url, { timeoutMs: 30000, settleMs: 1800 });

    await page.eval(`(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.querySelectorAll('.work__reveal').forEach(el => el.classList.add('is-visible'));
      return true;
    })()`);

    const m = await page.eval(`(() => {
      const tops = {};
      for (const id of ${JSON.stringify(targets)}) {
        const el = document.getElementById(id);
        tops[id] = el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
      }
      return {
        tops,
        docW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        pageH: Math.round(document.documentElement.scrollHeight),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    })()`);

    for (const id of targets) {
      const top = m.tops[id];
      if (top === null) continue;
      await page.eval((y) => { window.scrollTo(0, y); return true; }, Math.max(0, top - 40));
      await sleep(700);
      const path = `${out}/${s.name}-${id}.jpg`;
      await page.screenshot({ path, format: 'jpeg', quality: 88 });
      results.push({ ...s, section: id, shot: path });
    }

    results.push({ ...s, metrics: m });
    await page.close();
  }
} finally {
  await browser.close();
}
writeFileSync(`${out}/shots.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
