import { motion } from 'motion/react';

// عنوان الأقسام الرئيسي الأصلي - أبيض ناصع 100% بدون أي تباين خفي
export default function SectionHeading({ children, themeColor = '#C9252C', as: Tag = 'h2', className = '' }) {
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
      <Tag className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white ${className}`}>
        {children}
      </Tag>
    </div>
  );
}