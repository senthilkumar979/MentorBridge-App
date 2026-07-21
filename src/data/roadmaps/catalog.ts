export const ROADMAP_CATALOG = [
  {
    slug: 'react',
    title: 'React',
    description: 'Modern React fundamentals through advanced patterns',
    nodes: [
      { id: 'r1', title: 'JSX & Components', summary: 'Build UI with components and props' },
      { id: 'r2', title: 'Hooks', summary: 'useState, useEffect, custom hooks' },
      { id: 'r3', title: 'Data fetching', summary: 'TanStack Query and caching' },
    ],
  },
  {
    slug: 'typescript',
    title: 'TypeScript',
    description: 'Type-safe JavaScript for production apps',
    nodes: [
      { id: 't1', title: 'Basics', summary: 'Types, interfaces, unions' },
      { id: 't2', title: 'Generics', summary: 'Reusable typed APIs' },
    ],
  },
  {
    slug: 'java',
    title: 'Java',
    description: 'Backend foundations with Java',
    nodes: [
      { id: 'j1', title: 'OOP', summary: 'Classes, inheritance, interfaces' },
      { id: 'j2', title: 'Spring intro', summary: 'REST controllers and DI' },
    ],
  },
] as const
