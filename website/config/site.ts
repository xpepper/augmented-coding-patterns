export const siteConfig = {
  name: 'Augmented Coding Patterns',
  description: 'A collection of emerging patterns, anti-patterns, and obstacles for effective AI-augmented software development',
  author: {
    name: 'Lada Kesseler',
    github: 'lexler'
  },
  repository: {
    owner: 'lexler',
    name: 'augmented-coding-patterns',
    url: 'https://github.com/lexler/augmented-coding-patterns'
  },
  links: {
    github: 'https://github.com/lexler/augmented-coding-patterns'
  }
} as const

export type SiteConfig = typeof siteConfig
