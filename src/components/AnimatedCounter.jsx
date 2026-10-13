import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

const fmt = (n) => Math.round(n).toLocaleString('en-US');

// عدّاد بيعدّ من 0 للرقم لما يظهر في الشاشة
export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = `${prefix}${fmt(value)}${suffix}`;
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${fmt(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix, duration]);

  // dir="ltr" عشان علامة + ماتنقلش لآخر الرقم في العربي
  return (
    <span ref={ref} dir="ltr" className="inline-block tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}
