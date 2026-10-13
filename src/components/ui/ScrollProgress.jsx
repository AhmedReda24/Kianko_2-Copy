import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress({ themeColor }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[60] h-[3px] origin-left rtl:origin-right"
      style={{ scaleX, backgroundColor: themeColor }}
    />
  );
}
