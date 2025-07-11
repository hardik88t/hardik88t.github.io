// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'hardik88t', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'updated', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: [
            'hardik88t/hardik88t.github.io',
            'hardik88t/hardik88t',
            'hardik88t/sarvsevak',
            'hardik88t/rustimg',
          ], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['hardik88t/rapid', 'hardik88t/solTrace'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Works',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Avinya Website',
          description: 'Simple Static Business Showcase website made with React',
          imageUrl: '',
          //   'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          link: 'https://avinya.co.in',
        },
        {
          title: 'Anvika Dashboard',
          description:
            'A Admin & Client Dashboard Webapp made with NexJS, Figma, ShadCN.',
          imageUrl: '',
          // 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
          link: 'https://anvika.vercel.app',
        },
      ],
    },
  },
  seo: {
    title: 'Portfolio of Hardik Thant',
    description:
      'Portfolio a Full-Stack Developer, Freelance, Computer Engineer.',
    imageURL: '',
  },
  social: {
    linkedin: 'hardik88t',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    website: 'https://hardik88t.cv',
    phone: '',
    email: 'hardik88t@gmail.com',
  },
  resume: {
    fileUrl: '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Python',
    'JavaScript',
    'Figma',
    'React.js',
    'Node.js',
    'Next.js',
    'PostgreSQL',
    'Tailwind',
    'Bootstrap',
    'C',
    'Java',
    'MySQL',
    'MongoDB',
    'CSS',
    'HTML',
    'Latex',
    'Git',
    'GitHub',
    'Docker',
    'Flask',
    '.NET Core',
    'Spring Boot',
    'Antd',
    'ShadCN',
  ],
  experiences: [
    {
      company: 'Rapidops Inc.',
      position: 'Jr. Software Developer',
      from: 'July 2025',
      to: 'Present',
      companyLink: 'https://rapidops.com',
    },
    {
      company: 'Rapidops Inc.',
      position: 'Software Developer Intern',
      from: 'January 2024',
      to: 'July 2024',
      companyLink: 'https://rapidops.com',
    },
    {
      company: 'Freelancer.com',
      position: 'Freelancer',
      from: 'November 2021',
      to: 'Present',
      companyLink: 'https://freelancer.com',
    },
  ],
  certifications: [],
  education: [
    {
      institution: 'DDIT, Nadiad',
      degree: 'B.Tech.',
      from: '2019',
      to: '2024',
    },
  ],
  publications: [],
  // Display articles from your medium or dev account. (Optional)
  blog: {},
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '3451091', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'dark',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'silk',
      'procyon',
    ],
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Copyright © 2025 <a 
      class="text-primary" href="https://github.com/hardik88t"
      target="_blank"
      rel="noreferrer"
    >hardik88t</a>`,

  enablePWA: true,
};

export default CONFIG;
