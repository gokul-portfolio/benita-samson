/**
 * Central portfolio data — built from Benita Samson's Founder Portfolio PDF
 * (Benita_Samson_Founder_Portfolio_Revised.pdf).
 * Every fact on the site comes from this file.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Benita Samson',
  displayName: 'Benita Samson',
  firstName: 'BENITA SAMSON',
  seriesTag: 'FOUNDER & CEO',
  /** Studio card shown at the very start of the opening sequence. */
  originalLabel: 'CONNECTING DOTS WORLDWIDE',
  role: 'Founder & CEO · Connecting Dots Worldwide',
  tagline: ['Founder & CEO', 'Connecting Dots Worldwide', 'The Blind Spot'],
  intro:
    'After nearly a decade in Australian banking (NAB & CBA), Benita Samson walked away from conventional comfort to build Connecting Dots Worldwide, establish The Blind Spot, and grow Career with Beni to 50,000+ followers.',
  quote: 'Success is not just about what is achieved. It is about having the courage to create what does not yet exist.',
  location: 'Madurai, India · Registered in Australia',
  email: 'benitasamson@gmail.com',
  phone: '8124810001',
  links: {
    portfolio: 'https://benitasamson.com',
    careerhq: 'https://www.careerhq.in',
    instagram: 'https://www.instagram.com/careerwithbeni/',
    linkedin: 'https://www.careerhq.in',
    github: 'https://www.careerhq.in',
  },
  resumePdf: '/assets/Benita_Samson_Founder_Portfolio.pdf',
  bannerVideo: '/assets/video/banner-video-6.webm',
  bannerVideoFallback: '/assets/video/banner-video-5.mp4',
  bannerAudio: '/assets/video/banner-video-5.mp4',
  openingImage: '/assets/images/benita.png',
  portrait: {
    src: '/assets/images/benita.png',
    srcSet: '/assets/images/benita.png',
    alt: 'Portrait of Benita Samson',
  },
  portraitGaze: {
    front: '/assets/images/animation/cutout/front.png',
    topLeft: '/assets/images/animation/cutout/top-left.png',
    topRight: '/assets/images/animation/cutout/top-right.png',
    bottomLeft: '/assets/images/animation/cutout/bottom-left.png',
    bottomRight: '/assets/images/animation/cutout/bottom-right.png',
    down: '/assets/images/animation/cutout/down.png',
  },
  interests: [
    'Career HQ (Education & Admissions)',
    'Industry Connect (Professional Network)',
    'A T O M (Journal & Publishing)',
    'DNA (Digital Learning Platform)',
    'The Blind Spot (Non-Profit)',
    'Social Media & Shows (Career with Beni · Mic & Mentors · TRP - The Reality Project)',
  ],
};

export const education = [
  {
    school: 'National Australia Bank (NAB)',
    place: 'Australia',
    degree: 'Banking & Financial Services Career',
    period: 'Nearly a decade in banking',
    score: '~10 Years',
  },
  {
    school: 'Commonwealth Bank of Australia (CBA)',
    place: 'Australia',
    degree: 'Final chapter in Australian banking before entrepreneurship',
    period: 'Final 6 months',
    score: '6 Months',
  },
];

