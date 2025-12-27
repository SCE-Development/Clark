const projects = [
  {
    link: 'https://github.com/SCE-Development/sign2',
    name: 'Sign2',
    subnote: 'such a success that we made a second sign!',
    information: ['Python', 'Hardware', 'Display'],
    caption: 'Sign up for our leetcode leaderboard and see your name in the top 10, in the room! The leetcode leaderboard is also available at (866) 975-0444 press 3!'
  },
  {
    link: 'https://github.com/SCE-Development/sarah',
    name: 'Sarah',
    subnote: 's!ping',
    information: ['Node.js', 'Discord.js'],
    caption: 'The official SCE Discord bot. join us at https://sce.sjsu.edu/s/discord and use s!help'
  },
  {
    link: 'https://github.com/SCE-Development/git-workshop',
    name: 'Git Workshop',
    subnote: 'ITS A BANGER. AND I KNOW BANGERS',
    information: ['Documentation', 'Markdown', 'Git'],
    caption: 'the tutorial all sce dev members follow to learn git, check it out here! https://sce.sjsu.edu/recipe'
  },
  {
    link: 'https://github.com/SCE-Development/monitoring',
    name: 'Monitoring',
    subnote: 'site reliability comes to sjsu',
    information: ['Prometheus', 'Grafana', 'Docker'],
    caption: 'our infrastructure for monitoring SCE services, YouTube tutorials included!'
  },
  {
    link: 'https://github.com/SCE-Development/Quasar',
    name: 'Quasar',
    subnote: 'HP Laserjet P2015dn (those who know)',
    information: ['Full Stack', 'Docker', 'Infrastructure'],
    caption: 'Our internal system for managing printing services and quotas for club members.'
  },
  {
    link: 'https://github.com/SCE-Development/Clark',
    name: 'Clark',
    subnote: 'previously known as Core-v4!',
    information: ['React', 'Express.js', 'MongoDB'],
    caption: 'Club website handling printing services and officer device controls.'
  },
  {
    link: 'https://github.com/SCE-Development/delen',
    name: 'Delen',
    subnote: 'Oh you like music? name every song',
    information: ['IoT', 'Speaker', 'Music'],
    caption: 'our speaker project for music in the room'
  },
  {
    link: 'https://github.com/SCE-Development/rpi-led-controller',
    name: 'SCE LED Display',
    subnote: 'The classic SCE LED sign',
    information: ['REST APIs', 'Hardware Interfacing'],
    caption: 'Illuminated sign designed by interns for the clubroom atmosphere.'
  },
  {
    link: 'https://github.com/SCE-Development/SCEta',
    name: 'SCEta Transit',
    subnote: 'https://sce.sjsu.edu/transit',
    information: ['Full Stack', 'Real-time'],
    caption: 'Provides real-time bus, Caltrain, and BART timing predictions.'
  },
  {
    link: 'https://github.com/SCE-Development/Clark',
    name: 'SCE Chatroom',
    subnote: 'real chat, real time',
    information: ['Real chat', 'Real time'],
    caption: 'Web application allowing members to communicate with each other on the website. Make an account and try it out!'
  },
  {
    link: 'https://github.com/SCE-Development/cleezy',
    name: 'Cleezy',
    subnote: 'https://sce.sjsu.edu/s/bladee',
    information: ['URL Shortening', 'FastAPI'],
    caption: 'A simple URL shortening service created by SCE.'
  },
];

