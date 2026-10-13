import { social } from '../config/social';

// lucide-react v1 شال أيقونات البراندات، فالأيقونات هنا SVG مباشر.
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const items = [
  {
    key: 'facebook',
    label: 'Facebook',
    icon: (
      <path
        fill="currentColor"
        d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"
      />
    ),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: (
      <g {...stroke}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </g>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <g {...stroke}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </g>
    ),
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    icon: (
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    ),
  },
];

export default function SocialLinks({ themeColor = '#C9252C', isAr = false }) {
  return (
    <ul className="flex items-center gap-3" aria-label={isAr ? 'حساباتنا على مواقع التواصل' : 'Our social media'}>
      {items.map(({ key, label, icon }) => (
        <li key={key}>
          <a
            href={social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid place-items-center h-10 w-10 rounded-full border border-white/15 bg-white/5 text-slate-200 transition-colors duration-300 hover:text-white hover:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = themeColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            onFocus={(e) => (e.currentTarget.style.backgroundColor = themeColor)}
            onBlur={(e) => (e.currentTarget.style.backgroundColor = '')}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
              {icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
