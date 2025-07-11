// gitprofile.config.js

const config = {
  github: {
    username: 'hardik88t', // Your GitHub org/user name. (Required)
    sortBy: 'updated', // stars | updated
    limit: 5, // How many projects to display.
    exclude: {
      forks: false, // Forked projects will not be displayed if set to true.
      projects: [hardik88t.github.io, hardik88t, sarvsevak, rustimg], // These projects will not be displayed. example: ['my-project1', 'my-project2']
    },
  },
  social: {
    linkedin: 'hardik88t',
    // twitter: 'hardik88t',
    // mastodon: '',
    // facebook: 'hardik88t',
    // instagram: 'hardik.88t',
    // dribbble: '',
    // behance: '',
    // medium: 'hardik88t',
    // dev: 'hardik88t',
    // stackoverflow: '17916979/hardik88t', // format: userid/username
    // skype: '',
    // telegram: '',
    website: 'https://hardik88t.cv',
    // phone: '',
    email: 'hardik88t@gmail.com',
  },
  resume: {
    fileUrl:
      '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Python',
    'JavaScript',
    'Figma',
    'React.js',
    'Node.js',
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
  ],
  experiences: [
    {
      company: 'Rapidops Inc.',
      position: 'Jr. Software Developer',
      from: 'July 2025',
      to: 'Present',
      companyLink: 'https://rapidops.com',
    }, {
      company: 'Rapidops Inc.',
      position: 'Software Developer Intern',
      from: 'January 2024',
      to: 'July 2024',
      companyLink: 'https://rapidops.com',
    }, {
      company: 'Freelancer.com',
      position: 'Freelancer',
      from: 'November 2021',
      to: 'Present',
      companyLink: 'https://freelancer.com',
    },
  ],
  education: [
    {
      institution: 'DDIT, Nadiad',
      degree: 'B.Tech.',
      from: '2019',
      to: '2024',
    },
  ],

  // To hide the `My Projects` section, keep it empty.
  externalProjects: [

  ],
  // Display blog posts from your medium or dev account. (Optional)
  // blog: {
  //   source: 'dev', // medium | dev
  //   username: 'hardik88t', // to hide blog section, keep it empty
  //   limit: 2, // How many posts to display. Max is 10.
  // },
  // googleAnalytics: {
  //   id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  // },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: {
    id: '3451091',
    snippetVersion: 6,
  },
  themeConfig: {
    defaultTheme: 'dark',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Hide the ring in Profile picture
    hideAvatarRing: false,

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
      'procyon',
    ],

    // Custom theme
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Copyright © 2025 <a 
      class="text-primary" href="https://github.com/hardik88t"
      target="_blank"
      rel="noreferrer"
    >hardik88t</a>`,
};

export default config;
