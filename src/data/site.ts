// Site content. Every claim here is verified against a repository or local file.
// Nothing invented: no metrics, awards, employers or dates.
// See portfolio-design/soft-monument-direction.json → sources.verifiedFact

export const site = {
  name: 'Mira Bhakta',
  domain: 'mirabhakta.me',
  role: 'AI and software engineer, researcher, creative technologist',
  // The supporting sentence under the monument. Says plainly what this is,
  // so the first screen is never a bare name (inspector: name-only-title).
  intro:
    'I build intelligent systems and the software around them — AI agents, context infrastructure, and tools for safety and financial decisions. Computer Science with an Economics minor at Cal Poly Pomona.',
  links: {
    github: 'https://github.com/mirabhakta',
    linkedin: 'https://www.linkedin.com/in/mirabhakta',
  },
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Research', href: '#research' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;
