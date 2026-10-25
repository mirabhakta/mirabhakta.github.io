// Claim probe: every public-facing research and experience claim is checked
// against the source documents it was derived from.
//
// Sources (read-only):
//   C:/Users/miraa/Downloads/CARS_MiraBhakta_poster.odp (48 x 36 in).pdf
//   C:/Users/miraa/OneDrive - Cal Poly Pomona/RSCA_poster.pptx
//   C:/Users/miraa/Downloads/Mira_Bhakta_resume1.pdf
//   C:/Users/miraa/Documents/crowdcube_scraper/FINAL_COMPLETION_REPORT.md
//
// Run:  node scripts/check-claims.mjs
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Minimal ZIP reader (no dependencies): returns the concatenated text of
// every .xml entry in the package, which is enough to read slide text.
import { inflateRawSync } from 'node:zlib';
const unzipText = (file) => {
  const buf = readFileSync(file);
  let out = '';
  for (let i = 0; i < buf.length - 4; i += 1) {
    if (buf.readUInt32LE(i) !== 0x04034b50) continue;
    const method = buf.readUInt16LE(i + 8);
    const compSize = buf.readUInt32LE(i + 18);
    const nameLen = buf.readUInt16LE(i + 26);
    const extraLen = buf.readUInt16LE(i + 28);
    const start = i + 30 + nameLen + extraLen;
    const raw = buf.subarray(start, start + compSize);
    try {
      const data = method === 0 ? raw : inflateRawSync(raw);
      const name = buf.subarray(i + 30, i + 30 + nameLen).toString('latin1');
      if (name.endsWith('.xml') || name.endsWith('.rels')) out += data.toString('latin1') + '\n';
    } catch { /* not a zip member we can read */ }
  }
  return out;
};


const POSTER = 'C:/Users/miraa/Downloads/CARS_MiraBhakta_poster.odp (48 x 36 in).pdf';
const RSCA = 'C:/Users/miraa/OneDrive - Cal Poly Pomona/RSCA_poster.pptx';
const RESUME = 'C:/Users/miraa/Downloads/Mira_Bhakta_resume1.pdf';
const AUDIT = 'C:/Users/miraa/Documents/crowdcube_scraper/FINAL_COMPLETION_REPORT.md';
const SITE = 'C:/Users/miraa/mirabhakta.github.io/src';

const pdftotext = (file) =>
  execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });

const poster = pdftotext(POSTER);
const resume = pdftotext(RESUME);
const audit = readFileSync(AUDIT, 'utf8');
const research = readFileSync(`${SITE}/components/Research.astro`, 'utf8');
const experience = readFileSync(`${SITE}/components/Experience.astro`, 'utf8');
const contact = readFileSync(`${SITE}/components/Contact.astro`, 'utf8');
const work = readFileSync(`${SITE}/components/SelectedWork.astro`, 'utf8');

// The PDF and PPTX extract to text with spacing artefacts, so compare on a
// whitespace-collapsed, case-insensitive form.
// The poster PDF interleaves text from adjacent columns, so a word can be
// split by a space ("h igher"). Tight comparisons ignore all whitespace.
const tight = (s) => s.replace(/\s+/g, '').toLowerCase();
const E = tight(experience);


