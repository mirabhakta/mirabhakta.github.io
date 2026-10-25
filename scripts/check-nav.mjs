// Regression checks for the mobile navigation and public project links.
//
// Run against a served build:  node scripts/check-nav.mjs http://127.0.0.1:4321/
//
// The check is deliberately behavioural: it drives a real Chrome page at phone
// width and asserts that the menu opens, closes, closes on Escape, closes when
// a link is chosen, and that every section anchor resolves to a real section.
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

  const markup = await page.eval(`(() => {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.site-nav__toggle');
    return {
      navId: nav ? nav.id : null,
      controls: toggle ? toggle.getAttribute('aria-controls') : null,
      expanded: toggle ? toggle.getAttribute('aria-expanded') : null,
      anchors: Array.from(document.querySelectorAll('.site-nav__link')).map((a) => a.getAttribute('href')),
      sections: ['work','research','experience','about','contact'].map((id) => ({
        id,
        found: !!document.getElementById(id),
      })),
    };
  })()`);

  check('nav element carries the primary-navigation id', markup.navId === 'primary-navigation', `got ${markup.navId}`);
  check('toggle aria-controls points at the nav element', markup.controls === markup.navId, `controls=${markup.controls} navId=${markup.navId}`);
  check('toggle starts collapsed', markup.expanded === 'false', `got ${markup.expanded}`);
  check('five nav links present', markup.anchors.length === 5, `got ${markup.anchors.length}`);
  for (const s of markup.sections) {
    check(`section #${s.id} exists`, s.found, 'not found');
  }

  // Open
  const opened = await page.eval(`(() => {
    const t = document.querySelector('.site-nav__toggle');
    t.click();
    const nav = document.querySelector('.site-nav');
    return {
      expanded: t.getAttribute('aria-expanded'),
      label: t.textContent.trim(),
      visible: getComputedStyle(nav).display !== 'none',
      linkVisible: nav.querySelector('.site-nav__link').getBoundingClientRect().height > 0,
    };
  })()`);
  check('menu opens on click', opened.expanded === 'true' && opened.visible, JSON.stringify(opened));
  check('toggle label becomes Close', opened.label === 'Close', `got ${opened.label}`);
  check('nav links are visible when open', opened.linkVisible, 'links have zero height');

  // Escape closes and returns focus to the toggle
  const escaped = await page.eval(`(() => {
    const t = document.querySelector('.site-nav__toggle');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return {
      expanded: t.getAttribute('aria-expanded'),
      label: t.textContent.trim(),
      focused: document.activeElement === t,
    };
  })()`);
  check('Escape closes the menu', escaped.expanded === 'false', `got ${escaped.expanded}`);
  check('Escape returns focus to the toggle', escaped.focused, 'focus was not restored');

  // Choosing a link closes the menu
  const chosen = await page.eval(`(() => {
    const t = document.querySelector('.site-nav__toggle');
    t.click();
    const link = document.querySelector('.site-nav__link');
    link.click();
    return {
      expanded: t.getAttribute('aria-expanded'),
      label: t.textContent.trim(),
    };
  })()`);
  check('choosing a link closes the menu', chosen.expanded === 'false', `got ${chosen.expanded}`);

  // Second click closes an open menu
  const toggled = await page.eval(`(() => {
    const t = document.querySelector('.site-nav__toggle');
    t.click();
    const afterOpen = t.getAttribute('aria-expanded');
    t.click();
    return { afterOpen, afterSecond: t.getAttribute('aria-expanded') };
  })()`);
  check('second click closes the menu', toggled.afterOpen === 'true' && toggled.afterSecond === 'false', JSON.stringify(toggled));

  // Public project links resolve; private projects are not linked.
  const links = await page.eval(`(() => {
    const rows = Array.from(document.querySelectorAll('.work__row'));
    return rows.map((r) => ({
      name: r.querySelector('.work__name')?.textContent.trim(),
      href: r.tagName === 'A' ? r.getAttribute('href') : null,
      note: r.querySelector('.work__meta-text')?.textContent.trim(),
    }));
  })()`);
  for (const row of links) {
    if (row.href) {
      check(`${row.name} links to a public repository`, /^https:\/\/github\.com\/mirabhakta\//.test(row.href), row.href);
    } else {
      check(`${row.name} is presented as private`, /Private project/.test(row.note || ''), row.note || 'no status note');
    }
  }

  await page.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll navigation regression checks passed.');
