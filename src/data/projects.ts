export interface Project {
  slug: string;
  summary: string;
  shortStack: string;
  purpose: string;
  contribution: string;
  status: string;
  visual?: 'pitch' | 'jarvis';
  visualCaption?: string;
  upstream?: { name: string; href: string }[];
  name: string;
  kind: string;
  description: string;
  year?: string;
  // Public project: the canonical public repository URL. Private project:
  // omitted; the detail page offers an email inquiry instead.
  href?: string;
  liveHref?: string;
  // Verified stack only. Omitted where the stack is not verified.
  stack?: string;
  // Verified role only. Omitted where the role is not verified.
  role?: string;
  preview: string;
  alt: string;
  caption: string;
  // Natural source dimensions; detail pages show the complete image.
  width: number;
  height: number;
}

export const projects: Project[] = [
  {
    name: 'Jarvis',
    visual: 'jarvis',
    visualCaption: 'An illustrated housekeeping workflow based on the implemented quick-entry path: preview and explicit confirmation come before saving to Google Sheets.',
    slug: 'jarvis',
    summary: 'An iMessage-connected AI assistant for developer tools, local knowledge, and motel operations. Specialized agents retrieve notes, monitor GitHub, and manage housekeeping workflows, with authorization and duplicate-action safeguards around the work they perform.',
    shortStack: 'Node.js · Photon · SQLite · Google Sheets',
    purpose: 'Work with tools and information through a message, whether that means checking a development project, finding a note, or recording a housekeeping shift.',
    description: 'Photon connects iMessage to a Node.js service. A router delegates requests to specialized agents: developer tools retrieve OpenCode project context and monitor GitHub activity; Atlas searches an Obsidian vault through a local SQLite FTS5 index; housekeeping workflows track shifts and prepare operational summaries through Google Sheets.',
    contribution: 'Built the messaging bridge, agent routing, local knowledge retrieval, GitHub monitoring, and housekeeping workflows. Added sender authorization, persisted delivery state, deduplication, confirmation safeguards, audit logging, and restart recovery so messages can support operational tasks reliably.',
    status: 'Independent project · actively developed · details on request',
    kind: 'AI agents & workflow automation',
    stack: 'Node.js · Photon · OpenCode · SQLite FTS5 · GitHub API · Google Sheets',
    preview: '/work/jarvis.svg',
    alt: 'Jarvis architecture diagram: iMessage connects through Photon and an agent router to developer tools, local knowledge, and operations.',
    caption: 'Architecture diagram of the implemented system; not a conversation screenshot. No private messages or operational data are shown.',
    width: 1200,
    height: 750,
  },
  {
    name: 'ContextOS',
    slug: "contextos",
    summary: "A local-first desktop app for reviewing what AI assistants remember about you. Trace claims to their source messages, correct the picture, and export approved context for other tools to use.",
    shortStack: "Electron · TypeScript · SQLite",
    purpose: "AI assistants each hold a different picture of you. ContextOS makes that context visible and puts its review under your control.",
    contribution: "A private portfolio project focused on inspectable context and memory, delivered as a local-first Windows MVP.",
    status: "Private project · Windows MVP",
    kind: 'Context & memory infrastructure',
    description:
      'Your AI assistants each hold a different picture of you. ContextOS imports conversations from ChatGPT, Gemini, or Claude, shows every claim against its source message, and exports an approved context pack other tools can use. Local-first Windows desktop app — nothing is uploaded.',
    year: '2026',
    stack: 'Electron · React + TypeScript · SQLite',
    preview: '/work/contextos.png',
    alt: 'ContextOS project artwork showing the product name and the statement “See everything your AIs think they know about you.”',
    caption: 'Project artwork; this is not an application screenshot.',
    width: 1200,
    height: 630,
  },
  {
    name: 'Teller',
    slug: "teller",
    summary: "A review layer for financial AI agents. Model-based risk checks inform decisions, while fixed policy code controls approval. Built as LedgerGuard at LA Hacks; now independently maintained with simulated actions.",
    shortStack: "React · FastAPI · LangGraph",
    purpose: "Separate model-based risk assessment from the policy code that decides whether a financial action can proceed.",
    contribution: "Began as LedgerGuard, a team build for the Intuit QuickBooks challenge at LA Hacks 2026. I now maintain the project independently as Teller.",
    status: "Prototype · simulated actions only · no live payments",
    kind: 'Financial review & decision workflows',
    description:
      'Stops an AI agent from moving money on a hunch. Model-based checks score each decision for risk, but only fixed policy code can approve it — ALLOW, REQUIRE_APPROVAL, REQUEST_CONTEXT, or BLOCK — so every action is reviewed before anything runs. Began as LedgerGuard, a team build for the Intuit QuickBooks challenge; now independently maintained. Prototype with simulated actions — no live payments.',
    year: '2026',
    href: 'https://github.com/mirabhakta/Teller',
    role: 'Hackathon team · now independently maintained',
    stack: 'React + TypeScript · Python + FastAPI · SQLite · LangGraph · Gemini',
    preview: '/work/ledgerguard.png',
    alt: 'Teller console (built as LedgerGuard) showing scenario selection, an evaluation pipeline blocked by a duplicate-payment policy, and a live event stream.',
    caption: 'Teller, shown under its original LedgerGuard name.',
    width: 1440,
    height: 900,
  },
  {
    name: 'Kandor',
    slug: "kandor",
    summary: "A Chrome extension that flags grooming, manipulation, and scam patterns in supported chats. It explains the risk, highlights the messages behind the alert, and suggests a next step. Built with a team of four.",
    shortStack: "Chrome extension · Python · FastAPI",
    purpose: "Make concerning patterns in a conversation easier to recognize by showing the messages behind an alert and explaining why they were flagged.",
    contribution: "Built with a team of four at Hacktech 2026 at Caltech. The project combines a Chrome extension with a Python backend for conversation safety review.",
    status: "Hacktech 2026 · team of four",
    kind: 'Conversation safety review',
    description:
      'A Chrome extension that watches supported chats for grooming, manipulation, and scam patterns as they happen, then explains the risk, quotes the messages that triggered it, and suggests what to do next. Team of four at Hacktech 2026.',
    year: '2026',
    href: 'https://github.com/mirabhakta/kandor',
    role: 'Team of four',
    stack: 'Chrome extension · Python + FastAPI · rule-based NLP + Gemma 4 + K2 Think',
    preview: '/work/kandor.png',
    alt: 'Kandor extension detecting risky phrases in a chat, with an alert panel listing risk, confidence, and a recommended action.',
    caption: 'Hacktech 2026 · Caltech.',
    width: 1400,
    height: 904,
  },
  {
    name: 'Artist Atlas',
    slug: 'artist-atlas',
    summary: 'A network analysis of 156K Spotify artists and 300K collaboration links, exploring artist influence, genre communities, and the relationship between connectivity and popularity. Findings are presented in an interactive dashboard.',
    shortStack: 'Python · NetworkX · Streamlit · Plotly',
    purpose: 'Understand which artists connect music communities and whether an artist’s position in the collaboration network relates to their popularity.',
    description: 'Cleaned artist and collaboration records, then modeled 156,320 artists and 300,379 links as an undirected network. The analysis uses degree, PageRank, and eigenvector centrality, sampled betweenness on a popularity-filtered subgraph, Louvain community detection, and sampled shortest paths. A Streamlit dashboard presents the analysis through rankings, charts, and community comparisons.',
    contribution: 'Spring semester course project with Michelle Villagomez and Caden Maki. My work focused on network construction, graph analysis, visualizations, and interpreting the results, alongside Michelle. Caden focused on the final conclusions.',
    status: 'Course project · team of three · interactive dashboard',
    kind: 'Network analysis & music discovery',
    href: 'https://github.com/mirabhakta/artist-atlas',
    liveHref: 'https://spotify-collaboration-network.streamlit.app/',
    role: 'Network construction, analysis & visualization',
    stack: 'Python · pandas · NetworkX · SciPy · python-louvain · Matplotlib · Streamlit · Plotly',
    preview: '/work/artist-atlas.png',
    alt: 'Four scatter plots from the Artist Atlas analysis comparing Spotify popularity with degree, betweenness, PageRank, and eigenvector centrality.',
    caption: 'Analysis output from the project notebook. Betweenness uses a popularity-filtered subgraph; the other three measures use the full network.',
    width: 1389,
    height: 990,
  },
  {
    name: 'VoiceStudio Live',
    visual: 'pitch',
    visualCaption: 'An explanatory pitch diagram: the detected pitch varies around notes in a scale, while the target follows the selected notes. Illustrative curves, not measured audio or benchmark results.',
    slug: "voicestudio-live",
    summary: "A live vocal-processing extension of open-source VoiceStudio, adding microphone monitoring, key-aware pitch correction, and Applio-backed voice conversion. My work focuses on the streaming pipeline, recording, device recovery, and GPU coordination.",
    shortStack: "Python · Electron · Pitch correction · RVC",
    purpose: "Extend an existing voice-generation app into a workspace for live vocals: monitor a microphone, correct pitch to a chosen key and scale, convert voice timbre, and record takes.",
    contribution: "Built the live microphone pipeline and recording workflow; added key/scale pitch correction, runtime bypass controls, and Applio-backed RVC integration. Extended the interface with voice-model controls and performance presets, then worked on split-stream device compatibility, buffer reliability, worker recovery, and GPU coordination with existing speech-generation tasks.",
    status: "Local development prototype · hardware listening and end-to-end latency validation remain",
    upstream: [
      { name: 'VoiceStudio by debpalash', href: 'https://github.com/debpalash/VoiceStudio' },
      { name: 'Applio by AI Hispano', href: 'https://github.com/IAHispano/Applio' },
    ],
    kind: 'Live vocals & pitch correction',
    stack: 'Python · Electron · sounddevice / PortAudio · pyworld · Pedalboard · Applio / RVC · CUDA',
    description:
      'Microphone audio passes through independently switchable pitch-correction and RVC voice-conversion stages, with dry bypass, headphone monitoring, level meters, and WAV recording. Pitch controls include key, scale, strength, and retune speed. RVC runs in an isolated worker with model loading, performance presets, recovery, and GPU coordination. Synthetic-audio benchmarks exercise processing and reliability; they do not establish physical microphone-to-headphone latency or listening quality.',
    preview: '/work/voicestudio-live.png',
    alt: 'VoiceStudio Live’s OmniVoice interface with a script field, voice controls, an active voice panel, and generation history.',
    caption: 'Earlier screenshot of the inherited VoiceStudio / OmniVoice workspace; it does not show the newer live-vocal controls.',
    width: 1200,
    height: 750,
  },
];