export const experience = [
  {
    company: 'Connecting Dots Worldwide',
    role: 'Founder & CEO',
    place: 'Australia (Registered 2025) & India',
    period: '2025 – Present',
    points: [
      'Registered Connecting Dots Worldwide in Australia in 2025 as the parent company identity, with its India business developing under the same identity.',
      'Parent company overseeing 4 core companies: 1. Career HQ, 2. Industry Connect, 3. A T O M, and 4. DNA.',
      'Also established The Blind Spot as an independent non-profit organisation, alongside media ventures Career with Beni, Mic & Mentors, and TRP - The Reality Project (Show).',
    ],
  },
  {
    company: 'Career HQ',
    role: 'Founder & CEO',
    place: 'Madurai, India',
    period: 'October 2025 – Present',
    points: [
      'Company 1 under Connecting Dots Worldwide — uniting Indian admissions, international education, MBBS admissions, training & placement, education loans, and scholarship support.',
      'Partnered with Gandhi (PickMyAdmission & CareerBee Overseas Education) after meeting at Bharath University and an education expo.',
      'Created the Career HQ logo on 15 October 2025; built an 8-member team (Benita Samson, Gandhi, Vino, Manimalan, Sajitha, Ashwini, Malathi, Agalya) with a vision to grow to 15.',
    ],
  },
  {
    company: 'The Blind Spot',
    role: 'Founder',
    place: 'Madurai, India',
    period: 'Non-Profit Organisation',
    points: [
      'An independent non-profit organisation dedicated to community welfare, social inclusion, and grassroots impact.',
      'Focused on bringing overlooked people, unheard stories, and ignored realities into focus for lasting positive social change.',
    ],
  },
  // {
  //   company: 'Hope Education & Migration',
  //   role: 'Franchise Founder',
  //   place: 'Madurai, India',
  //   period: 'February 2025',
  //   points: [
  //     'Walked away from an established banking career in Australia, sold her home and cars, and brought the Hope Education & Migration franchise to Madurai, India.',
  //     'Spent the first six months exploring the Indian education market, meeting counsellors, understanding admissions, and laying the groundwork with a founding team of four.',
  //   ],
  // },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  github?: string;
  externalUrl?: string;
  externalLabel?: string;
  logo?: string;
  logoTheme?: 'light' | 'dark';
  emblem?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'connecting-dots',
    title: 'Connecting Dots Worldwide',
    year: 'Australia · 2025',
    genre: 'Parent Company • 4 Portfolio Companies • Benita Samson',
    logline:
      'The parent company identity behind 4 companies: Career HQ, Industry Connect, A T O M, and DNA — registered in Australia by Benita Samson in 2025, developing its India business under the same banner.',
    stack: ['Career HQ', 'Industry Connect', 'A T O M', 'DNA'],
    build: [
      'Connecting Dots Worldwide is the parent company identity behind the growing entrepreneurial ecosystem. Registered in Australia by Benita Samson in 2025, its India business is being developed under the same parent-company identity.',
      'Parent company overseeing 4 core companies: 1. Career HQ, 2. Industry Connect, 3. A T O M, and 4. DNA. Alongside this ecosystem is The Blind Spot, an independent non-profit organisation.',
    ],
    features: [
      '1. Career HQ — Existing business for education, admissions, MBBS, placement, loans & scholarships',
      '2. Industry Connect — Upcoming initiative connecting professionals, industries & opportunities',
      '3. A T O M — Upcoming journal and publishing venture by Benita Samson',
      '4. DNA — Upcoming digital network and advancement online learning platform',
    ],
    metrics: [
      { value: '2025', label: 'registered in Australia' },
      { value: '4', label: 'companies under parent' },
      { value: 'India+', label: 'expanding footprint' },
      { value: '8 → 15', label: 'team growth vision' },
    ],
    externalUrl: 'https://benitasamson.com',
    externalLabel: 'benitasamson.com',
    logo: '/assets/images/logo/connecting-dots-clean.png',
    logoTheme: 'dark',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
  {
    id: 'career-hq',
    title: 'Career HQ',
    year: 'Existing Business · Company 1',
    genre: 'Company 1 • Education • Admissions • Placements',
    logline:
      'Company 1 under Connecting Dots Worldwide — existing business for education, admissions, MBBS, training and placement, loan and scholarship support.',
    stack: ['Education & Admissions', 'MBBS', 'Training & Placement', 'Loan Support', 'Scholarships'],
    build: [
      'Founded on 15 October 2025, uniting Indian and international admissions, medical education, training & placement, and financial aid guidance.',
      'Serves as the flagship active company inside the Connecting Dots Worldwide parent portfolio.',
    ],
    features: [
      'Study in India & Abroad — Comprehensive university admissions',
      'MBBS Admissions — Medical admissions guidance in India & overseas',
      'Training & Placement — Career readiness & employment pathways',
      'Education Loan & Scholarship Support — Student financial guidance',
    ],
    metrics: [
      { value: 'Active', label: 'existing business' },
      { value: '15 Oct', label: '2025 brand launch' },
      { value: '5', label: 'core service pillars' },
      { value: 'Global', label: 'admissions reach' },
    ],
    externalUrl: 'https://www.careerhq.in',
    externalLabel: 'Visit careerhq.in',
    logo: '/assets/careerhq-logo.png',
    logoTheme: 'dark',
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'industry-connect',
    title: 'Industry Connect',
    year: 'Upcoming · Company 2',
    genre: 'Company 2 • Professionals • Industries • Opportunities',
    logline: 'Company 2 under Connecting Dots Worldwide — connecting professionals, industries and opportunities.',
    stack: ['Industry Network', 'Career Opportunities', 'Professional Bridge', 'Partnerships'],
    build: [
      'Built to bridge emerging talent, seasoned professionals, and hiring industries under the Connecting Dots Worldwide ecosystem.',
      'Creates direct pathways between education outcomes and real-world industry demand.',
    ],
    features: [
      'Cross-industry professional networking & mentorship',
      'Direct industry-to-talent opportunity matching',
      'Synergy with Career HQ training & placement pipelines',
    ],
    metrics: [
      { value: 'Upcoming', label: 'initiative status' },
      { value: 'B2B+', label: 'industry partnerships' },
      { value: 'Careers', label: 'opportunity bridge' },
      { value: 'Global', label: 'network scope' },
    ],
    logo: '/assets/images/logo/industry-connect-clean.png',
    logoTheme: 'dark',
    palette: { from: '#0b1020', via: '#1e355e', to: '#07090f', accent: '#6fa8ff' },
    motif: 'flow',
  },
  {
    id: 'atom-journal',
    title: 'A T O M',
    year: 'Upcoming · Company 3',
    genre: 'Company 3 • A T O M – The Journal Collection • Publishing',
    logline: 'Company 3 under Connecting Dots Worldwide — A T O M: a journal and publishing venture by Benita Samson.',
    stack: ['A T O M', 'Journal Collection', 'Publishing Venture', 'Editorial Reflections'],
    build: [
      'A T O M is a personal publishing and journal initiative created by Benita Samson to capture structured reflection, clarity, and intentional living.',
      'Extends the Connecting Dots Worldwide ecosystem into curated print and knowledge products.',
    ],
    features: [
      'Thoughtfully designed guided journals & collections under A T O M',
      'Authored and curated by Benita Samson',
      'Focused on clarity, personal growth & milestone reflection',
    ],
    metrics: [
      { value: 'Upcoming', label: 'publishing venture' },
      { value: 'Print', label: 'journal collection' },
      { value: 'A T O M', label: 'brand identity' },
      { value: 'Editorial', label: 'curated editions' },
    ],
    logo: '/assets/images/logo/atom.jpeg',
    logoTheme: 'dark',
    palette: { from: '#1d1208', via: '#634018', to: '#0a0806', accent: '#e7b973' },
    motif: 'tenants',
  },
  {
    id: 'dna-platform',
    title: 'DNA',
    year: 'Upcoming · Company 4',
    genre: 'Company 4 • Digital Network and Advancement • Online Education',
    logline: 'Company 4 under Connecting Dots Worldwide — DNA: an online education and digital learning platform.',
    stack: ['DNA', 'Online Education', 'Digital Learning', 'Skill Advancement'],
    build: [
      'DNA (Digital Network and Advancement) is designed as a modern digital learning ecosystem enabling accessible, structured skill advancement online.',
      'Connects digital media storytelling with practical, career-ready learning modules under Connecting Dots Worldwide.',
    ],
    features: [
      'DNA — Interactive online education & structured learning tracks',
      'Accessible digital skill advancement across regions',
      'Built to scale knowledge sharing beyond physical classrooms',
    ],
    metrics: [
      { value: 'Upcoming', label: 'digital platform' },
      { value: 'Online', label: 'education model' },
      { value: 'DNA', label: 'learning network' },
      { value: '24/7', label: 'digital access' },
    ],
    logo: '/assets/images/logo/dna.jpeg',
    logoTheme: 'dark',
    palette: { from: '#051526', via: '#0b4f82', to: '#05080e', accent: '#38bdf8' },
    motif: 'flow',
  },
  {
    id: 'the-blind-spot',
    title: 'The Blind Spot',
    year: 'Non-Profit Organisation',
    genre: 'Non-Profit Organisation • Social Impact',
    logline:
      'An independent non-profit organisation focused on community welfare, inclusion, awareness and creating positive change in society.',
    stack: ['Non-Profit Organisation', 'Community Welfare', 'Inclusion', 'Social Impact'],
    build: [
      'The Blind Spot is an independent non-profit organisation dedicated to lifting underserved voices and creating measurable community impact.',
      'Focuses on awareness, inclusion, and long-term social welfare.',
    ],
    features: [
      'Non-profit organisation for community welfare & grassroots outreach programs',
      'Inclusion & social awareness campaigns',
      'Independent social-impact mission for lasting positive change',
    ],
    metrics: [
      { value: 'Non-Profit', label: 'organisation type' },
      { value: 'Independent', label: 'social impact' },
      { value: 'Inclusion', label: 'core pillar' },
      { value: 'Welfare', label: 'community focus' },
    ],
    logo: '/assets/images/logo/the-blind-spot-clean.png',
    logoTheme: 'dark',
    palette: { from: '#1d070a', via: '#6b121b', to: '#090608', accent: '#fb7185' },
    motif: 'tenants',
  },
  // {
  //   id: 'the-reality-project',
  //   title: 'TRP - The Reality Project',
  //   year: 'Show · Mic & Mentors',
  //   genre: 'Show • Documentary • Everyday Professions • Mic & Mentors',
  //   logline:
  //     'Show: TRP - The Reality Project — Stories of everyday professions, spotlighting the real people, skills, and journeys behind essential work through Mic & Mentors.',
  //   stack: ['Show', 'TRP - The Reality Project', 'Mic & Mentors', 'Everyday Professions', 'Documentary'],
  //   build: [
  //     'TRP - The Reality Project is a dedicated documentary-style show within the upcoming Mic & Mentors YouTube channel.',
  //     'Real-world conversations celebrating everyday professions and community heroes under Mic & Mentors media.',
  //   ],
  //   features: [
  //     'Show: TRP - The Reality Project — Flagship documentary show under Mic & Mentors',
  //     'Real-world conversations celebrating everyday professions and community heroes',
  //     'Bridging youth curiosity with authentic career and life stories',
  //   ],
  //   metrics: [
  //     { value: 'Show', label: 'TRP - The Reality Project' },
  //     { value: 'Mic & Mentors', label: 'YouTube channel' },
  //     { value: 'Documentary', label: 'field storytelling' },
  //     { value: 'Impact', label: 'human-first lens' },
  //   ],
  //   logo: '/assets/images/logo/the-reality-project-clean.png',
  //   logoTheme: 'dark',
  //   palette: { from: '#181008', via: '#5c2810', to: '#08080c', accent: '#f59e0b' },
  //   motif: 'flow',
  // },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'banking-career',
    title: '~10 Years Banking',
    org: 'NAB & CBA · Australia',
    detail: 'Built nearly a decade in Australian banking with NAB and CBA before walking away from conventional comfort to pursue entrepreneurship.',
    laurel: 'The Foundation',
  },
  {
    id: 'connecting-dots',
    title: 'Connecting Dots Worldwide',
    org: 'Registered in Australia · 2025',
    detail: 'Registered in Australia by Benita Samson in 2025 as the parent company identity connecting education, industry, digital learning, media, and social impact.',
    laurel: 'Parent Company',
    link: '#originals',
  },
  {
    id: 'hope-franchise',
    title: 'Hope Franchise',
    org: 'Madurai · Feb 2025',
    detail: ' brought Hope Education & Migration to Madurai, mastering the Indian admission ecosystem with a team of four.',
    laurel: 'First Venture',
  },
  {
    id: 'career-hq',
    title: 'Career HQ',
    org: 'Founder & CEO · 15 Oct 2025',
    detail: 'Created on 15 October 2025 with Gandhi, uniting Indian admissions, study abroad, MBBS, training & placement, education loans, and scholarships.',
    laurel: 'Shared Brand',
    link: 'https://www.careerhq.in',
  },
  {
    id: 'career-with-beni',
    title: 'Career with Beni',
    org: '50,000+ Followers · Instagram',
    detail: 'Launched 12 February 2026 on Instagram, inspiring audiences with 120+ videos published and reaching 50,000+ followers in roughly six months.',
    laurel: 'Digital Milestone',
    link: 'https://www.instagram.com/careerwithbeni/',
  },
];

