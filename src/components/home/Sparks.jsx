import { motion, useReducedMotion } from 'motion/react';

// شرارات حديد بتطلع من أسفل الهيرو (قيم ثابتة محسوبة، من غير عشوائية أثناء الريندر)
const sparks = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 53 + 17) % 100,
  size: 2 + ((i * 7) % 4),
  delay: (i * 0.37) % 5,
  duration: 4 + ((i * 13) % 5),
  rise: 280 + ((i * 41) % 260),
  drift: ((i * 29) % 60) - 30,
}));

export default function Sparks() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute bottom-16 rounded-full bg-amber-300"
          style={{ left: `${s.left}%`, width: s.size, height: s.size, boxShadow: '0 0 8px 2px rgba(251,191,36,0.55)' }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{ y: -s.rise, x: s.drift, opacity: [0, 1, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
