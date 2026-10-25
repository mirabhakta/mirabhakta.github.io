// Genuine fixed-viewport browser screenshots (no inspector compositing).
// Uses the Taste Skill CDP client directly: one Chrome page per width, real
// viewport, real scroll, Page.captureScreenshot with an explicit clip.
import { Browser, sleep } from 'file:///C:/Users/miraa/AppData/Local/hermes/skills/creative/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const url = process.argv[2] || 'http://127.0.0.1:4321/';
const out = process.argv[3] || '.taste-skill/real-shots';
mkdirSync(out, { recursive: true });

const sizes = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
];

const browser = await Browser.launch({ width: 1440, height: 900 });
const results = [];
try {
  for (const s of sizes) {
    const page = await browser.newPage({ width: s.width, height: s.height, dsf: 1, mobile: s.mobile });
    await page.goto(url, { timeoutMs: 30000, settleMs: 1800 });

    // Freeze smooth scrolling and reveal everything, then measure the work section.
    await page.eval(`(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.querySelectorAll('.work__reveal').forEach(el => el.classList.add('is-visible'));
      return true;
    })()`);

    const m = await page.eval(`(() => {
      const work = document.querySelector('#work');
      const rect = work.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return {
        docW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        workTop: Math.round(top),
        workH: Math.round(rect.height),
        pageH: Math.round(document.documentElement.scrollHeight),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    })()`);

    // Viewport-sized capture of the top of the work section.
    await page.eval(`window.scrollTo(0, ${m.workTop - 80})`);
    await sleep(900);
    const fold = `${out}/${s.name}-work-fold.jpg`;
    await page.screenshot({ path: fold, format: 'jpeg', quality: 88 });
    results.push({ ...s, ...m, shot: fold });

    // A second viewport capture further down, for the lower rows and the transition.
    await page.eval(`window.scrollTo(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, ${m.workTop + 700}))`);
    await sleep(900);
    const second = `${out}/${s.name}-work-scroll.jpg`;
    await page.screenshot({ path: second, format: 'jpeg', quality: 88 });
    results[results.length - 1].shot2 = second;

    await page.close();
  }
} finally {
  await browser.close();
}
writeFileSync(`${out}/shots.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