export type Certification = { issuer: string; name: string; link: string; status?: string };

export const certifications: Certification[] = [
  { issuer: 'Parent Company', name: 'Connecting Dots Worldwide — Australia & India', link: '#originals' },
  { issuer: 'Company 1', name: 'Career HQ — Admissions, MBBS, Placements, Loans & Scholarships', link: 'https://www.careerhq.in' },
  { issuer: 'Company 2', name: 'Industry Connect — Connecting Professionals, Industries & Opportunities', link: '#contact' },
  { issuer: 'Company 3', name: 'A T O M — The Journal Collection by Benita Samson', link: '#contact' },
  { issuer: 'Company 4', name: 'DNA — Digital Network and Advancement (Online Learning)', link: '#contact' },
  { issuer: 'Non-Profit Organisation', name: 'The Blind Spot — Community Welfare, Inclusion & Awareness', link: '#contact' },
  { issuer: 'Social Media 1', name: 'Career with Beni — 50,000+ Followers & 120+ Videos (Instagram)', link: 'https://www.instagram.com/careerwithbeni/' },
  { issuer: 'Social Media 2', name: 'Mic & Mentors — Upcoming YouTube Channel (Founders & CEOs)', link: '#instagram' },
  { issuer: 'Show on Mic & Mentors', name: 'Show: TRP - The Reality Project — Stories of Everyday Professions', link: '#instagram' },
];

