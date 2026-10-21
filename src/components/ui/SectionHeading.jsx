import { motion } from 'motion/react';

export default function SectionHeading({ children, themeColor = '#C9252C', as: Tag = 'h2', className = '', darkMode = true }) {
  const textColor = darkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="flex items-stretch gap-5">
      <motion.span
        aria-hidden="true"
        className="w-1.5 shrink-0 origin-top rounded-full"
        style={{ backgroundColor: themeColor }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <Tag className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${textColor} ${className}`}>
        {children}
      </Tag>
    </div>
  );
}