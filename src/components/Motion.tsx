import type { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children, className, delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0.12 : 0.42, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children }: PropsWithChildren) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -4 }}
      transition={{ duration: reduced ? 0.1 : 0.16, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedRule() {
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="animated-rule"
      initial={{ scaleX: reduced ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: reduced ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
