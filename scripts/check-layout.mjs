// Rendered layout and static route regression checks. Uses the same local CDP
// helper as the existing navigation checks.
import { Browser } from 'file:///C:/Users/miraa/AppData/Local/hermes/skills/creative/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
const origin = process.argv[2] || 'http://127.0.0.1:4321/';
const output = 'output/playwright';
mkdirSync(output, { recursive: true });
const failures = [];
function check(name, pass, detail) {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${pass ? '' : ': ' + JSON.stringify(detail)}`);
  if (!pass) failures.push(name);
}
const browser = await Browser.launch();
try {
  // 720 × 450 also checks the CSS viewport equivalent of a 1440 × 900
  // browser at 200% zoom.
  for (const [width, height] of [[375,812],[768,1024],[1440,900],[720,450]]) {
    const page = await browser.newPage({ width, height, reducedMotion: true });
    await page.goto(origin, { settleMs: 1000 });
    const state = await page.eval(`(() => {
      const email = document.querySelector('.header-email').getBoundingClientRect();
      const hero = document.querySelector('.hero__actions').getBoundingClientRect();
      return {
        overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        emailVisible: email.top >= 0 && email.bottom <= innerHeight,
        heroVisible: hero.bottom <= innerHeight,
        sections: [...document.querySelectorAll('main > section[id]')].map(s => s.id).join(','),
        projects: document.querySelectorAll('.project').length,
        columns: getComputedStyle(document.querySelector('.project-grid')).gridTemplateColumns.split(' ').length,
        brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).length,
        diagramsFit: [...document.querySelectorAll('[data-work-visual]')].every(visual => {
          const box = visual.getBoundingClientRect();
          const footer = visual.querySelector('.work-visual__footer').getBoundingClientRect();
          const drawing = visual.querySelector('svg').getBoundingClientRect();
          return footer.bottom <= box.bottom + 1 && drawing.height >= 30;
        })
      };
    })()`);
    check(`${width}px: no horizontal overflow`, state.overflow === 0, state);
    check(`${width}px: email is above the fold`, state.emailVisible, state);
    if (width !== 720) check(`${width}px: hero contact is above the fold`, state.heroVisible, state);
    check(`${width}px: five projects in responsive columns`, state.projects === 5 && state.columns === (width <= 640 ? 1 : 2), state);
    check(`${width}px: section order`, state.sections === 'work,experience,research,about,contact', state);
    check(`${width}px: no broken images`, state.brokenImages === 0, state);
    check(`${width}px: diagram labels fit their frames`, state.diagramsFit, state);
    await page.screenshot({ path: `${output}/home-${width}.png`, format: 'png', fullPage: true });
    await page.close();
  }
  const stylesByWidth = new Map();
  for (const width of [375,768,1440]) {
  for (const route of ['work/jarvis/','work/contextos/','work/teller/','work/kandor/','work/voicestudio-live/','research/']) {
    const page = await browser.newPage({ width, height: 900, reducedMotion: true });
    await page.goto(new URL(route, origin).href, { settleMs: 600 });
    const state = await page.eval(`(() => ({
      title: document.querySelector('h1')?.textContent,
      overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      back: document.querySelector('.back-link')?.getAttribute('href'),
      email: document.querySelector('.header-email')?.getAttribute('href'),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      // Collapsed historical screenshots are deliberately lazy-loaded.
      brokenImages: [...document.images].filter(i => !i.closest('details:not([open])') && i.getClientRects().length > 0 && (!i.complete || !i.naturalWidth)).length,
      styles: ['h1','.detail__lead','.detail__status','.detail__sections h2','.detail__sections p'].map(selector => {
        const style = getComputedStyle(document.querySelector(selector));
        return [style.fontFamily,style.fontSize,style.lineHeight,style.letterSpacing];
      }),
      sectionSpacing: getComputedStyle(document.querySelector('.detail__sections > section')).paddingBlock,
      headerSpacing: getComputedStyle(document.querySelector('.detail__header')).paddingBlock
    }))()`);
    check(`${route}: renders with home navigation and email`, !!state.title && state.back?.startsWith('/#') && state.email === 'mailto:miraabhakta@gmail.com', state);
    check(`${route}: no overflow or broken images`, state.overflow === 0 && state.brokenImages === 0, state);
    check(`${route}: canonical URL`, state.canonical === 'https://mirabhakta.me/' + route, state);
    const signature = JSON.stringify([state.styles,state.sectionSpacing,state.headerSpacing]);
    if (!stylesByWidth.has(width)) stylesByWidth.set(width, signature);
    check(`${width}px ${route}: shared typography and spacing`, signature === stylesByWidth.get(width), state);
    await page.screenshot({path: `${output}/${route.replaceAll('/','-')}${width}.png`,format:'png',fullPage:true});
    await page.close();
  }
  }
} finally { await browser.close(); }
if (failures.length) process.exitCode = 1;
