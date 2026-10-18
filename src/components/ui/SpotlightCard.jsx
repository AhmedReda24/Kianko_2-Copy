import { useRef } from 'react';

// كارت بيطلع عليه إضاءة بتتبع الماوس (من غير re-render: بنحدّث متغيرات CSS بس)
export default function SpotlightCard({
  as: Tag = 'div',
  className = '',
  color = 'rgba(255,255,255,0.10)',
  darkMode, // 👈 استخراج darkMode هنا يمنع تمريره للـ DOM
  children,
  ...rest
}) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <Tag ref={ref} onPointerMove={onMove} className={`group/spot relative overflow-hidden ${className}`} {...rest}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(380px circle at var(--x, 50%) var(--y, 50%), ${color}, transparent 60%)` }}
      />
      {children}
    </Tag>
  );
}