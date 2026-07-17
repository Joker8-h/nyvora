import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Nexora',
  description: 'Nexora OS - Business Operating System AI-First',
  base: '/docs/',
  ignoreDeadLinks: true,
  
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Nexora Docs',
    
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guía', link: '/guide/' },
      { text: 'Arquitectura', link: '/architecture/' },
      { text: 'Desarrollo', link: '/development/' },
      { text: 'API', link: '/api/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introducción',
          items: [
            { text: '¿Qué es Nexora?', link: '/guide/' },
            { text: 'Inicio Rápido', link: '/guide/getting-started' },
            { text: 'Conceptos Clave', link: '/guide/concepts' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Arquitectura',
          items: [
            { text: 'Visión General', link: '/architecture/' },
            { text: 'Decisiones de Arquitectura (ADR)', link: '/architecture/adr/' },
          ],
        },
      ],
      '/development/': [
        {
          text: 'Desarrollo',
          items: [
            { text: 'Primeros Pasos', link: '/development/getting-started' },
            { text: 'Estándares de Código', link: '/development/coding-standards' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nexora' },
    ],

    footer: {
      message: 'Nexora OS - Business Operating System AI-First',
      copyright: '© 2026 Nexora',
    },

    search: {
      provider: 'local',
    },
  },
});
