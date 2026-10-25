// Read-only no-JavaScript check.
//
// Scripting cannot be disabled through Runtime.evaluate (the probe itself
// needs JavaScript), so the check emulates the CSS `scripting` media feature
// instead. That is the feature the stylesheet actually keys its
// no-script fallbacks on, and it exercises the same fallback branches.
//
// Run against a served build:  node scripts/check-no-js.mjs http://127.0.0.1:4321/
import { Browser } from 'file:///C:/Users/miraa/AppData/Local/hermes/skills/creative/design-taste-frontend/scripts/lib/cdp.mjs';

const url = process.argv[2] || 'http://127.0.0.1:4321/';
const failures = [];
const check = (name, ok, detail) => {
  if (!ok) failures.push(`${name}: ${detail}`);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ` — ${detail}`}`);
};

const browser = await Browser.launch({ width: 1440, height: 900 });
try {
  const page = await browser.newPage({ width: 390, height: 844, dsf: 1, mobile: true });
  await page.goto(url, { timeoutMs: 30000, settleMs: 1200 });
  await page.send('Emulation.setScriptExecutionDisabled', { value: true });
  await page.goto(url, { timeoutMs: 30000, settleMs: 800 });

  const state = await page.eval(`(() => {
    const nav = document.querySelector('.site-nav');
    const links = Array.from(document.querySelectorAll('.site-nav__link'));
    const rows = Array.from(document.querySelectorAll('.work__reveal'));
    const visible = (el) => {
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0.01;
    };
    return {
      scriptingMedia: matchMedia('(scripting: none)').matches,
      navVisible: visible(nav),
      linksVisible: links.filter(visible).length,
      linksTotal: links.length,
      rowsVisible: rows.filter(visible).length,
      rowsTotal: rows.length,
      toggleVisible: visible(document.querySelector('.site-nav__toggle')),
      sections: ['work','research','experience','about','contact'].every((id) => !!document.getElementById(id)),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  })()`);

  check('the scripting: none media feature is active', state.scriptingMedia, 'emulation did not apply');
  check('nav is visible without scripting', state.navVisible, JSON.stringify(state));
  check('all five nav links remain reachable without scripting', state.linksVisible === state.linksTotal && state.linksTotal === 5, JSON.stringify(state));
  check('menu button is hidden without scripting', !state.toggleVisible, 'toggle is still shown');
  check('all ledger rows are visible without scripting', state.rowsVisible === state.rowsTotal, JSON.stringify(state));
  check('all five sections exist without scripting', state.sections, 'a section is missing');
  check('no horizontal overflow without scripting', state.overflow === 0, `overflow ${state.overflow}`);

  await page.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nNo-JavaScript checks passed.');