export const teamMembers = [
  { name: 'Benita Samson', role: 'Founder & CEO' },
  { name: 'Gandhi', role: 'Founder & CEO' },
  { name: 'Vino', role: 'Team Member' },
  { name: 'Manimalan', role: 'Team Member' },
  { name: 'Sajitha', role: 'Team Member' },
  { name: 'Ashwini', role: 'Team Member' },
  { name: 'Malathi', role: 'Team Member' },
  { name: 'Agalya', role: 'Team Member' },
];

export const archiveChapters = [
  { title: 'Australia & banking career', detail: 'Professional portraits and selected memories from her banking years at NAB and CBA.' },
  { title: 'The entrepreneurial decision', detail: 'Personal photographs from her Australia chapter and move to India.' },
  { title: 'Hope Education & Migration', detail: 'Office photographs and early business memories in Madurai.' },
  { title: 'Education Expo', detail: 'Event photographs from Courtyard by Marriott, Madurai.' },
  { title: 'Bharath University & Career HQ', detail: 'Photographs from the introduction to Gandhi, expo and shared business journey.' },
  { title: 'Career with Beni', detail: 'Content creation, Instagram milestones and behind-the-scenes moments.' },
  { title: 'A T O M & personal milestones', detail: 'Journal photographs, celebrations and meaningful moments.' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'career-hq',
    title: 'Career HQ Pillars',
    subtitle: 'Six core areas of work',
    skills: [
      { name: 'Study in India', mono: 'IN', note: 'Core' },
      { name: 'Study Abroad', mono: 'AB' },
      { name: 'Training & Placement', mono: 'TP' },
      { name: 'MBBS Admissions', mono: 'MB' },
      { name: 'Education Loans', mono: 'EL' },
      { name: 'Scholarships', mono: 'SC' },
    ],
  },
  {
    id: 'media',
    title: 'Social Media & Shows',
    subtitle: 'Community & broadcast',
    skills: [
      { name: 'Career with Beni', mono: 'CB' },
      { name: 'Mic & Mentors', mono: 'MM' },
      { name: 'TRP - The Reality Project', mono: 'TR', note: 'Show' },
    ],
  },
  {
    id: 'ecosystem',
    title: 'Connecting Dots Worldwide',
    subtitle: 'Parent company & ventures',
    skills: [
      { name: 'Career HQ', mono: 'HQ' },
      { name: 'Industry Connect', mono: 'IC' },
      { name: 'A T O M', mono: 'AT' },
      { name: 'DNA', mono: 'DN' },
      { name: 'The Blind Spot', mono: 'BS', note: 'Non-Profit' },
    ],
  },
];

