import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionReveal({ children, className = "", id }: SectionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      id={id}
      className={className}
    >
      {children}
    </motion.section>
  );
}
