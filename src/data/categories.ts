import { CategoryMeta, TechCategory } from '../types/article';

export const TECH_CATEGORIES: CategoryMeta[] = [
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Frontier AI foundation models, reasoning architectures, alignment, and agentic workflows.',
    color: '#3b82f6', // blue
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400',
    iconName: 'Cpu'
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'Algorithms, deep learning research, dataset curation, diffusion models, and RLHF.',
    color: '#8b5cf6', // purple
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-400',
    iconName: 'Brain'
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Threat intelligence, zero-day vulnerabilities, cryptography, and zero-trust security postures.',
    color: '#ef4444', // red
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/30',
    badgeText: 'text-red-400',
    iconName: 'ShieldAlert'
  },
  {
    name: 'Robotics',
    slug: 'robotics',
    description: 'Autonomous systems, humanoid mechanics, computer vision, and industrial automation.',
    color: '#f97316', // orange
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    iconName: 'Bot'
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Hyperscale infrastructure, Kubernetes orchestration, serverless runtimes, and distributed storage.',
    color: '#06b6d4', // cyan
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400',
    iconName: 'Cloud'
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern frontends, browser APIs, ECMAScript standards, edge rendering, and web performance.',
    color: '#10b981', // emerald
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400',
    iconName: 'Globe'
  },
  {
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'Architecture patterns, compiler design, concurrency models, refactoring, and code hygiene.',
    color: '#6366f1', // indigo
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-400',
    iconName: 'Code2'
  },
  {
    name: 'Semiconductors',
    slug: 'semiconductors',
    description: 'Silicon lithography, gate-all-around FETs, neural processing units (NPUs), and chiplet interconnects.',
    color: '#eab308', // amber
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    iconName: 'Microchip'
  },
  {
    name: 'Startups',
    slug: 'startups',
    description: 'Venture funding, disruptive products, product-market fit, and tech entrepreneurship.',
    color: '#ec4899', // pink
    badgeBg: 'bg-pink-500/10',
    badgeBorder: 'border-pink-500/30',
    badgeText: 'text-pink-400',
    iconName: 'Rocket'
  },
  {
    name: 'Technology Research',
    slug: 'technology-research',
    description: 'Peer-reviewed academic breakthroughs, quantum experiments, photonics, and theoretical computer science.',
    color: '#14b8a6', // teal
    badgeBg: 'bg-teal-500/10',
    badgeBorder: 'border-teal-500/30',
    badgeText: 'text-teal-400',
    iconName: 'FlaskConical'
  },
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'IDEs, debuggers, CI/CD pipelines, package managers, and observability platforms.',
    color: '#84cc16', // lime
    badgeBg: 'bg-lime-500/10',
    badgeBorder: 'border-lime-500/30',
    badgeText: 'text-lime-400',
    iconName: 'Wrench'
  },
  {
    name: 'Emerging Technology',
    slug: 'emerging-technology',
    description: 'Neuromorphic computing, brain-computer interfaces, spatial computing, and ambient telemetry.',
    color: '#a855f7', // purple-violet
    badgeBg: 'bg-purple-600/10',
    badgeBorder: 'border-purple-600/30',
    badgeText: 'text-purple-300',
    iconName: 'Sparkles'
  }
];

export const CATEGORY_NAMES: TechCategory[] = TECH_CATEGORIES.map(c => c.name);

export function getCategoryMeta(categoryName: string): CategoryMeta {
  const match = TECH_CATEGORIES.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  return match || {
    name: 'Emerging Technology',
    slug: 'emerging-technology',
    description: 'General technology intelligence.',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400',
    iconName: 'Layers'
  };
}
