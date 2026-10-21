import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl font-bold px-8 py-4 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const variants = {
  primary: 'text-white shadow-xl',
  light: 'bg-white text-[#07132B] shadow-xl',
  glass: 'text-white border border-white/40 bg-white/5 backdrop-blur-sm hover:bg-white/15',
};

export default function CtaLink({ 
  to, 
  href, 
  themeColor, 
  variant = 'primary', 
  arrow = true, 
  darkMode,
  className = '', 
  children, 
  ...rest 
}) {
  const style = variant === 'primary' ? { backgroundColor: themeColor } : undefined;
  const cls = `${base} ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-0 w-1/3 -translate-x-full rtl:translate-x-full skew-x-[-20deg] bg-white/25 transition-transform duration-700 group-hover:translate-x-[420%] rtl:group-hover:-translate-x-[420%]"
      />
      <span className="relative">{children}</span>
      {arrow && (
        <ArrowRight className="relative w-4 h-4 transition-transform duration-300 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      )}
    </>
  );

  return to ? (
    <Link to={to} className={cls} style={style} {...rest}>{inner}</Link>
  ) : (
    <a href={href} className={cls} style={style} {...rest}>{inner}</a>
  );
}