export const skillEvidence: Record<string, string[]> = {
  'Study in India': ['Career HQ', 'PickMyAdmission roots'],
  'Study Abroad': ['Career HQ', 'Hope Education & Migration', 'CareerBee Overseas Education'],
  'Career HQ': ['Existing flagship business', 'Admissions, placements & student loans'],
  'Industry Connect': ['Upcoming venture connecting professionals, industries & opportunities'],
  'A T O M': ['Upcoming publishing and journal venture by Benita Samson'],
  'DNA': ['Upcoming digital network and advancement online learning platform'],
  'Career with Beni': ['50,000+ Instagram followers', '120+ videos published'],
  'Mic & Mentors': ['Upcoming YouTube interview channel'],
  'TRP - The Reality Project': ['Upcoming show within Mic & Mentors YouTube channel'],
  'The Blind Spot': ['Non-profit organisation focused on welfare & inclusion'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Courage to Begin Again',
    period: 'Australia → Feb 2025',
    synopsis: 'Nearly a decade in banking at NAB and CBA before selling home and cars to start fresh in Madurai.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'Australian Banking Years',
        description: 'Built a successful career over nearly a decade with National Australia Bank (NAB) and final six months at Commonwealth Bank of Australia (CBA).',
        tags: ['NAB', 'CBA', 'Australia'],
        runtime: '~10 Years',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'Madurai Chapter',
        description: 'Brought the Hope Education & Migration franchise to Madurai in February 2025 with a founding team of four.',
        tags: ['Madurai', 'Team of 4'],
        runtime: 'Feb 2025',
        palette: crimson,
      },
    ],
  },
  {
    number: 2,
    title: 'The Birth of Career HQ',
    period: 'Oct 2025',
    synopsis: 'Meeting Gandhi at Bharath University and uniting complementary businesses under one shared brand.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'Two Journeys · One Brand',
        description: 'Created the Career HQ logo on 15 October 2025, combining international education with Indian admissions expertise.',
        tags: ['Bharath University', 'Education Expo'],
        runtime: '15 Oct 2025',
        palette: violet,
      },
    ],
  },
  {
    number: 3,
    title: 'Career with Beni & Media',
    period: 'Feb 2026 – Present',
    synopsis: 'Growing an Instagram community to 50,000+ followers and preparing Mic & Mentors + TRP.',
    episodes: [
      {
        code: 'S03 E01',
        title: '50,000+ Milestone',
        description: 'Launched on 12 February 2026 and reached 50,000+ followers with 120+ videos published in roughly six months.',
        tags: ['Instagram', '120+ Videos'],
        runtime: '12 Feb 2026',
        palette: ocean,
      },
    ],
  },
  {
    number: 4,
    title: 'Connecting Dots Worldwide',
    period: '2025 – Vision Ahead',
    synopsis: 'Parent company registered in Australia in 2025, expanding across education, publishing, media and social impact.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'Eight Today · Fifteen Ahead',
        description: 'Scaling Career HQ alongside Industry Connect, A T O M, DNA, and The Blind Spot.',
        tags: ['Australia & India', 'Ecosystem'],
        runtime: 'Team 8 → 15',
        palette: jade,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  {
    label: '2015',
    title: 'Sales & Trust',
    detail: 'Sales course & grassroots fundraising, building public trust',
    palette: amber,
  },
  {
    label: '2015 – 2025',
    title: 'NAB & CBA',
    detail: 'Nearly a decade in Australian banking before entrepreneurship',
    palette: ocean,
  },
  {
    label: 'Aus · 2024',
    title: 'Connecting Dots',
    detail: 'Connecting Dots Worldwide registered in Australia as parent company',
    palette: crimson,
  },
  {
    label: 'Feb 2025',
    title: 'Madurai Move',
    detail: 'Left Australia, sold home & cars, launched with team of 4',
    palette: violet,
  },
  {
    label: '20 Sept 2025',
    title: 'Hope Expo',
    detail: 'Education Expo at Courtyard by Marriott Madurai; the spark for Career HQ',
    palette: jade,
  },
  {
    label: '15 Oct 2025',
    title: 'Career HQ',
    detail: 'Brand launch uniting Indian & global admissions, MBBS, placements & loans',
    palette: crimson,
  },
  {
    label: '12 Feb 2026',
    title: 'Career with Beni',
    detail: 'Instagram brand scaled to 50,000+ followers & 120+ videos in ~6 months',
    palette: amber,
  },
  {
    label: 'Achievement',
    title: 'Admissions',
    detail: 'First major wave of university admissions and scholarship placements',
    palette: ocean,
  },
  {
    label: 'Jan 2027',
    title: 'Mic & Mentors',
    detail: 'Upcoming YouTube channel featuring founders, CEOs & industry leaders',
    palette: violet,
  },
  {
    label: 'Jan 2027',
    title: 'TRP Show',
    detail: 'TRP - The Reality Project: documentary show of everyday professions',
    palette: crimson,
  },
  {
    label: 'March 2027',
    title: 'A T O M',
    detail: 'A T O M – The Journal Collection: publishing venture by Benita Samson',
    palette: amber,
  },
  {
    label: 'August 2027',
    title: 'Industry Connect',
    detail: 'Professional bridge linking student talent directly with hiring industries',
    palette: ocean,
  },
  {
    label: 'Nov 2027',
    title: 'The Blind Spot',
    detail: 'Non-profit organisation for community welfare & inclusion',
    palette: violet,
  },
  {
    label: 'Jan 2028',
    title: 'DNA',
    detail: 'DNA platform: scalable online education & learning tracks',
    palette: jade,
  },
  {
    label: 'Vision Ahead',
    title: 'Brain Loading',
    detail: 'Next big horizons on process — team scaling from 8 to 15 and beyond',
    palette: crimson,
  },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'The Courage to Begin Again',
    title: 'Banking → Founder',
    lines: [
      'Nearly a decade at National Australia Bank (NAB) & CBA in Australia',
      'Sold home and cars and brought Hope Education & Migration to Madurai in Feb 2025',
    ],
    chips: ['Australia', 'Madurai', 'Team of 4'],
  },
  {
    kicker: 'Two Journeys · One Shared Brand',
    title: 'Career HQ',
    lines: [
      'Founded after meeting at Bharath University — Logo created 15 October 2025',
      'Study in India · Study Abroad · Training & Placement · MBBS · Loans · Scholarships',
    ],
    chips: ['Study in India', 'Study Abroad', 'MBBS', 'Placements', 'Loans', 'Scholarships'],
  },
  {
    kicker: 'Personal Brand Milestone',
    title: '50,000+ Followers',
    lines: [
      'Career with Beni launched on Instagram on 12 February 2026',
      '120+ videos published within approximately six months',
    ],
  },
  {
    kicker: 'Social Media & Shows',
    title: 'Mic & Mentors · TRP',
    lines: [
      'Upcoming YouTube channel featuring founders, CEOs & industry experts',
      'Show: TRP - The Reality Project — documentary stories of everyday professions',
    ],
  },
  {
    kicker: 'The Wider Ecosystem',
    title: 'Connecting Dots Worldwide',
    lines: [
      'Parent company registered in Australia in 2025 · Building India operations under one parent identity',
      '4 Companies: Career HQ · Industry Connect · A T O M · DNA',
      'Non-profit organisation: The Blind Spot',
    ],
  },
  {
    kicker: 'Leadership & Tribute',
    title: '8 Today · 15 Ahead',
    lines: [
      'Benita Samson & Gandhi leading Vino, Manimalan, Sajitha, Ashwini, Malathi & Agalya',
      'Happy Birthday, Benita Samson — The Journey Continues',
    ],
  },
];