// The poster PDF lays out multiple columns, so pdftotext interleaves the
// text of adjacent columns and can split a word across a line ("h igher").
// Match the source wording as an ordered word sequence, allowing a bounded
// gap of interleaved text between words and spaces inside a word.
const flexible = (text, phrase, gap = 160) => {
  const words = phrase.toLowerCase().split(/\s+/).filter(Boolean);
  const part = words
    .map((w) => w.split('').map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*'))
    .join(`[\\s\\S]{0,${gap}}`);
  return new RegExp(part, 'i').test(text);
};

const failures = [];
const check = (name, ok, detail) => {
  if (!ok) failures.push(`${name}: ${detail}`);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ` — ${detail}`}`);
};
const has = (text, needle) => tight(text).includes(tight(needle));

// ---------------------------------------------------------------- research
check('research copy excludes the Cal Poly Pomona IT Service Desk', !/service desk|it service/i.test(research), 'found');
check('experience copy excludes the Cal Poly Pomona IT Service Desk', !/service desk|it service/i.test(experience), 'found');

check('site does not claim an AI-disclosure survival finding', !/disclos\w*\s+ai|ai[^.]{0,40}disclos\w*/i.test(research), 'still present');
check('poster does not support an AI-disclosure survival finding', !/disclos\w+[^.]{0,80}surviv/i.test(poster), 'poster does contain one');

// Poster-supported findings, in the poster's own wording.
check('poster: international orientation associated with higher long-run survival', flexible(poster, 'international orientation during the campaign was associated with a higher probability of long-run venture survival'), 'not found');
check('poster: sustainability during campaign associated with lower long-run survival', flexible(poster, 'sustainability positioning during the campaign was associated with a lower probability of long-run survival'), 'not found');
check('poster: sustainability during campaign associated with higher bankruptcy or insolvency', flexible(poster, 'higher probability of bankruptcy or insolvency'), 'not found');
check('poster: post-raise sustainability strongly associated with higher survival', flexible(poster, 'became sustainable after the raise') && flexible(poster, 'strongly associated with higher survival'), 'not found');
check('poster: post-raise bankruptcy risk statistically inconclusive', flexible(poster, 'pointed toward lower bankruptcy or insolvency risk, but the evidence was statistically inconclusive'), 'not found');
check('poster: acquisition sample too small to interpret', flexible(poster, 'number of acquired ventures was too small to support reliable interpretation'), 'not found');
check('poster: baseline is Crowdcube 2017-2018', flexible(poster, 'crowdcube campaigns from 2017') && flexible(poster, '2018'), 'not found');
check('poster: logistic regression reported as odds ratios', flexible(poster, 'reported using average marginal effects and odds ratios'), 'not found');
check('poster: IRB approval still pending', flexible(poster, 'following irb approval'), 'not found');
check('poster: findings are associations, not causal effects', flexible(poster, 'not be interpreted as causal effects', 900), 'not found');

// The site must carry the same claims.
check('site states the international orientation finding', has(research, 'International orientation during the campaign was associated with a higher probability of long-run survival'), 'missing');
check('site states the campaign-stage sustainability finding', has(research, 'Sustainability positioning during the campaign was associated with a lower probability of long-run survival'), 'missing');
check('site states the post-raise sustainability finding', has(research, 'becoming sustainable after the raise was strongly associated with higher long-run survival'), 'missing');
check('site states the inconclusive post-raise bankruptcy result', has(research, 'evidence was statistically inconclusive'), 'missing');
check('site states the acquisition limitation', has(research, 'too small to support reliable interpretation'), 'missing');
check('site states the Crowdcube baseline', has(research, 'Crowdcube campaigns from 2017 to 2018'), 'missing');
check('site states the odds-ratio reporting', has(research, 'reported as odds ratios'), 'missing');
check('site states the IRB status', has(research, 'pending institutional review board approval'), 'missing');
check('site calls the findings preliminary', has(research, 'Preliminary findings'), 'missing');
check('site states the findings are not causal effects', has(research, 'associations in the data, not causal effects'), 'missing');

// Presentation status, from the RSCA poster file.
const rscaRaw = unzipText(RSCA);
check('RSCA file names the co-author Ruiyang Wang', /Ruiyang\s*Wang/.test(rscaRaw.replace(/<[^>]+>/g, ' ')), 'missing');
check('RSCA file states the RSCA Conference 2026', /RSCA\s*Conference\s*2026/.test(rscaRaw.replace(/<[^>]+>/g, ' ')), 'missing');
check('site names the co-author', has(research, 'Ruiyang Wang'), 'missing');
check('site states the presentation status', has(research, 'Presented at the RSCA Conference 2026'), 'missing');
check('site explicitly says it is not a published paper', has(research, 'not a published paper'), 'missing');
check('site does not claim the study is published', !/(?<!not a )(?<!not )published (paper|article|study|journal)/i.test(research), 'claims publication');
check('site does not claim a journal publication anywhere', !/\bjournal\b/i.test(research), 'mentions a journal');
check('site does not claim awards or acceptance', !/\baccepted (paper|abstract|poster)\b/i.test(research), 'claims acceptance');

// ------------------------------------------------------------------- audit
check('audit report states 219 rows audited', /Total Rows Audited:\*\* 219/.test(audit), 'missing');
check('audit report states 1,752 field checks', /Total Fields Audited:\*\* 1,752/.test(audit), 'missing');
check('site states 219 campaigns', has(research, '219 campaigns'), 'missing');
check('site states 1,752 field checks', has(research, '1,752 field checks'), 'missing');

// --------------------------------------------------------------- experience
const experienceFacts = [
  ['Metal Toad', 'Project Management Office Intern', 'May 2026'],
  ['LA-Tech.org', 'Software Engineering Intern, AI/ML, Project Lead', 'Feb 2026 to May 2026'],
  ['Cal Poly Pomona', 'Undergraduate Research Assistant', 'Aug 2025 to present'],
  ['Handshake', 'AI Evaluator, contract', 'Dec 2025 to Jan 2026'],
  ['Kumon', 'Tutor and Instructor', 'June 2025 to present'],
];
for (const [org, role, period] of experienceFacts) {
  check(`experience copy has ${org}`, E.includes(tight(org)), 'missing');
  check(`experience copy has role "${role}"`, E.includes(tight(role)), 'missing');
  check(`experience copy has period "${period}"`, E.includes(tight(period)), 'missing');
}
check('resume lists Metal Toad', flexible(resume, 'project management office intern | metal toad'), 'missing');
check('resume lists LA-Tech.org', flexible(resume, 'engineering intern (ai/ml, project lead) | la-tech.org'), 'missing');
check('resume lists Kumon', flexible(resume, 'tutor & instructor | kumon north america'), 'missing');
check('resume lists Handshake', flexible(resume, 'ai evaluator (contract) | handshake'), 'missing');
check('resume lists the undergraduate research role', flexible(resume, 'undergraduate research assistant'), 'missing');
check('resume lists 1,000+ campaigns', flexible(resume, '1,000+ campaigns'), 'missing');
check('site states 1,000+ campaigns', has(experience, '1,000+ campaigns'), 'missing');

// ------------------------------------------------------------------ contact
check('contact links to GitHub', contact.includes('https://github.com/mirabhakta'), 'missing');
check('contact links to LinkedIn', contact.includes('https://www.linkedin.com/in/mirabhakta'), 'missing');
check('contact publishes the verified professional email', contact.includes('href="mailto:miraabhakta@gmail.com"'), 'the mailto link is missing or different');
check('contact shows the verified address as visible text', contact.includes('miraabhakta@gmail.com'), 'the address text is missing');
check('contact publishes no other email address', !/@[\w.-]+\.[a-z]{2,}/i.test(contact.replace(/miraabhakta@gmail\.com/g, '')), 'an unexpected email address is present');

// ------------------------------------------------------------------ projects
check('LedgerGuard points at the canonical public repository', work.includes("href: 'https://github.com/mirabhakta/Teller'"), 'missing');
check('Kandor points at the canonical public repository', work.includes("href: 'https://github.com/mirabhakta/kandor'"), 'missing');
check('no link to the private ContextOS repository', !/github\.com\/mirabhakta\/contextos/i.test(work), 'still linked');
check('no link to the private VoiceStudio repository', !/github\.com\/mirabhakta\/VoiceStudio-Live/i.test(work), 'still linked');
check('ContextOS is presented as a private project', /Private project/.test(work), 'missing');
check('VoiceStudio Live is presented as a private project', /VoiceStudio Live/.test(work), 'missing');

if (failures.length) {
  console.error(`\n${failures.length} claim check(s) failed.`);
  process.exit(1);
}
console.log('\nAll claim checks passed.');