export default function ProjectsPage() {

  const themeClasses = {
    bg: 'bg-[#f8f8f8] dark:bg-[#1d1f21]',
    text: 'text-[#333333] dark:text-[#c9cacc]',

    accent: 'text-[#008080] dark:text-[#2bbc8a]',
    accentLinkHover: 'hover:text-[#006666] dark:hover:text-[#4bdc9c]', // Added hover state for links

    muted: 'text-[#666666] dark:text-[#908d8d]',

    captionText: 'text-[#006666] dark:text-[#8abeb7]',

    subnoteText: 'text-sm italic', // The rest of the muted class is applied later

    hoverBg: 'hover:bg-[#eeeeee] dark:hover:bg-[#323539]',

    hrBorder: 'border-[#666] dark:border-[#ccc]',

    tagText: 'text-[#008080] dark:text-[#2bbc8a]',
    tagBg: 'bg-teal-50 dark:bg-green-950/20',
    tagBorder: 'border-[#008080] dark:border-[#2bbc8a]',
  };

  const baseStyle = {
    fontFamily: '"Menlo", "Meslo LG", monospace',
  };

  /**
   * Component to parse the caption string and replace URLs with clickable, highlighted links.
   * NOTE: Using a custom loop/exec logic to safely handle link parsing without invalid split() behavior.
   */
  const CaptionWithLinks = ({ text, containerClasses, accentClasses }) => {
    const urlRegex = /(\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+\b)/g;
    let lastIndex = 0;
    const parts = [];

    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      // 1. Preceding text
      const nonLinkText = text.substring(lastIndex, match.index);
      if (nonLinkText) {
        parts.push({ type: 'text', content: nonLinkText });
      }

      // 2. The link itself
      const linkContent = match[0];
      const url = linkContent.startsWith('http') ? linkContent : `https://${linkContent}`;

      parts.push({ type: 'link', content: linkContent, url: url });

      // 3. Update index
      lastIndex = urlRegex.lastIndex;
    }

    // 4. Remaining text
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText });
    }

    return (
      <span className={containerClasses} style={baseStyle}>
        {parts.map((part, index) => {
          if (part.type === 'link') {
            return (
              <a
                key={index}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-150 ${accentClasses}`}
                style={{ textDecoration: 'underline' }}
                onClick={(e) => e.stopPropagation()}
              >
                {part.content}
              </a>
            );
          }
          return <span key={index}>{part.content}</span>;
        })}
      </span>
    );
  };


  const ProjectListItem = ({ link, name, subnote, information, caption }) => {

    const handleRowClick = () => {
      window.open(link, '_blank');
    };

    return (
      <li className="mb-2 list-none">
        <div>
          <div className="flex flex-col md:flex-row md:items-start justify-between">
            <div className="flex-grow mb-1 md:mb-0">
              <span className={`text-lg font-bold tracking-tight ${themeClasses.text} block`}>{name}</span>

              {subnote && (
                <span className={`block ${themeClasses.muted} ml-0`}>
                  <CaptionWithLinks
                    text={subnote}
                    containerClasses={themeClasses.subnoteText}
                    accentClasses={themeClasses.accent}
                  />
                </span>
              )}
            </div>

            <div className={'hidden md:block flex-shrink-0 mt-2 md:mt-0 md:ml-4 flex flex-wrap gap-2'}>
              {information.map(tag => (
                <span key={tag} className={`text-xs ml-1 font-mono px-2 py-0.5 rounded border ${themeClasses.tagText} ${themeClasses.tagBg} ${themeClasses.tagBorder}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className={`mt-1 text-sm ${themeClasses.muted}`}>
            <CaptionWithLinks
              text={caption}
              containerClasses={themeClasses.captionText}
              accentClasses={themeClasses.accent}
            />
            <br />
            <br />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={'underline'}
            >
              <span className="hidden sm:inline">
                {link}
              </span>

              <span className="inline sm:hidden">
                GitHub Repository
              </span>
            </a>
          </p>
        </div>
        <hr className={`my-2 border-dashed opacity-50 ${themeClasses.hrBorder}`} />
      </li>
    );
  };

  return (
    <div className={`min-h-screen pt-10 ${themeClasses.bg} ${themeClasses.text}`} style={{ fontFamily: 'Menlo,"Meslo LG",monospace', lineHeight: '1.725' }}>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="text-center mb-10">
          <h1 className={`text-3xl font-bold mb-4 ${themeClasses.accent}`} style={{ letterSpacing: '.01em', fontWeight: '700' }}>
            Our Recent Projects 👍❤️
          </h1>
          <p className={`text-sm mx-auto max-w-xl ${themeClasses.muted}`}>
            Interested in building stuff like this? The SCE Development Team is open to all students, no prior experience is required!
          </p>
          <p className={`text-sm mx-auto max-w-xl ${themeClasses.muted}`}>
            Click a row to open the associated GitHub repository in a new tab.
          </p>
        </header>

        <section className="project-list">
          <ul>
            {projects.map((project) => (
              <ProjectListItem key={project.name} {...project} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