export type ProfileId = 'benita' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
    {
      id: 'benita',
      name: 'Benita Samson',
      blurb: 'The full founder journey, in order',
      color: '#e5132b',
      order: ['about', 'moments', 'picks', 'originals', 'story'],
    },
    {
      id: 'recruiter',
      name: 'Partners',
      blurb: 'Dossier, ventures & leadership first',
      color: '#4cc9ff',
      order: ['story', 'moments', /* 'skills', */ 'originals', 'about', /* 'journey', */ 'picks'],
    },
    {
      id: 'developer',
      name: 'Students',
      blurb: 'Career HQ, services & milestones first',
      color: '#46e3a8',
      order: ['originals', /* 'skills', 'journey', */ 'moments', 'about', 'picks', 'story'],
    },
    {
      id: 'creative',
      name: 'Media',
      blurb: 'Career with Beni, Mic & Mentors & TRP - The Reality Project',
      color: '#ffb547',
      order: [/* 'journey', */ 'picks', 'originals', 'moments', 'about', /* 'skills', */ 'story'],
    },
  ];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'Founder', card: 'Founder Story', meta: 'The Woman Beyond the Vision', palette: violet },
  journey: { nav: 'Journey', card: 'Her Journey', meta: `${seasons.length} Chapters`, palette: amber },
  originals: { nav: 'Ventures', card: 'Ventures', meta: `${projects.length} Flagship Pillars`, palette: crimson },
  picks: { nav: 'Milestones', card: 'Top 15 Milestones', meta: '15 Defining Milestones', palette: jade },
  skills: { nav: 'Pillars', card: 'Focus Areas', meta: `${skillCategories.length} Domains`, palette: ocean },
  moments: { nav: 'Impact', card: 'Impact & Team', meta: `8 → 15 Team • Milestones`, palette: crimson },
  story: { nav: 'Full Story', card: 'The Full Story', meta: 'Founder Profile & Tribute', palette: violet },
};

