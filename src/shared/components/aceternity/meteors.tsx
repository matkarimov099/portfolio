"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

type MeteorStyle = {
  left: string;
  delay: string;
  duration: string;
};

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [styles, setStyles] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: number }, (_, idx) => {
      const position = idx * (2000 / number) - 200;

      return {
        left: `${position}px`,
        delay: `-${Math.random() * 6}s`,
        duration: `${Math.random() * 5 + 7}s`,
      };
    });

    setStyles(generated);
  }, [number]);

  if (!styles.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {styles.map((style, idx) => (
        <span
          key={`${idx}-${style.left}`}
          className={cn(
            "animate-meteor-effect absolute h-1 w-1 rotate-45 rounded-full bg-slate-400",
            "before:absolute before:top-1/2 before:h-px before:w-24 before:-translate-y-1/2 before:bg-linear-to-r before:from-slate-400 before:to-transparent before:content-['']",
            className,
          )}
          style={{
            top: "-40px",
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        />
      ))}
    </motion.div>
  );
};
