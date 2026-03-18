// Design Tokens
export const COLORS = {
  primary: '#9f81b9',
  primaryLight: '#b8a0d0',
  primaryDark: '#7a5f94',
  secondary: '#4fc3f7',
  secondaryDark: '#3ba8d8',
  accent: '#ffd700',
  accentSoft: '#fff8dc',
  background: '#ffffff',
  surface: 'rgba(255, 255, 255, 0.1)',
  glass: 'rgba(255, 255, 255, 0.15)',
  text: '#1a1a1a',
  textMuted: '#666666',
  textLight: '#999999',
  border: 'rgba(159, 129, 185, 0.2)',
};

// Animation Durations
export const DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 1,
  slower: 1.5,
  slowest: 2,
};

// Animation Easings
export const EASINGS = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.5)',
  dramatic: 'power4.inOut',
  snappy: 'power3.out',
};

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Section IDs for navigation
export const SECTIONS = {
  hero: 'hero',
  transformation: 'transformation',
  mission: 'mission',
  leadership: 'leadership',
  architecture: 'architecture',
  transparency: 'transparency',
  impact: 'impact',
  gallery: 'gallery',
  cta: 'cta',
};

// Navigation Links
export const NAV_LINKS = [
  { label: 'Mission', href: `#${SECTIONS.mission}`, icon: 'Target' },
  { label: 'Leadership', href: `#${SECTIONS.leadership}`, icon: 'Users' },
  { label: 'Architecture', href: `#${SECTIONS.architecture}`, icon: 'Layout' },
  { label: 'Impact', href: `#${SECTIONS.impact}`, icon: 'BarChart' },
  { label: 'Join', href: `#${SECTIONS.cta}`, icon: 'Rocket' },
];

// Mission Cards Data
export const MISSION_CARDS = [
  {
    id: 1,
    title: 'Leadership Systems',
    description: 'Cultivating visionary governance that drives sustainable transformation across the continent.',
    icon: 'Crown',
    color: COLORS.primary,
  },
  {
    id: 2,
    title: 'Infrastructure Development',
    description: 'Building the physical and digital backbone that connects nations and empowers communities.',
    icon: 'Building2',
    color: COLORS.secondary,
  },
  {
    id: 3,
    title: 'Economic Enablement',
    description: 'Unlocking trade, innovation, and entrepreneurship to create prosperous economies.',
    icon: 'TrendingUp',
    color: COLORS.accent,
  },
  {
    id: 4,
    title: 'Education Advancement',
    description: 'Powering the next generation with knowledge, skills, and opportunities for growth.',
    icon: 'BookOpen',
    color: COLORS.primaryLight,
  },
];

// Leadership Data
export const LEADERSHIP_TEAM = [
  {
    id: 1,
    name: 'Lucah TGD',
    role: 'Executive Director',
    bio: 'Visionary leader with 20+ years in continental development.',
    image: '/assets/Leader ship/LUCAH TGD.jpg',
  },
  {
    id: 2,
    name: 'Rena Champ',
    role: 'Chief Strategist',
    bio: 'Expert in infrastructure planning and policy implementation.',
    image: '/assets/Leader ship/Rena Champ.jpg',
  },
  {
    id: 3,
    name: 'TGD',
    role: 'Operations Lead',
    bio: 'Driving operational excellence across 54 nations.',
    image: '/assets/Leader ship/TGD.png',
  },
];

// Architecture Cards Data
export const ARCHITECTURE_CARDS = [
  {
    id: 1,
    title: 'Governance Framework',
    description: 'Transparent, accountable systems that ensure resources reach their intended destinations.',
    icon: 'Shield',
    features: ['Policy Alignment', 'Regulatory Compliance', 'Ethical Standards'],
  },
  {
    id: 2,
    title: 'Infrastructure Planning',
    description: 'Strategic development of transportation, energy, and digital networks.',
    icon: 'Map',
    features: ['Smart Cities', 'Energy Grids', 'Digital Highways'],
  },
  {
    id: 3,
    title: 'Collaboration Systems',
    description: 'Platforms that unite governments, businesses, and communities.',
    icon: 'Users',
    features: ['Public-Private Partnerships', 'Cross-Border Initiatives', 'Community Engagement'],
  },
];

// Transparency Hub Data
export const TRANSPARENCY_METRICS = [
  {
    id: 1,
    label: 'Project Completion',
    value: 85,
    target: 100,
    unit: '%',
  },
  {
    id: 2,
    label: 'Budget Efficiency',
    value: 92,
    target: 100,
    unit: '%',
  },
  {
    id: 3,
    label: 'Active Partners',
    value: 45,
    target: 60,
    unit: '',
  },
  {
    id: 4,
    label: 'Countries Engaged',
    value: 54,
    target: 54,
    unit: '',
  },
];

// Impact Stats Data
export const IMPACT_STATS = [
  {
    id: 1,
    value: 50,
    suffix: 'B',
    prefix: '$',
    label: 'Infrastructure Investment',
    description: 'Committed to transformative projects',
  },
  {
    id: 2,
    value: 100,
    suffix: 'M+',
    prefix: '',
    label: 'Lives Impacted',
    description: 'People benefiting from our initiatives',
  },
  {
    id: 3,
    value: 54,
    suffix: '',
    prefix: '',
    label: 'Nations Engaged',
    description: 'Countries actively participating',
  },
];

// Gallery Data
export const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'Cities',
    title: 'Smart Urban Development',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    category: 'Innovation',
    title: 'Technology Hubs',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    category: 'Community',
    title: 'Empowered Communities',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    category: 'Infrastructure',
    title: 'Modern Transportation',
    image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    category: 'Cities',
    title: 'Sustainable Architecture',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    category: 'Innovation',
    title: 'Research Centers',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
  },
];

// CTA Buttons Data
export const CTA_BUTTONS = [
  {
    id: 1,
    label: 'Join Movement',
    variant: 'primary',
    href: '#join',
  },
  {
    id: 2,
    label: 'Partner With Us',
    variant: 'secondary',
    href: '#partner',
  },
  {
    id: 3,
    label: 'Donate',
    variant: 'outline',
    href: '#donate',
  },
];

// Three.js Configuration
export const THREE_CONFIG = {
  nodeCount: {
    desktop: 500,
    mobile: 100,
  },
  connectionDistance: 0.15,
  particleSize: 0.02,
  colors: {
    node: COLORS.primary,
    nodeConnected: COLORS.secondary,
    line: COLORS.primary,
    glow: COLORS.primary,
  },
};

// Performance Settings
export const PERFORMANCE = {
  frameRate: 60,
  particleReduction: {
    mobile: 0.2,
    tablet: 0.5,
  },
  disableAnimations: {
    lowPower: true,
    reducedMotion: true,
  },
};

export default {
  COLORS,
  DURATIONS,
  EASINGS,
  BREAKPOINTS,
  SECTIONS,
  NAV_LINKS,
  MISSION_CARDS,
  LEADERSHIP_TEAM,
  ARCHITECTURE_CARDS,
  TRANSPARENCY_METRICS,
  IMPACT_STATS,
  GALLERY_ITEMS,
  CTA_BUTTONS,
  THREE_CONFIG,
  PERFORMANCE,
};