export type VideoReel = {
  id: string;
  episode: string;
  title: string;
  meta: string;
  kind?: 'video' | 'image';
  videoUrl: string;
  posterUrl: string;
  previewUrl: string;
  palette: Palette;
};

const REEL_1 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385103/Learn_what_lasts_not_what_is_popular_BENITA.mp4';
const REEL_2 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385103/benita_2_secret_AI_tool.mp4';
const REEL_3 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385115/ranking_for_common_study_method_BENITA.mp4';
const REEL_4 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385124/Benita_If_you_don_t_want_your_son_to_struggle_in_future_teach_these_things.mp4';
const REEL_5 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794484482/savefromins.com_Your_goals_need_your_attention_not_endless_scrolling.__Less_distraction_more_direction.___StayFocused_PersonalGrowth_DigitalDetox_LifeLessons_Benita_0_1080P.mp4';
const REEL_6 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794484472/savefromins.com_Does_your_child_ask_endless_questions___That_curiosity_can_be_a_sign_of_active_learning_an..._and_creative_ways_of_explaining_ideas_too.___ChildDevelopment_ParentingTips_ChildPsychology_SmartKids_Benita_0_1080P.mp4';
const REEL_7 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794484469/savefromins.com_Today_s_teens_aren_t_just_studying_they_re_carrying_pressure_from_every_direction.___..._mental_load_your_child_is_carrying._%EF%B8%8F___StudyPressure_TeenMentalHealth_ParentingTips_StudentLife_Benita_0_1080P.mp4';
const REEL_8 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794484466/savefromins.com_3_ChatGPT_prompts_every_student_should_know__Revise_faster_understand_tough_topics_a..._smarter.___Comment_PROMPT_and_I_ll_DM_you_all_3____ChatGPTTips_StudyHacks_ExamPreparation_AITools_Benita_0_1080P.mp4';
const REEL_9 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794484465/savefromins.com_Make_your_resume_sound_more_professional_with_powerful_action_words.___Comment_RESUME_to_get_more_word_suggestions____ResumeTips_CareerGuidance_JobSearch_Freshers_Benita_0_1080P.mp4';

const makeReel = (
  index: number,
  videoUrl: string,
  title: string,
  meta: string,
  palette: Palette,
): VideoReel => ({
  id: `reel-${index}`,
  episode: `Episode ${String(index).padStart(2, '0')}`,
  title,
  meta,
  videoUrl,
  posterUrl: videoUrl
    .replace('/video/upload/', '/video/upload/so_1,f_jpg,q_auto,w_720/')
    .replace(/\.mp4$/, '.jpg'),
  previewUrl: videoUrl.replace('/video/upload/', '/video/upload/q_auto,w_480/'),
  palette,
});

export const videoReels: VideoReel[] = [
  makeReel(1, REEL_1, 'Learn What Lasts', 'Reel • 9:16 Vertical', violet),
  makeReel(2, REEL_2, 'Secret AI Tool', 'Reel • AI Showcase', crimson),
  makeReel(3, REEL_3, 'Study Method Ranking', 'Reel • Retention Cut', amber),
  makeReel(4, REEL_4, 'Future-Ready Skills', 'Reel • Storytelling', ocean),
  makeReel(5, REEL_5, 'Less Distraction, More Direction', 'Reel • Focus & Growth', jade),
  makeReel(6, REEL_6, 'Curiosity & Active Learning', 'Reel • Child Psychology', crimson),
  makeReel(7, REEL_7, 'Understanding Teen Pressure', 'Reel • Student Life', violet),
  makeReel(8, REEL_8, '3 ChatGPT Prompts for Students', 'Reel • AI Study Hacks', amber),
  makeReel(9, REEL_9, 'Resume Action Words', 'Reel • Career Guidance', ocean),
];

const makeFrame = (
  index: number,
  imageUrl: string,
  title: string,
  meta: string,
  palette: Palette,
): VideoReel => ({
  id: `archive-${index}`,
  episode: `Frame ${String(index).padStart(2, '0')}`,
  title,
  meta,
  kind: 'image',
  videoUrl: imageUrl,
  posterUrl: imageUrl,
  previewUrl: imageUrl,
  palette,
});

export const archiveMedia: VideoReel[] = [
  makeFrame(1, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459419/DSC03841.jpg', 'The Journey in Frames', 'Portrait Archive · 01', crimson),
  makeFrame(2, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459419/DSC03843.jpg', 'Founder Moments', 'Portrait Archive · 02', violet),
  makeFrame(3, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459419/DSC03861.jpg', 'Behind the Vision', 'Portrait Archive · 03', amber),
  makeFrame(4, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459418/DSC03852.jpg', 'Milestone Frames', 'Portrait Archive · 04', ocean),
  makeFrame(5, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459418/DSC03850.jpg', 'Beyond the Familiar', 'Portrait Archive · 05', jade),
  { ...makeReel(6, REEL_4, 'Future-Ready Skills', 'Video Reel · 06', ocean), id: 'archive-6', kind: 'video' },
  { ...makeReel(7, REEL_3, 'Study Method Ranking', 'Video Reel · 07', amber), id: 'archive-7', kind: 'video' },
  { ...makeReel(8, REEL_1, 'Learn What Lasts', 'Video Reel · 08', violet), id: 'archive-8', kind: 'video' },
];

export const founderStory = {
  herStory: {
    kicker: 'HER STORY',
    title: 'The Courage to Begin Again',
    paragraphs: [
      'Not born into a business family, Benita Samson spent nearly a decade in Australian banking at National Australia Bank (NAB) and Commonwealth Bank of Australia (CBA) — while nurturing a five-year dream to build something of her own.',
      'Driven by conviction, she walked away from an established career, sold her home and cars in Australia, and moved to India to pursue entrepreneurship.',
      'In February 2025, she brought the Hope Education & Migration franchise to Madurai, spending six months mastering the Indian admission ecosystem and laying the groundwork with a founding team of four.',
    ],
  },
  visionFoundation: {
    kicker: 'THE FOUNDATION BEHIND BENITA SAMSON’S VISION',
    subtitle: 'How corporate systems, sales and grassroots fundraising shaped a purpose-led vision',
    pillars: [
      {
        title: 'Experience-Led Foundation',
        body: 'Unites corporate discipline, technology exposure, sales, and marketing with a deep commitment to social impact.',
      },
      {
        title: 'Corporate & Tech Exposure (Salesforce)',
        body: 'Built structured CRM, sales pipeline, marketing, and technology-enabled operations expertise during her time at Salesforce.',
      },
      {
        title: 'Fundraising & Human Connection',
        body: 'Travelled and engaged communities face-to-face for fundraising causes — building public trust and firsthand insight into social realities.',
      },
      {
        title: 'The Inspiration Behind The Blind Spot',
        body: 'Combined business growth systems with empathy to create The Blind Spot — bringing overlooked people, unheard stories, and ignored realities into focus.',
      },
    ],
    quote:
      'Business knowledge can build organisations. When combined with empathy and purpose, it can help create meaningful social impact.',
  },
};
